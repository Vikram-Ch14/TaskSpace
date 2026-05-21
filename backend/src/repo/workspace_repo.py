from database import DBSession
from models.user import User
from models.workspace import Workspace
from schemas.workspace_schema import WorkSpaceResponseSchema

class WorkSpaceRepo:
    def create_workspace(self, workspace_data):
        with DBSession() as session:
            existing_user = session.query(User).filter_by(id=workspace_data.owner_id).first()
            if existing_user:
                existing_workspaceName = session.query(Workspace).filter_by(name=workspace_data.name, owner_id=workspace_data.owner_id).first()
                existing_workspaceSlug = session.query(Workspace).filter_by(slug=workspace_data.slug).first()
                if existing_workspaceSlug:
                    raise ValueError("Workspace with this slug already exists")
                if existing_workspaceName:
                    raise ValueError("Workspace with this name already exists for the user")
                
                workspace = Workspace(
                    name=workspace_data.name,
                    slug=workspace_data.slug,
                    owner_id=workspace_data.owner_id
                )
                session.add(workspace)
                session.commit()
                return WorkSpaceResponseSchema.model_validate(workspace).model_dump()
            else:
                raise ValueError("User not found")