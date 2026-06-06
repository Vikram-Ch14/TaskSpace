import { Calendar, AlertCircle, Check } from "lucide-react";
import { priorityStyles, statusStyles } from "./constants";
import type { TaskCardData } from "./types";

type TaskCardProps = {
  task: TaskCardData;
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const priority = priorityStyles[task.priority];
  const status = statusStyles[task.status];
  const isDone = task.status === "done";

  return (
    <div
      className={`flex flex-col gap-2.5 cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 ${
        isDone ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${priority.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        <span className="font-mono text-[10px] text-slate-400">
          {task.code}
        </span>
      </div>

      <div>
        <h3
          className={`mb-1 text-sm font-medium leading-snug ${
            isDone
              ? "text-slate-400 line-through"
              : task.isOverdue
                ? "text-red-600"
                : "text-slate-900"
          }`}
        >
          {task.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
          {task.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <div className="flex items-center gap-2.5 text-[11px]">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${status.bg} ${status.text}`}
          >
            {isDone && <Check className="h-2.5 w-2.5" />}
            {status.label}
          </span>

          {task.isOverdue ? (
            <span className="flex items-center gap-1 font-medium text-red-600">
              <AlertCircle className="h-3 w-3" />
              Overdue {task.dueDate}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="h-3 w-3" />
              {task.dueDate}
            </span>
          )}
        </div>

        {task.assignee && (
          <div
            title={task.assignee.name}
            className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-medium text-white ${task.assignee.color}`}
          >
            {task.assignee.initial}
          </div>
        )}
      </div>
    </div>
  );
};
