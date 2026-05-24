from database import DBSession
from flask import g
from models.task import Task
from schemas.task_schema import TaskResponseSchema
from datetime import datetime, timezone


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


ALLOWED_UPDATE_FIELDS = {
    "title",
    "description",
    "status",
    "priority",
    "due_date",
    "assigned_to",
}


class TaskRepo:

    def create_task(self, task_data):
        with DBSession() as session:
            userId = g.user_id
            if not userId:
                raise ValueError("User not found")
            workspaceId = g.workspace_id
            if not workspaceId:
                raise ValueError("Workspace not found")

            task = Task(
                title=task_data.title,
                description=task_data.description,
                created_by=userId,
                workspace_id=workspaceId,
                status=task_data.status,
                priority=task_data.priority,
                due_date=task_data.due_date,
                assigned_to=task_data.assigned_to,
            )
            session.add(task)
            session.flush()
            response = TaskResponseSchema.model_validate(task).model_dump(mode="json")
            session.commit()

            return response

    def get_taskById(self, task_id):
        with DBSession() as session:
            workspaceId = g.workspace_id
            task = (
                session.query(Task)
                .filter_by(id=task_id, workspace_id=workspaceId)
                .first()
            )
            if not task:
                raise ValueError("Task not found")
            return TaskResponseSchema.model_validate(task).model_dump(mode="json")

    def delete_task(self, task_id):
        with DBSession() as session:
            workspaceId = g.workspace_id
            task = (
                session.query(Task)
                .filter_by(id=task_id, workspace_id=workspaceId)
                .first()
            )
            if not task:
                raise ValueError("Task not found")
            session.delete(task)
            session.commit()
            return {"message": "Task deleted successfully"}

    def update_task(self, task_id: str, task_data) -> dict:
        with DBSession() as session:
            workspace_id = g.workspace_id

            task = (
                session.query(Task)
                .filter_by(id=task_id, workspace_id=workspace_id)
                .first()
            )
            if not task:
                raise ValueError("Task not found")

            updates = task_data.model_dump(exclude_unset=True)

            updates = {k: v for k, v in updates.items() if k in ALLOWED_UPDATE_FIELDS}

            if not updates:
                raise ValueError("No fields provided to update")

            # Apply each update dynamically
            for field, value in updates.items():
                setattr(task, field, value)

            task.updated_at = utc_now()
            session.commit()

            return TaskResponseSchema.model_validate(task).model_dump(mode="json")

    def get_user_tasks(self):
        with DBSession() as session:
            user_id = g.user_id
            workspace_id = g.workspace_id
            tasks = (
                session.query(Task)
                .filter_by(created_by=user_id, workspace_id=workspace_id)
                .all()
            )
            return [
                TaskResponseSchema.model_validate(task).model_dump(mode="json")
                for task in tasks
            ]

    def get_all_tasks(self, data):
        with DBSession() as session:
            workspace_id = g.workspace_id
            query = session.query(Task).filter_by(workspace_id=workspace_id)
            status = data.status
            priority = data.priority
            assigned_to = data.assigned_to
            page = data.page
            per_page = data.per_page
            if status and len(status) > 0:
                query = query.filter(Task.status.in_(status))
            if priority and len(priority) > 0:
                query = query.filter(Task.priority.in_(priority))
            if assigned_to and len(assigned_to) > 0:
                query = query.filter(Task.assigned_to.in_(assigned_to))
            if page and per_page:
                query = query.limit(per_page).offset((page - 1) * per_page)
            tasks = query.all()
            return [
                TaskResponseSchema.model_validate(task).model_dump(mode="json")
                for task in tasks
            ]
