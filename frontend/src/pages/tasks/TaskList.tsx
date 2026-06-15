import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronDown, Flag, SortAscIcon, User } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTasks } from "@/api/taskService/taskService";
import type { TaskCardData } from "./types";
import type { TaskResponse, Tasks } from "@/api/taskService/types";
import { avatarColors } from "./constants";
import { TaskCardSkeleton } from "./TaskSkeleton";
import { TaskDetailsDialog } from "./TaskDetailsDialog";
import { toast } from "sonner";
import { getMembers } from "@/api/memberService/memberService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskStore } from "@/stores/taskStore";
import debounce from "lodash.debounce";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Highest", value: "highest" },
  { label: "None", value: "none" },
];

export interface UserOption {
  label: string;
  value: string;
}
interface Member {
  id: string;
  username: string;
}

interface TaskFilter {
  todo: boolean;
  in_progress: boolean;
  done: boolean;
  priority: string;
  userId: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskCardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [taskFilters, setTaskFilters] = useState<TaskFilter>({
    todo: false,
    in_progress: false,
    done: false,
    priority: "none",
    userId: "unassigned",
  });
  const tasksListRef = useRef<TaskCardData[]>([]);
  const hasFetch = useTaskStore((state) => state.hasFetch);
  const fetchLoadingRef = useRef<boolean>(false);
  const [page, setPage] = useState(1);
  const records = 20;

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
            userId: task.assignee.id,
          }
        : null,
    };
  };

  const onFilterChange = (key: string, value: boolean | string) => {
    const updatedFilters = { ...taskFilters, [key]: value };
    setTaskFilters(updatedFilters);

    const filteredTasks = tasksListRef.current.filter((task) => {
      if (updatedFilters.todo === true && task.status === "todo") return true;
      if (updatedFilters.in_progress === true && task.status === "in_progress")
        return true;
      if (updatedFilters.done === true && task.status === "done") return true;
      if (updatedFilters.priority === "low" && task.priority === "low")
        return true;
      if (updatedFilters.priority === "medium" && task.priority === "medium")
        return true;
      if (updatedFilters.priority === "high" && task.priority === "high")
        return true;
      if (updatedFilters.priority === "highest" && task.priority === "highest")
        return true;

      if (updatedFilters.userId === task.assignee?.userId) return true;
      if (
        updatedFilters.todo === false &&
        updatedFilters.in_progress === false &&
        updatedFilters.done === false &&
        updatedFilters.priority === "none" &&
        updatedFilters.userId === "unassigned"
      )
        return true;
      return false;
    });

    setTasks(filteredTasks);
  };

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
      const formattedTasks = response.tasks.map(formatTask);

      setTasks(formattedTasks);
      tasksListRef.current = formattedTasks;
      setPage((prev) => prev + 1);

      fetchLoadingRef.current = false;
    } catch {
      toast.error("Failed to load tasks");
      fetchLoadingRef.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTasks = useMemo(
    () =>
      debounce(() => {
        fetchTasks();
      }, 3000),
    [],
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (
      e.currentTarget.scrollHeight -
        (e.currentTarget.scrollTop + window.innerHeight) <
        100 &&
      !fetchLoadingRef.current
    ) {
      console.log("fetching");
      fetchLoadingRef.current = true;
      handleFetchTasks();
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: Member[] = await getMembers();

        const formattedUsers = response.map((member) => ({
          label: member.username,
          value: member.id,
        }));

        formattedUsers.push({ label: "Unassigned", value: "unassigned" });

        setUsers(formattedUsers);
      } catch {
        toast.error("Failed to load members");
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [hasFetch]);
  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
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
            variant="secondary"
            className={`h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium ${taskFilters.todo ? "bg-black text-white hover:bg-black hover:text-white" : "bg-[#f5f4ed]"} rounded-md  `}
            onClick={() => onFilterChange("todo", !taskFilters.todo)}
          >
            Todo
          </Button>

          <Button
            variant="secondary"
            className={`h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium ${taskFilters.in_progress ? "bg-black text-white hover:bg-black hover:text-white" : "bg-[#f5f4ed]"} rounded-md`}
            onClick={() =>
              onFilterChange("in_progress", !taskFilters.in_progress)
            }
          >
            In Progress
          </Button>

          <Button
            variant="secondary"
            className={`h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium ${taskFilters.done ? "bg-black text-white hover:bg-black hover:text-white" : "bg-[#f5f4ed]"}  rounded-md`}
            onClick={() => onFilterChange("done", !taskFilters.done)}
          >
            Done
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-7 gap-1 rounded-md border border-[--sidebar-border] px-4 text-xs font-medium"
              >
                <Flag className="h-3.5 w-3.5" />
                {taskFilters.priority === "none"
                  ? "Priority"
                  : taskFilters.priority.slice(0, 1).toUpperCase() +
                      taskFilters.priority.slice(1) || "Priority"}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-36 bg-white border border-[--sidebar-border]"
            >
              {priorityOptions.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => onFilterChange("priority", item.value)}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md"
              >
                <User />
                {(taskFilters.userId === "unassigned"
                  ? "Assignee"
                  : users.find((u) => u?.value === taskFilters.userId)
                      ?.label) || "Assignee"}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-36 bg-white border border-[--sidebar-border]"
            >
              {users.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => onFilterChange("userId", item.value)}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className="overflow-auto p-4 mb-24 scrollbar-hide"
        onScroll={handleScroll}
      >
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2 ">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))
            : tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
        </div>
      </div>

      <TaskDetailsDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null);
          }
        }}
        users={users}
      />
    </div>
  );
};
