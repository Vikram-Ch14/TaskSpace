from models.workspace_member import WorkspaceMember
from database import DBSession
from flask import g
from models.task import Task, TaskStatus
from schemas.task_schema import TaskResponseSchema, TaskListResponseSchema
from datetime import datetime, timezone, timedelta
from sqlalchemy import func, text
from services.activitylog_service import ActivityService
from models.activitylog import ActivityAction

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

            ActivityService().log(
                session=session,
                workspace_id=workspaceId,
                user_id=userId,
                action=ActivityAction.TASK_CREATED.value,
                task_id=task.id,
                metadata={
                    "task_title": task.title,
                    "priority": task.priority,
                    "username": g.username,
                },
            )
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
            deleted_title = task.title
            deleted_priority = task.priority

            ActivityService().log(
                session=session,
                workspace_id=workspaceId,
                user_id=g.user_id,
                action=ActivityAction.TASK_DELETED.value,
                task_id=task.id,
                metadata={
                    "task_title": deleted_title,
                    "priority": deleted_priority,
                    "username": g.username,
                },
            )
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

            old_values = {
                field: getattr(task, field) for field in ALLOWED_UPDATE_FIELDS
            }

            updates = task_data.model_dump(exclude_unset=True)

            updates = {k: v for k, v in updates.items() if k in ALLOWED_UPDATE_FIELDS}

            if not updates:
                raise ValueError("No fields provided to update")

            changes = {}
            for field in ALLOWED_UPDATE_FIELDS:
                new_value = updates.get(field)
                old_value = old_values.get(field)
                if new_value != old_value and new_value is not None:
                    changes[field] = {
                        "old": old_value,
                        "new": new_value,
                    }
            if changes:
                ActivityService().log(
                    session=session,
                    workspace_id=workspace_id,
                    user_id=g.user_id,
                    action=ActivityAction.TASK_UPDATED.value,
                    task_id=task.id,
                    metadata={
                        "task_title": task.title,
                        "changes": changes,
                        "username": g.username,
                    },
                )
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
            count = query.count()

            status = data.filters.status
            priority = data.filters.priority
            assigned_to = data.filters.assigned_to
            page = data.filters.page
            per_page = data.filters.per_page

            if status and len(status) > 0:
                query = query.filter(Task.status.in_(status))
            if priority and len(priority) > 0:
                query = query.filter(Task.priority.in_(priority))
            if assigned_to and len(assigned_to) > 0:
                query = query.filter(Task.assigned_to.in_(assigned_to))
            if page and per_page:
                query = query.limit(per_page).offset((page - 1) * per_page)

            tasks = query.all()
            tasksList = [
                TaskResponseSchema.model_validate(task).model_dump(mode="json")
                for task in tasks
            ]
            return TaskListResponseSchema(
                tasks=tasksList,
                total=count,
                page=page,
                per_page=per_page,
            ).model_dump(mode="json")

    def get_dashboard_tasks(self):
        with DBSession() as session:
            workspace_id = g.workspace_id
            now = datetime.now(timezone.utc)
            week_start = now - timedelta(days=now.weekday())

            week_start = week_start.replace(
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )

            week_end = week_start + timedelta(days=7)

            (
                total_tasks,
                completed_tasks,
                overdue_tasks,
                tasks_due_this_week,
            ) = (
                session.query(
                    func.count(Task.id),
                    func.count().filter(Task.status == TaskStatus.DONE.value),
                    func.count().filter(
                        Task.due_date.isnot(None),
                        Task.due_date < now,
                        Task.status != TaskStatus.DONE.value,
                    ),
                    func.count().filter(
                        Task.due_date.isnot(None),
                        Task.due_date >= week_start,
                        Task.due_date < week_end,
                    ),
                )
                .filter(Task.workspace_id == workspace_id)
                .one()
            )

            tasks = {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "overdue_tasks": overdue_tasks,
                "tasks_due_this_week": tasks_due_this_week,
            }

            status_counts = (
                session.query(
                    Task.status,
                    func.count(Task.id),
                )
                .filter(Task.workspace_id == workspace_id)
                .group_by(Task.status)
                .all()
            )

            tasks_by_status = {
                "todo": 0,
                "in_progress": 0,
                "done": 0,
            }

            for status, count in status_counts:
                tasks_by_status[status] = count

            priority_counts = (
                session.query(
                    Task.priority,
                    func.count(Task.id),
                )
                .filter(Task.workspace_id == workspace_id)
                .group_by(Task.priority)
                .all()
            )

            tasks_by_priority = {
                "low": 0,
                "medium": 0,
                "high": 0,
                "highest": 0,
            }

            for priority, count in priority_counts:
                tasks_by_priority[priority] = count

            workspace_members = (
                session.query(WorkspaceMember)
                .filter(WorkspaceMember.workspace_id == workspace_id)
                .all()
            )

            velocity_counts = (
                session.query(
                    Task.assigned_to,
                    func.count(Task.id).label("total_tasks"),
                    func.count(Task.id)
                    .filter(Task.status == TaskStatus.DONE.value)
                    .label("completed_tasks"),
                )
                .filter(
                    Task.workspace_id == workspace_id,
                    Task.assigned_to.isnot(None),
                )
                .group_by(Task.assigned_to)
                .all()
            )

            velocity_map = {
                assigned_to: {
                    "total_tasks": total_tasks,
                    "completed_tasks": completed_tasks,
                }
                for assigned_to, total_tasks, completed_tasks in velocity_counts
            }

            velocity = []

            for member in workspace_members:
                vmap = velocity_map.get(member.user_id, {})
                velocity.append(
                    {
                        "user_id": member.user_id,
                        "username": member.user.username,
                        "completed_tasks": vmap.get("completed_tasks", 0),
                        "total_tasks": vmap.get("total_tasks", 0),
                    }
                )

            return {
                "tasks": tasks,
                "tasks_by_status": tasks_by_status,
                "tasks_by_priority": tasks_by_priority,
                "velocity": velocity,
            }

    def task_search(self, query):
        sql = text("""
            SELECT
                tasks.id,
                tasks.title,
                tasks.description,
                tasks.status,
                tasks.priority,
                bm25(tasks_fts, 10.0, 2.0) as rank
            FROM tasks_fts
            JOIN tasks
                ON tasks.rowid = tasks_fts.rowid
            WHERE tasks.workspace_id = :workspace_id
            AND tasks_fts MATCH :query
            ORDER BY rank
            LIMIT 20;
        """)
        with DBSession() as session:
            workspace_id = g.workspace_id
            result = session.execute(
                sql,
                {
                    "workspace_id": workspace_id,
                    "query": query,
                },
            )

            rows = result.mappings().all()
            return [dict(row) for row in rows]
