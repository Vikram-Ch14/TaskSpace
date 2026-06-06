import type { TaskStatus, TaskPriority } from "@/api/taskService/types";

export interface TaskCardData {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  isOverdue: boolean;
  assignee: {
    initial: string;
    name: string;
    color: string;
  } | null;
}