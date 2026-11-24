from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models import Document
from app.schemas import DocumentResponse, DocumentCreate, DocumentUpdate

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/project/{project_id}", response_model=List[DocumentResponse])
async def list_project_documents(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Document).where(Document.project_id == project_id).order_by(Document.created_at.desc())
    )
    return result.scalars().all()


@router.post("/project/{project_id}", response_model=DocumentResponse)
async def create_document(project_id: str, doc_in: DocumentCreate, db: AsyncSession = Depends(get_db)):
    doc = Document(
        project_id=project_id,
        title=doc_in.title,
        file_type=doc_in.file_type,
        content=doc_in.content or "",
        status="draft"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan")
    return doc


@router.patch("/{document_id}", response_model=DocumentResponse)
async def update_document(document_id: str, doc_update: DocumentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan")
    
    if doc_update.title is not None:
        doc.title = doc_update.title
    if doc_update.content is not None:
        doc.content = doc_update.content
    if doc_update.status is not None:
        doc.status = doc_update.status
    
    doc.version += 1
    await db.commit()
    await db.refresh(doc)
    return doc
