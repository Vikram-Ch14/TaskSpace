import type { TaskStatus, TaskPriority } from "@/api/taskService/types";

export const avatarColors = [
  "bg-violet-600",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-amber-600",
  "bg-rose-600",
] as const;

export const priorityStyles: Record<
  TaskPriority,
  {
    text: string;
    dot: string;
    label: string;
  }
> = {
  highest: {
    text: "text-red-900",
    dot: "bg-red-500",
    label: "Highest",
  },
  high: {
    text: "text-amber-900",
    dot: "bg-amber-600",
    label: "High",
  },
  medium: {
    text: "text-blue-900",
    dot: "bg-blue-600",
    label: "Medium",
  },
  low: {
    text: "text-slate-500",
    dot: "bg-slate-400",
    label: "Low",
  },
} as const;

export const statusStyles: Record<
  TaskStatus,
  {
    bg: string;
    text: string;
    label: string;
  }
> = {
  todo: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: "To do",
  },
  in_progress: {
    bg: "bg-blue-50",
    text: "text-blue-900",
    label: "In progress",
  },
  done: {
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    label: "Done",
  },
} as const;
