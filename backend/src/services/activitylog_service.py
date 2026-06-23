from models.activitylog import ActivityLog
import json
from repo.activitylog_repo import ActivitylogRepo
from pydantic_core import to_json


class ActivityService:

    def log(
        self,
        session,
        workspace_id: str,
        user_id: str,
        action: str,
        task_id: str = None,
        metadata: dict = None,
    ):

        try:
            activity_log = ActivityLog(
                workspace_id=workspace_id,
                user_id=user_id,
                action=action,
                task_id=task_id,
                activity_metadata=to_json(metadata).decode(),
            )
            session.add(activity_log)
            return activity_log
        except Exception as e:
            print("Error logging activity:", e)

    def get_activitylog(self, taskId: str):
        return ActivitylogRepo().get_activitylog(taskId)

    def get_activitylogs(self):
        return ActivitylogRepo().get_activitylogs()
