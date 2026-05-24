"""
src/models/task.py
"""
from database import Base
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Text,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from enum import Enum
import uuid


def gen_uuid() -> str:
    return str(uuid.uuid4())


# Enums for valid values
class TaskStatus(str, Enum):
    """Valid task status values."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Priority(str, Enum):
    """Valid task priority values."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    HIGHEST = "highest"   


# Task Model
class Task(Base):
    """A task within a workspace.
    
    Tasks are the core entity of the app. Every task belongs to exactly
    one workspace and tracks who created it and who's responsible.
    """
    __tablename__ = "tasks" 
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    
    # Multi-tenant scoping (CRITICAL — every query filters by this)
    workspace_id = Column(
        String(36),
        ForeignKey("workspace.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # Content
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Workflow state
    status = Column(
        String(20),
        nullable=False,
        default=TaskStatus.TODO.value,
        index=True,   # Indexed for dashboard queries
    )
    priority = Column(
        String(20),
        nullable=False,
        default=Priority.MEDIUM.value,   # Default to medium, not low
    )
    
    # Scheduling
    due_date = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,   # Indexed for "overdue tasks" queries
    )
    
    # User relationships
    assigned_to = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),  
        nullable=True,
        index=True,   # Indexed for "my tasks" queries
    )
    created_by = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),   
        nullable=True,
    )
    
    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    
    # Relationships
    workspace = relationship("Workspace", backref="tasks")
    assignee = relationship(
        "User",
        foreign_keys=[assigned_to],
        backref="assigned_tasks",
    )
    creator = relationship(
        "User",
        foreign_keys=[created_by],
        backref="created_tasks",
    )
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint(
            "status IN ('todo', 'in_progress', 'done')",
            name="ck_task_status_valid",
        ),
        CheckConstraint(
            "priority IN ('low', 'medium', 'high', 'highest')",
            name="ck_task_priority_valid",
        ),
    )
    
    def __repr__(self):
        return (
            f"<Task id={self.id} "
            f"title={self.title!r} "
            f"status={self.status} "
            f"priority={self.priority}>"
            f"assigned_to={self.assigned_to} "
            f"created_by={self.created_by} "
            f"created_at={self.created_at} "
            f"updated_at={self.updated_at}"
        )