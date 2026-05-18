from flask import Blueprint, g, request, jsonify
from flask.views import MethodView
from backend.src.core.validators import validate
from backend.src.schemas.user_schema import RegisterUserSchema
from backend.src.services.user_service import UserService

users_blp = Blueprint("users", __name__)


@users_blp.route("/register")
class RegisterUser(MethodView):
    @validate(RegisterUserSchema)
    def post(self):
        data = g.data
        return UserService().create_user(data)
