"""
src/models/activity_log.py
Append-only audit log of significant workspace events.
"""
from database import Base
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from enum import Enum
import uuid


def gen_uuid() -> str:
    return str(uuid.uuid4())


# Activity Event Types (Python Enum)
class ActivityAction(str, Enum):
    """Valid activity log action types."""
    
    # Task lifecycle events
    TASK_CREATED = "task_created"
    TASK_UPDATED = "task_updated"
    TASK_DELETED = "task_deleted"
    TASK_ASSIGNED = "task_assigned"
    TASK_COMPLETED = "task_completed"


# ActivityLog Model
class ActivityLog(Base):
    """Records significant events that occur in a workspace.
    """
    __tablename__ = "activity_logs"
    
    # Primary key
    id = Column(String(36), primary_key=True, default=gen_uuid)
    
    # Which workspace this event belongs to (multi-tenant isolation)
    workspace_id = Column(
        String(36),
        ForeignKey("workspace.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # Which task this event relates to (nullable: some events aren't task-related)
    task_id = Column(
        String(36),
        ForeignKey("tasks.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # Who performed the action (nullable: user may be deleted later)
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    
    # What happened (e.g., "task_created", "task_completed")
    action = Column(String(50), nullable=False)
    
    # Structured details about the event (JSON encoded as text)
    activity_metadata = Column(Text, nullable=True)
    
    # When the event occurred
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )
    
    # Relationships
    workspace = relationship("Workspace", backref="activity_logs")
    task = relationship("Task", backref="activity_logs")
    user = relationship("User", backref="activity_logs")
    
    def __repr__(self):
        return (
            f"<ActivityLog "
            f"action={self.action} "
            f"user={self.user_id} "
            f"task={self.task_id} "
            f"at={self.created_at}>"
        )
    
    def to_dict(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "action": self.action,
            "user_id": self.user_id,
            "activity_metadata": self.activity_metadata,
            "created_at": self.created_at,
            "workspace_id": self.workspace_id
        }