from flask import Blueprint, g, jsonify
from core.validators import validate
from schemas.user_schema import RegisterUserSchema, UserResponseSchema, LoginUserSchema
from services.user_service import UserService

users_blp = Blueprint("users", __name__)


@users_blp.route("/register", methods=["POST"])
@validate(RegisterUserSchema)
def registerUser():
    try:
        data = g.data
        print("data", data)
        user = UserService().create_user(data)
        response = UserResponseSchema.model_validate(user)
        return jsonify(response.model_dump()), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


@users_blp.route("/login", methods=["POST"])
@validate(LoginUserSchema)
def login():
    try:
        data = g.data
        token = UserService().login_user(data)
        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400


@users_blp.route("/profile", methods=["GET"])
def get_profile():
    try:
        user_id = g.user_id
        return UserService().get_user(user_id)
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    

@users_blp.route("/profile", methods=["DELETE"])
def delete_profile():
    try:
        user_id = g.user_id
        return UserService().delete_user(user_id)
    except Exception as e:
        return jsonify({"message": str(e)}), 400
