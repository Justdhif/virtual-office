from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field


# --- Auth / User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Agent Schemas ---
class AgentResponse(BaseModel):
    id: str
    name: str
    role: str
    department: str
    avatar_color: str
    is_active: bool

    class Config:
        from_attributes = True


class AgentInstanceResponse(BaseModel):
    id: str
    project_id: str
    agent_id: str
    current_status: str
    current_task_id: Optional[str] = None
    last_activity_at: datetime

    class Config:
        from_attributes = True


# --- Task Schemas ---
class TaskBase(BaseModel):
    title: str
    description: str
    priority: str = "medium"
    dependencies: List[str] = []


class TaskCreate(TaskBase):
    agent_id: str


class TaskResponse(TaskBase):
    id: str
    project_id: str
    agent_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Research Sources & Citations ---
class ResearchSourceCreate(BaseModel):
    title: str
    authors: List[str] = []
    publication_year: Optional[int] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    abstract: Optional[str] = None


class ResearchSourceResponse(ResearchSourceCreate):
    id: str
    project_id: str
    verification_status: str
    created_at: datetime

    class Config:
        from_attributes = True


class CitationResponse(BaseModel):
    id: str
    source_id: str
    citation_style: str
    in_text_citation: str
    bibliography_entry: str

    class Config:
        from_attributes = True


# --- Document Schemas ---
class DocumentCreate(BaseModel):
    title: str
    file_type: str = "markdown"
    content: Optional[str] = None


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None


class DocumentResponse(BaseModel):
    id: str
    project_id: str
    title: str
    file_type: str
    content: Optional[str] = None
    version: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Approval Schemas ---
class ApprovalResponse(BaseModel):
    id: str
    project_id: str
    task_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    requested_by: str
    approval_status: str
    reviewer_comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ApprovalAction(BaseModel):
    status: str  # approved, rejected, revision_requested
    comment: Optional[str] = None


# --- Project Schemas ---
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    research_topic: str
    academic_level: str = "undergraduate"
    research_type: str = "literature_review"
    citation_style: str = "APA 7th"


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(ProjectCreate):
    id: str
    user_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Real-Time Event Schema ---
class RealTimeEvent(BaseModel):
    event_type: str
    project_id: str
    agent_id: Optional[str] = None
    data: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)
