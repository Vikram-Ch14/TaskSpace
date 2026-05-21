from flask import Blueprint, g, jsonify
from schemas.workspace_schema import WorkSpaceSchema
from services.workspace_service import WorkSpaceService
from core.validators import validate


workspace_blp = Blueprint("workspace", __name__)

@workspace_blp.route("/create", methods=["POST"])
@validate(WorkSpaceSchema)
def create_workspace():
    try:
        data = g.data
        return WorkSpaceService().create_workspace(data), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception:
        return jsonify({"message": "Internal server error"}), 500