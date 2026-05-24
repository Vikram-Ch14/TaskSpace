from flask import Blueprint, request, jsonify, g
import jwt
from config import Config


def verify_token():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "missing token"}), 401

    token = auth_header.split(" ", 1)[1]

    try:
        payload = jwt.decode(token, Config.jwt_secret_key, algorithms=["HS256"])

        g.user_id = payload["sub"]
        g.user_role = payload.get("role", "user")
        g.workspace_id = payload.get("workspace_id", None)
        g.workspace = payload.get("workspace", None)

        return None

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "token expired"}), 401

    except jwt.DecodeError:
        return jsonify({"error": "token malformed"}), 401

    except jwt.InvalidTokenError:
        return jsonify({"error": "invalid token"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def authenticateBluePrint(blueprint: Blueprint, skip: set[str] | None = None):
    skip = skip or set()

    @blueprint.before_request
    def _authenticate():
        endpoint_name = (request.endpoint or "").split(".")[-1]

        if endpoint_name in skip:
            return None

        return verify_token()


from functools import wraps
from flask import jsonify, g


def role_required(allowed_roles: list[str]):

    def wrapper(fn):

        @wraps(fn)
        def decorated(*args, **kwargs):

            userId = getattr(g, "user_id", None)

            if not userId:
                return jsonify({"message": "Unauthorized"}), 401
             
            userRole = getattr(g, "user_role", None)

            if userRole not in allowed_roles:
                return jsonify({"message": "Forbidden"}), 403

            return fn(*args, **kwargs)

        return decorated

    return wrapper
