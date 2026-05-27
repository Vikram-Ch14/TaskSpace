from flask import Blueprint
from middleware.auth import role_required
from services.activitylog_service import ActivityService

activitylog_blp = Blueprint("activitylog", __name__)

@activitylog_blp.route("/<taskId>", methods=["GET"])
@role_required(["admin", "editor"])
def get_activitylog(taskId):
    return ActivityService().get_activitylog(taskId)
    