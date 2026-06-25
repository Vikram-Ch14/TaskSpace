export type ActivityEventType =
  | "created"
  | "completed"
  | "updated"
  | "assigned"
  | "deleted"
  | "reopened";

export type ChangeValue = string | number | boolean | null;

export interface ActivityChange {
  old: ChangeValue;
  new: ChangeValue;
}

interface ActivityMetadata {
  task_title: string;
  priority?: string;
  status?: string;
  changes?: Record<string, ActivityChange>;
}

export interface ActivityLog {
  id: string;
  workspace_id: string;
  task_id: string | null;
  user_id: string | null;
  user_name: string;
  action: string;
  metadata: ActivityMetadata;
  created_at: string;
}