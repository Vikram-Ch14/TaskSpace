from flask import Blueprint
from middleware.auth import role_required
from services.task_service import TaskService

task_blp = Blueprint("task", __name__)

@task_blp.route("/create", methods=["POST"])
@role_required(["admin", "editor"])
def create_task():
    return TaskService().create_task()