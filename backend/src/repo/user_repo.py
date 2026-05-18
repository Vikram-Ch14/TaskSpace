from backend.src.database import DBSession
from backend.src.models.user import User
from backend.src.schemas.user_schema import RegisterUserSchema


class UserRepo:

    def create_user(self, user_data: RegisterUserSchema) -> dict:
        # Logic to create a new user in the database
        with DBSession() as session:
            # Create a new user instance and add it to the session
            if session.query(User).filter_by(email=user_data.email).first():
                return {"message": "User with this email already exists"}, 400

            user = User(
                username=user_data.username,
                email=user_data.email,
            )
            user.set_password(user_data.password)
            session.add(user)
            session.commit()
            return {"message": "User created successfully", "user_id": user.id}, 201

    def get_user_by_id(self, user_id):
        # Logic to retrieve a user by their ID from the database
        pass

    def update_user(self, user_id, update_data):
        # Logic to update an existing user's information in the database
        pass

    def delete_user(self, user_id):
        # Logic to delete a user from the database
        pass
