import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KanbanColumnSkeleton } from "./BoardColumnSkeleton";
import { getTasks } from "@/api/taskService/taskService";
import type { TaskResponse, Tasks, TaskStatus } from "@/api/taskService/types";
import type { TaskCardData } from "../tasks/types";
import { priorityStyles } from "./constants";
import { avatarColors } from "../tasks/constants";
import { Plus } from "lucide-react";

type KanbanColumn = {
  id: TaskStatus;
  title: string;
  count: number;
  tasks: TaskCardData[];
};

export const DndBoard = () => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAvatarColor = (id: string) => {
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return avatarColors[hash % avatarColors.length];
  };

  const formatTask = (task: TaskResponse): TaskCardData => {
    const dueDate = task.due_date ? new Date(task.due_date) : null;

    return {
      id: task.id,

      code: `TS-${task.id.slice(0, 4).toUpperCase()}`,

      title: task.title,

      description: task.description ?? "",

      priority: task.priority,

      status: task.status,

      dueDate: dueDate
        ? dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "-",

      isOverdue: !!dueDate && task.status !== "done" && dueDate < new Date(),

      assignee: task.assignee
        ? {
            initial: task.assignee.username.charAt(0).toUpperCase(),
            name: task.assignee.username,
            color: getAvatarColor(task.assignee.id),
          }
        : null,
    };
  };

  const columns = useMemo<KanbanColumn[]>(() => {
    const todo = tasks.filter((task) => task.status === "todo");

    const inProgress = tasks.filter((task) => task.status === "in_progress");

    const done = tasks.filter((task) => task.status === "done");

    return [
      {
        id: "todo",
        title: "Todo",
        count: todo.length,
        tasks: todo,
      },
      {
        id: "in_progress",
        title: "In Progress",
        count: inProgress.length,
        tasks: inProgress,
      },
      {
        id: "done",
        title: "Done",
        count: done.length,
        tasks: done,
      },
    ];
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const payload = {
          filters: {
            page: 1,
            per_page: 10,
          },
        };

        const response: Tasks = await getTasks(payload);

        setTasks(response.tasks.map(formatTask));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <KanbanColumnSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.id}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-400" />

              <h2 className="text-sm font-medium text-slate-900">
                {column.title}
              </h2>
            </div>

            <div className="rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
              {column.count}
            </div>
          </div>

          <div className="space-y-2">
            {column.tasks.map((task) => {
              const priority = priorityStyles[task.priority];

              return (
                <Card
                  key={task.id}
                  className="rounded-md border border-slate-200 bg-white p-2 shadow-none"
                >
                  <h3 className="text-sm font-medium leading-snug text-slate-900">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${priority.className}`}
                    >
                      {priority.label}
                    </Badge>

                    <span className="text-xs text-slate-400">
                      {task.dueDate}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
