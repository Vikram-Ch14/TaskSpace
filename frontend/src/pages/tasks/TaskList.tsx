import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, Flag, Loader2, User } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type TaskStatus = "todo" | "in_progress" | "done";
type Priority = "low" | "medium" | "high" | "highest";

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Highest", value: "highest" },
];

const PAGE_SIZE = 10;
const UNASSIGNED = "unassigned";

export interface UserOption {
  label: string;
  value: string;
}

interface Member {
  id: string;
  username: string;
}

interface TaskFilters {
  statuses: TaskStatus[];
  priorities: Priority[];
  assigneeId: string;
}

const INITIAL_FILTERS: TaskFilters = {
  statuses: [],
  priorities: [],
  assigneeId: UNASSIGNED,
};

const getAvatarColor = (id: string) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
      ? dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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
    created_at: task.created_at,
  };
};

export const TaskList = () => {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskCardData | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // initial / filter load
  const [isLoadingMore, setIsLoadingMore] = useState(false); // pagination load

  // --- paging state in refs so the scroll closure never goes stale ---
  const isFetchingRef = useRef(false);
  const nextPageRef = useRef(1); // page number to request NEXT
  const loadedCountRef = useRef(0); // how many tasks are loaded
  const totalRef = useRef(0); // total matching records
  const reachedEndRef = useRef(false); // true once a short page is returned
  const filtersRef = useRef(filters);

  // increments on every filter change; each fetch captures its own value
  // and discards its result if a newer request has started since.
  const requestIdRef = useRef(0);

  const hasFetch = useTaskStore((state) => state.hasFetch);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchTasks = useCallback(
    async (
      pageToFetch: number,
      currentFilters: TaskFilters,
      reactive = false,
    ) => {
      if (isFetchingRef.current) return;
      if (!reactive && reachedEndRef.current) return; // nothing left to load

      // tag this request; reactive (filter) loads start a new generation
      if (reactive) requestIdRef.current += 1;
      const myRequestId = requestIdRef.current;

      isFetchingRef.current = true;
      if (reactive) setIsLoading(true);

      try {
        const payload = {
          filters: {
            status: currentFilters.statuses.length
              ? currentFilters.statuses
              : undefined,
            priority: currentFilters.priorities.length
              ? currentFilters.priorities
              : undefined,
            assigned_to:
              currentFilters.assigneeId !== UNASSIGNED
                ? [currentFilters.assigneeId]
                : undefined,
            page: pageToFetch,
            per_page: PAGE_SIZE,
          },
        };

        const response: Tasks = await getTasks(payload);

        // a newer filter selection started while we were waiting -> discard
        if (myRequestId !== requestIdRef.current) return;

        const formatted = response.tasks.map(formatTask);

        setTotalRecords(response.total);
        totalRef.current = response.total;

        // primary end signal: a short page means there's nothing after it
        reachedEndRef.current = formatted.length < PAGE_SIZE;

        if (reactive) {
          setTasks(formatted);
          loadedCountRef.current = formatted.length;
          nextPageRef.current = 2;
        } else {
          setTasks((prev) => {
            const seen = new Set(prev.map((t) => t.id));
            const next = [...prev];
            for (const t of formatted) {
              if (!seen.has(t.id)) {
                seen.add(t.id);
                next.push(t);
              }
            }
            loadedCountRef.current = next.length;
            return next;
          });
          nextPageRef.current = pageToFetch + 1;
        }
      } catch {
        if (myRequestId === requestIdRef.current) {
          toast.error("Failed to load tasks");
        }
      } finally {
        if (myRequestId === requestIdRef.current) {
          isFetchingRef.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: Member[] = await getMembers();
        const formattedUsers: UserOption[] = response.map((member) => ({
          label: member.username,
          value: member.id,
        }));
        formattedUsers.push({ label: "Unassigned", value: UNASSIGNED });
        setUsers(formattedUsers);
      } catch {
        toast.error("Failed to load members");
      }
    };

    fetchMembers();
  }, []);

  // single stable debounced loader
  const debouncedLoadMore = useMemo(
    () =>
      debounce(() => {
        if (isFetchingRef.current) return;
        if (reachedEndRef.current) return;
        if (loadedCountRef.current >= totalRef.current && totalRef.current > 0)
          return;
        fetchTasks(nextPageRef.current, filtersRef.current, false);
      }, 2000),
    [fetchTasks],
  );

  useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, [debouncedLoadMore]);

  useEffect(() => {
    debouncedLoadMore.cancel();

    requestIdRef.current += 1;

    nextPageRef.current = 1;
    loadedCountRef.current = 0;
    totalRef.current = 0;
    reachedEndRef.current = false;

    fetchTasks(1, filters, true);
  }, [filters, hasFetch, debouncedLoadMore]);

  const toggleStatus = (status: TaskStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const togglePriority = (priority: Priority) => {
    setFilters((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter((p) => p !== priority)
        : [...prev.priorities, priority],
    }));
  };

  const setAssignee = (assigneeId: string) => {
    setFilters((prev) =>
      prev.assigneeId === assigneeId
        ? prev
        : {
            ...prev,
            assigneeId,
          },
    );
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    const reachedBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    if (reachedBottom && !isFetchingRef.current && !reachedEndRef.current) {
      setIsLoadingMore(true);
      debouncedLoadMore();
    }
  };

  const visibleTasks = search.trim()
    ? tasks.filter((task) =>
        task.title.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : tasks;

  const priorityLabel =
    filters.priorities.length > 0
      ? `Priority (${filters.priorities.length})`
      : "Priority";

  const assigneeLabel =
    filters.assigneeId === UNASSIGNED
      ? "Assignee"
      : (users.find((u) => u.value === filters.assigneeId)?.label ??
        "Assignee");

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      <div className="flex items-start gap-4 p-4 bg-[#fafafa] border border-[--sidebar-border] rounded-md">
        <div className="w-1/3">
          <Field className="flex flex-col gap-1">
            <Input
              id="task-search"
              className="border border-[--sidebar-border] h-7"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center gap-4">
          {STATUS_OPTIONS.map(({ label, value }) => {
            const active = filters.statuses.includes(value);
            return (
              <Button
                key={value}
                variant="secondary"
                className={`h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md ${
                  active
                    ? "bg-black text-white hover:bg-black hover:text-white"
                    : "bg-[#f5f4ed]"
                }`}
                onClick={() => toggleStatus(value)}
              >
                {label}
              </Button>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-7 gap-1 rounded-md border border-[--sidebar-border] px-4 text-xs font-medium"
              >
                <Flag className="h-3.5 w-3.5" />
                {priorityLabel}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-36 bg-white border border-[--sidebar-border]"
            >
              {PRIORITY_OPTIONS.map((item) => {
                const checked = filters.priorities.includes(item.value);
                return (
                  <DropdownMenuItem
                    key={item.value}
                    onSelect={(e) => {
                      e.preventDefault();
                      togglePriority(item.value);
                    }}
                    className="flex items-center justify-between"
                  >
                    {item.label}
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md"
              >
                <User className="h-3.5 w-3.5" />
                {assigneeLabel}
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
                  onClick={() => setAssignee(item.value)}
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
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))
            : visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
        </div>

        {isLoadingMore && (
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more...
          </div>
        )}
      </div>

      <TaskDetailsDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null);
        }}
        users={users}
      />
    </div>
  );
};
