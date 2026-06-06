export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "highest";

export interface AssigneeResponse {
  id: string;
  username: string;
}

export interface TaskResponse {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  assignee: AssigneeResponse | null;
}

export interface Tasks {
  tasks: TaskResponse[];
  total: number;
  page: number;
  per_page: number;
}