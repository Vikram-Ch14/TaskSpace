from database import DBSession
from models.workspace import Workspace
from models.workspace_member import WorkspaceMember
from schemas.member_schema import MemberResponseSchema

class MemberRepo:
    def get_members(self, workspace_slug: str = None):
        with DBSession() as session:
            if not workspace_slug:
                raise ValueError("Workspace is required")

            workspace = session.query(Workspace).filter_by(slug=workspace_slug).first()
            if not workspace:
                raise ValueError("Workspace not found")

            members = session.query(WorkspaceMember).filter_by(workspace_id=workspace.id).all()
            users = [member.user  for member in members]
            
            return [MemberResponseSchema.model_validate(user).model_dump() for user in users]
