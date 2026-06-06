import type { LucideIcon } from "lucide-react";

export type Velocity = {
  completed_tasks: number;
  user_id: string;
  username: string;
  total_tasks: number;
};

export type TaskStats = {
  tasks: {
    completed_tasks: number;
    total_tasks: number;
    overdue_tasks: number;
    tasks_due_this_week: number;
  };
  tasks_by_priority: {
    high: number;
    medium: number;
    low: number;
    highest: number;
  };
  tasks_by_status: {
    todo: number;
    in_progress: number;
    done: number;
  };
  velocity: Velocity[];
};

export type StatItem = {
  title: string;
  value: string;
  description: string;
  color: string;
  icon: LucideIcon;
};

export type PriorityItem = {
  label: string;
  value: number;
  count: number;
  color: string;
};

export type VelocityItem = {
  name: string;
  value: number;
  count: number;
  percentage: number;
};

export type DashboardState = {
  stats: StatItem[];
  priorities: PriorityItem[];
  velocity: VelocityItem[];
};
