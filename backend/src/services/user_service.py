from repo.user_repo import UserRepo
from schemas.user_schema import RegisterUserSchema


class UserService:
    def create_user(self, user_data: RegisterUserSchema) -> dict:
        return UserRepo().create_user(user_data)