"""
src/schemas/task_schema.py
Pydantic schemas for Task API requests and responses.
"""

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional

# Reuse enums from the model — single source of truth
from models.task import TaskStatus, Priority

# REQUEST SCHEMAS (validate incoming data from client)


class CreateTaskSchema(BaseModel):
    """Schema for POST /api/tasks"""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=7000)
    status: TaskStatus = TaskStatus.TODO
    priority: Priority = Priority.MEDIUM
    due_date: Optional[datetime] = None
    assigned_to: Optional[str] = Field(None, description="User UUID of assignee")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Fix login bug",
                "description": "Users report login fails on Safari",
                "status": "todo",
                "priority": "high",
                "due_date": "2026-12-31T17:00:00Z",
                "assigned_to": "user-uuid-here",
            }
        }
    )


class UpdateTaskSchema(BaseModel):
    """Schema for PATCH /api/tasks/<id>

    All fields optional — client sends only what's changing.
    """

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[str] = None


# RESPONSE SCHEMAS (format outgoing data to client)


class AssigneeSchema(BaseModel):
    id: str
    username: str

    model_config = ConfigDict(from_attributes=True)

class TaskResponseSchema(BaseModel):
    id: str
    workspace_id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[datetime] = None

    assignee: Optional[AssigneeSchema] = None

    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskListResponseSchema(BaseModel):
    """Schema for paginated task list response."""

    tasks: list[TaskResponseSchema]
    total: int
    page: Optional[int] = None
    per_page: Optional[int] = None


class Filter(BaseModel):
    status: Optional[list[TaskStatus]] = None
    priority: Optional[list[Priority]] = None
    assigned_to: Optional[list[str]] = None
    page: Optional[int] = None
    per_page: Optional[int] = None


class TaskRequestSchema(BaseModel):
    filters: Filter = Filter()
