from flask import Blueprint, g, jsonify
from flask.views import MethodView
from core.validators import validate
from schemas.user_schema import RegisterUserSchema, UserResponseSchema
from services.user_service import UserService

users_blp = Blueprint("users", __name__)


@users_blp.route("/register")
class RegisterUser(MethodView):
    @validate(RegisterUserSchema)
    def post(self):
        try:
            data = g.data
            print("Received registration data:", data)
            user = UserService().create_user(data)
            response = UserResponseSchema.model_validate(user)
            return response.model_dump(), 201
        except ValueError as e:
            return jsonify({"message": str(e)}), 400
