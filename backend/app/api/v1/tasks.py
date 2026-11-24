from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models import Task
from app.schemas import TaskResponse, TaskCreate

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/project/{project_id}", response_model=List[TaskResponse])
async def list_project_tasks(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Task).where(Task.project_id == project_id).order_by(Task.created_at.asc())
    )
    return result.scalars().all()


@router.post("/project/{project_id}", response_model=TaskResponse)
async def create_task(project_id: str, task_in: TaskCreate, db: AsyncSession = Depends(get_db)):
    task = Task(
        project_id=project_id,
        agent_id=task_in.agent_id,
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        dependencies=task_in.dependencies,
        status="backlog"
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task
