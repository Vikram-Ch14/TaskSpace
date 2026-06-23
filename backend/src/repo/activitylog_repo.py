from flask import jsonify

from models.activitylog import ActivityLog
from database import DBSession
from sqlalchemy.orm import joinedload
import json

class ActivitylogRepo:
    def get_activitylog(self, taskId):
        with DBSession() as session:
            activitylog = session.query(ActivityLog).filter_by(task_id=taskId).all()
            return jsonify([log.to_dict() for log in activitylog])
        
    def get_activitylogs(self):
        with DBSession() as session:
            logs = (
                session.query(ActivityLog)
                .options(joinedload(ActivityLog.user))
                .order_by(ActivityLog.created_at.desc())
                .all()
            )

            result = []

            for log in logs:
                result.append({
                    "id": log.id,
                    "workspace_id": log.workspace_id,
                    "task_id": log.task_id,
                    "user_id": log.user_id,
                    "action": log.action,
                    "metadata": json.loads(log.activity_metadata)
                        if log.activity_metadata else {},
                    "created_at": log.created_at.isoformat(),
                    "user_name": log.user.username if log.user else None,
                })

            return result