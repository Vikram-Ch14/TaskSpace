from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base
import uuid


def gen_uuid() -> str:
    return str(uuid.uuid4())


class WorkspaceMember(Base):
    """Junction table: connects users to workspaces with a role."""

    __tablename__ = "workspace_members"

    id = Column(String(36), primary_key=True, default=gen_uuid)

    workspace_id = Column(
        String(36),
        ForeignKey("workspace.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role = Column(String(20), nullable=False, default="viewer")
    joined_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Relationships: navigate to related objects in Python code
    # Lets you write: membership.user → User object
    # AND adds: alice.memberships → list of memberships (via backref)
    user = relationship("User", backref="memberships")

    # Lets you write: membership.workspace → Workspace object
    # AND adds: demo_ws.members → list of memberships (via backref)
    workspace = relationship("Workspace", backref="members")

    # Database-level rules (constraints + indexes)
    __table_args__ = (
        # Prevent the same user from being added to the same workspace twice
        # (otherwise you'd have duplicate membership rows with conflicting roles)
        UniqueConstraint("workspace_id", "user_id", name="uq_workspace_user"),
    )

    # How this object prints in logs and debugger
    def __repr__(self) -> str:
        # Without this: <WorkspaceMember object at 0x7f8a1c0e9c50>  ← Useless
        # With this:    <WorkspaceMember user=abc-123 workspace=xyz-789 role=admin>  ← Useful
        return (
            f"<WorkspaceMember "
            f"user={self.user_id} "
            f"workspace={self.workspace_id} "
            f"role={self.role}>"
            f"joined_at={self.user, self.workspace}"
        )
