from models.activitylog import ActivityLog
import json
from repo.activitylog_repo import ActivitylogRepo


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

        activity_log = ActivityLog(
            workspace_id=workspace_id,
            user_id=user_id,
            action=action,
            task_id=task_id,
            activity_metadata=json.dumps(metadata) if metadata else None,
        )
        session.add(activity_log)
        return activity_log
    
    def get_activitylog(self, taskId: str):
        return ActivitylogRepo().get_activitylog(taskId)
    
    def get_activitylogs(self):
        return ActivitylogRepo().get_activitylogs()
