from repo.user_repo import UserRepo
from schemas.user_schema import RegisterUserSchema
from config import Config


class UserService:
    def create_user(self, user_data: RegisterUserSchema) -> dict:
        return UserRepo().create_user(user_data, Config.workspace_slug)
    
    def login_user(self, login_data):
        return UserRepo().login_user(login_data)
    
    def get_user(self, user_id):
        return UserRepo().get_user_by_id(user_id)
    
    def delete_user(self, user_id):
        return UserRepo().delete_user(user_id)