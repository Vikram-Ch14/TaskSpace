from database import DBSession
from models.user import User
from models.workspace import Workspace
from models.workspace_member import WorkspaceMember
from schemas.user_schema import RegisterUserSchema, UserResponseSchema
from datetime import datetime, timezone
from config import Config

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class UserRepo:

    def create_user(
        self, user_data: RegisterUserSchema, workspace_slug: str = None
    ) -> dict:
        # Logic to create a new user in the database
        with DBSession() as session:
            # Create a new user instance and add it to the session
            if session.query(User).filter_by(email=user_data.email).first():
                raise ValueError("User with this email already exists")

            user = User(
                username=user_data.username,
                email=user_data.email,
            )
            user.set_password(user_data.password)
            session.add(user)
            session.flush() 

            if workspace_slug:
                # Logic to add the user to the specified workspace
                workspace = (
                    session.query(Workspace).filter_by(slug=workspace_slug).first()
                )
                if not workspace:
                    raise ValueError("Workspace not found")

                member = WorkspaceMember(
                    workspace_id=workspace.id,
                    user_id=user.id,
                    role="editor", 
                )
                session.add(member)
            session.commit()
            # Convert to schema while session is still active
            return UserResponseSchema.model_validate(user).model_dump()

    def login_user(self, login_data):
        with DBSession() as session:
            user = session.query(User).filter_by(email=login_data.email).first()
            if not user or not user.check_password(login_data.password):
                raise ValueError("Invalid email or password")
            # Update last login time
            user.last_login_at = utc_now()
            workspace_member = session.query(WorkspaceMember).filter_by(user_id=user.id).first()

            if not workspace_member:
                raise ValueError("User not a member of any workspace")
            
            workspace = session.query(Workspace).filter_by(id=workspace_member.workspace_id).first()
            if not workspace:
                raise ValueError("Workspace not found")
            
            token = user.generate_jwt(secret_key=Config.jwt_secret_key, expires_in=3600, role=workspace_member.role, workspace=workspace.slug, workspace_id=workspace.id)
            session.commit()
            return token
    def get_user_by_id(self, user_id):
        with DBSession() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise ValueError("User not found")
            return UserResponseSchema.model_validate(user).model_dump()

    def update_user(self, user_id, update_data):
        # Logic to update an existing user's information in the database
        pass

    def delete_user(self, user_id):
        # Logic to delete a user from the database
        with DBSession() as session:
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                raise ValueError("User not found")
            session.delete(user)
            session.commit()
            return {"message": "User deleted successfully"}
