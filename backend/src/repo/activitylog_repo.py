from flask import jsonify

from models.activitylog import ActivityLog
from database import DBSession

class ActivitylogRepo:
    def get_activitylog(self, taskId):
        with DBSession() as session:
            activitylog = session.query(ActivityLog).filter_by(task_id=taskId).all()
            return jsonify([log.to_dict() for log in activitylog])
        
    def get_activitylogs(self):
        pass