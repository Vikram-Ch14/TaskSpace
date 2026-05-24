from flask import Blueprint, g, jsonify
from middleware.auth import role_required
from core.validators import validate
from services.task_service import TaskService
from schemas.task_schema import CreateTaskSchema, UpdateTaskSchema

task_blp = Blueprint("task", __name__)


@task_blp.route("/create", methods=["POST"])
@role_required(["admin", "editor"])
@validate(CreateTaskSchema)
def create_task():
    try:
        data = g.data
        return TaskService().create_task(data)
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Internal server error"}), 500


@task_blp.route("/<taskId>", methods=["GET"])
@role_required(["admin", "editor"])
def get_taskById(taskId):
    try:
        return TaskService().get_taskById(taskId)
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Internal server error"}), 500
    
@task_blp.route("/<taskId>", methods=["DELETE"])
@role_required(["admin", "editor"])
def delete_task(taskId):
    try:
        return TaskService().delete_task(taskId)
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Internal server error"}), 500
    

@task_blp.route("/<taskId>", methods=["PUT"])
@role_required(["admin", "editor"])
@validate(UpdateTaskSchema)
def update_task(taskId):
    try:
        data = g.data
        return TaskService().update_task(taskId, data)
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Internal server error"}), 500
    

@task_blp.route("/user/tasks", methods=["GET"])
def get_user_tasks():
    try:
        return TaskService().get_user_tasks()
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Internal server error"}), 500
