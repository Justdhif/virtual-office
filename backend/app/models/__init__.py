import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="director")  # director, admin
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    research_topic = Column(Text, nullable=False)
    academic_level = Column(String(50), default="undergraduate")  # undergraduate, graduate, postgrad
    research_type = Column(String(50), default="literature_review")  # literature_review, quantitative, qualitative
    citation_style = Column(String(50), default="APA 7th")
    status = Column(String(50), default="planning")  # planning, researching, writing, reviewing, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    agent_instances = relationship("AgentInstance", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    sources = relationship("ResearchSource", back_populates="project", cascade="all, delete-orphan")
    citations = relationship("Citation", back_populates="project", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    messages = relationship("AgentMessage", back_populates="project", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="project", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="project", cascade="all, delete-orphan")


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String(50), primary_key=True)  # e.g., 'project_manager', 'researcher', etc.
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    avatar_color = Column(String(20), default="#3b82f6")
    system_prompt = Column(Text, nullable=False)
    model_config_data = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)


class AgentInstance(Base):
    __tablename__ = "agent_instances"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    agent_id = Column(String(50), ForeignKey("agents.id"), nullable=False)
    current_status = Column(String(50), default="idle")  # idle, thinking, working, completed, error
    current_task_id = Column(String(36), nullable=True)
    last_activity_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="agent_instances")
    agent = relationship("Agent")
    tasks = relationship("Task", back_populates="agent_instance")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    agent_instance_id = Column(String(36), ForeignKey("agent_instances.id"), nullable=True)
    agent_id = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="backlog")  # backlog, assigned, in_progress, waiting, review, completed, failed
    priority = Column(String(20), default="medium")  # low, medium, high
    dependencies = Column(JSON, default=list)  # list of task IDs
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="tasks")
    agent_instance = relationship("AgentInstance", back_populates="tasks")


class ResearchSource(Base):
    __tablename__ = "research_sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(500), nullable=False)
    authors = Column(JSON, default=list)
    publication_year = Column(Integer, nullable=True)
    doi = Column(String(255), nullable=True)
    url = Column(Text, nullable=True)
    abstract = Column(Text, nullable=True)
    verification_status = Column(String(50), default="unverified")  # verified, unverified, invalid
    source_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="sources")


class Citation(Base):
    __tablename__ = "citations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    source_id = Column(String(36), ForeignKey("research_sources.id"), nullable=False)
    citation_style = Column(String(50), default="APA 7th")
    in_text_citation = Column(String(255), nullable=False)
    bibliography_entry = Column(Text, nullable=False)

    project = relationship("Project", back_populates="citations")
    source = relationship("ResearchSource")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    file_type = Column(String(20), default="markdown")  # markdown, docx, pdf, txt
    content = Column(Text, nullable=True)
    storage_path = Column(String(500), nullable=True)
    version = Column(Integer, default=1)
    status = Column(String(50), default="draft")  # draft, in_review, approved
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="documents")


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    sender_agent_id = Column(String(50), nullable=False)
    receiver_agent_id = Column(String(50), nullable=False)
    message_type = Column(String(50), default="task_result")
    content = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="messages")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    agent_id = Column(String(50), nullable=False)
    event_type = Column(String(100), nullable=False)  # task.started, thinking, message_sent, etc.
    description = Column(Text, nullable=False)
    metadata_info = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="activity_logs")


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    task_id = Column(String(36), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    requested_by = Column(String(50), nullable=False)  # agent_id
    approval_status = Column(String(50), default="pending")  # pending, approved, rejected, revision_requested
    reviewer_comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="approvals")
