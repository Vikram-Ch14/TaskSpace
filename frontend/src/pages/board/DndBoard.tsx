import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumnSkeleton } from "./BoardColumnSkeleton";
import { getTasks, updateTask } from "@/api/taskService/taskService";
import type { TaskResponse, Tasks, TaskStatus } from "@/api/taskService/types";
import type { TaskCardData } from "../tasks/types";
import { avatarColors } from "../tasks/constants";
import { TaskDetailsDialog } from "../tasks/TaskDetailsDialog";
import { getMembers } from "@/api/memberService/memberService";
import { toast } from "sonner";
import { TaskColumn } from "./TaskColumn";
import { useTaskStore } from "@/stores/taskStore";

export type KanbanColumn = {
  id: TaskStatus;
  title: string;
  count: number;
  tasks: TaskCardData[];
};

export interface UserOption {
  label: string;
  value: string;
}

interface Member {
  id: string;
  username: string;
}

export const DndBoard = () => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskCardData | null>(null);
  const [activeTask, setActiveTask] = useState<TaskCardData | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const tasksRef = useRef<TaskCardData[]>([]);
  const hasFetch = useTaskStore((state) => state.hasFetch);

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
    const fetchMembers = async () => {
      try {
        const response: Member[] = await getMembers();

        const formattedUsers = response.map((member) => ({
          label: member.username,
          value: member.id,
        }));

        setUsers(formattedUsers);
      } catch {
        toast.error("Failed to load members");
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const payload = {
          filters: {
            page: 1,
            per_page: 15,
          },
        };

        const response: Tasks = await getTasks(payload);

        setTasks(response.tasks.map(formatTask));
        tasksRef.current = response.tasks.map(formatTask);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [hasFetch]);

  const updateTaskStatus = async (task: TaskCardData, status: TaskStatus) => {
    try {
      const updatedTasks = {
        ...task,
        status: status,
      };
      await updateTask(task.id, updatedTasks);
      toast.success("Task updated successfully");
    } catch (err: unknown) {
      console.log(err);
      toast.error("Task updated failed");
      setTasks(tasksRef.current);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over || !active) return;
    if (!active.data.current) return;

    let status = active.data.current.task.status;

    if (over.id === status) return;
    const orginalPositionTaskId = active.data.current.task.id;

    if (over.id === "todo") {
      status = "todo";
    } else if (over.id === "in_progress") {
      status = "in_progress";
    } else if (over.id === "done") {
      status = "done";
    }

    const tasksCopy = tasks.map((task) => ({
      ...task,
      status: task.id === orginalPositionTaskId ? status : task.status,
    }));
    setTasks(tasksCopy);
    await updateTaskStatus(active.data.current.task, status);
  };

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
    <div
      className="grid h-full grid-cols-1 gap-4 xl:grid-cols-3"
      ref={boardRef}
    >
      <DndContext
        onDragEnd={(event) => {
          setActiveTask(null);
          handleDragEnd(event);
        }}
        onDragStart={(event) => {
          setActiveTask(event.active.data.current?.task);
        }}
        sensors={sensors}
        modifiers={[
          ({ transform, draggingNodeRect }) => {
            const bounds = boardRef.current?.getBoundingClientRect();

            if (!bounds || !draggingNodeRect) {
              return transform;
            }

            let x = transform.x;
            let y = transform.y;

            const left = draggingNodeRect.left + x;
            const right = draggingNodeRect.right + x;

            const top = draggingNodeRect.top + y;
            const bottom = draggingNodeRect.bottom + y;

            if (left < bounds.left) {
              x += bounds.left - left;
            }

            if (right > bounds.right) {
              x -= right - bounds.right;
            }

            if (top < bounds.top) {
              y += bounds.top - top;
            }

            if (bottom > bounds.bottom) {
              y -= bottom - bounds.bottom;
            }

            return {
              ...transform,
              x,
              y,
            };
          },
        ]}
      >
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            setSelectedTask={setSelectedTask}
            activeTask={activeTask}
          />
        ))}
      </DndContext>

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
