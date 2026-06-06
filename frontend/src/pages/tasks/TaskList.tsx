import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Flag, SortAscIcon, User } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useEffect, useState } from "react";
import { getTasks } from "@/api/taskService/taskService";
import type { TaskCardData } from "./types";
import type { TaskResponse, Tasks } from "@/api/taskService/types";
import { avatarColors } from "./constants";
import { TaskCardSkeleton } from "./TaskSkeleton";

export const TaskList = () => {
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
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-start gap-4 p-4 bg-[#fafafa] border border-[--sidebar-border] rounded-md">
        <div className="w-1/3">
          <Field className="flex flex-co gap-1">
            <Input
              id="input-demo-api-key"
              className="border border-[--sidebar-border] h-7"
              type="text"
              placeholder="Search..."
            />
          </Field>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium  bg-black text-white hover:bg-black hover:text-white rounded-md"
          >
            All
          </Button>
          <Button
            variant="secondary"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f5f4ed] rounded-md"
          >
            Todo
          </Button>

          <Button
            variant="secondary"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f5f4ed] rounded-md"
          >
            In Progress
          </Button>

          <Button
            variant="secondary"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f5f4ed] rounded-md"
          >
            Done
          </Button>

          <Button
            variant="secondary"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md"
          >
            <Flag />
            Priority
          </Button>

          <Button
            variant="secondary"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md"
          >
            <User />
            Assignee
          </Button>

          <Button
            variant="secondary"
            className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md"
          >
            <SortAscIcon />
            Sort
          </Button>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))
            : tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      </div>
    </div>
  );
};
