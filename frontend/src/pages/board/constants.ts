import type { TaskPriority } from "@/api/taskService/types";

export const priorityStyles: Record<
  TaskPriority,
  {
    label: string;
    className: string;
  }
> = {
  highest: {
    label: "Highest",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  high: {
    label: "High",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  low: {
    label: "Low",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};
