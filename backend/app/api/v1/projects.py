from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models import Project, User, AgentInstance
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.agents.registry import DEFAULT_AGENTS
from app.agents.orchestrator import orchestrator

router = APIRouter(prefix="/projects", tags=["Projects"])


async def get_or_create_default_user(db: AsyncSession) -> User:
    res = await db.execute(select(User))
    user = res.scalars().first()
    if not user:
        user = User(
            name="Director",
            email="director@researchverse.ai",
            password_hash="demo_hash",
            role="director"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


@router.get("", response_model=List[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    return result.scalars().all()


@router.post("", response_model=ProjectResponse)
async def create_project(project_in: ProjectCreate, db: AsyncSession = Depends(get_db)):
    user = await get_or_create_default_user(db)
    new_project = Project(
        user_id=user.id,
        title=project_in.title,
        description=project_in.description,
        research_topic=project_in.research_topic,
        academic_level=project_in.academic_level,
        research_type=project_in.research_type,
        citation_style=project_in.citation_style,
        status="planning"
    )
    db.add(new_project)
    await db.flush()

    # Assign all 8 agents to this new project
    for agent_def in DEFAULT_AGENTS:
        instance = AgentInstance(
            project_id=new_project.id,
            agent_id=agent_def["id"],
            current_status="idle"
        )
        db.add(instance)

    await db.commit()
    await db.refresh(new_project)
    return new_project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Proyek tidak ditemukan")
    return project


@router.post("/{project_id}/start")
async def start_project_pipeline(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Proyek tidak ditemukan")
    
    project.status = "in_progress"
    await db.commit()

    # Launch autonomous agent workflow
    await orchestrator.start_research_pipeline(project.id, project.research_topic)

    return {
        "status": "success",
        "message": "AI Multi-Agent pipeline started successfully",
        "project_id": project.id
    }
