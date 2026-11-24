from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models import Approval, Project
from app.schemas import ApprovalResponse, ApprovalAction
from app.websocket.manager import manager

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.get("/project/{project_id}", response_model=List[ApprovalResponse])
async def list_project_approvals(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Approval).where(Approval.project_id == project_id).order_by(Approval.created_at.desc())
    )
    return result.scalars().all()


@router.post("/{approval_id}/action", response_model=ApprovalResponse)
async def take_approval_action(
    approval_id: str,
    action: ApprovalAction,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Approval).where(Approval.id == approval_id))
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval checkpoint tidak ditemukan")
    
    approval.approval_status = action.status
    approval.reviewer_comment = action.comment

    # If approved, update project status
    if action.status == "approved":
        proj_res = await db.execute(select(Project).where(Project.id == approval.project_id))
        project = proj_res.scalar_one_or_none()
        if project:
            project.status = "completed"

    await db.commit()
    await db.refresh(approval)

    # Broadcast event to 3D office
    await manager.broadcast_to_project(
        project_id=approval.project_id,
        event_data={
            "event_type": "project.approval_resolved",
            "approval_id": approval.id,
            "status": action.status,
            "comment": action.comment
        }
    )

    return approval
