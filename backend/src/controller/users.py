from flask import Blueprint, request, jsonify
from flask.views import MethodView
from services.users import UserService

users_blp = Blueprint("users", __name__)


@users_blp.route("/register")
class RegisterUser(MethodView):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        return UserService().create_user(username, password)
