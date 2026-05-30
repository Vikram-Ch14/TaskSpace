import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Flag, SortAscIcon, User } from "lucide-react";
import { TaskCard } from "./TaskCard";

const tasks = [
  {
    id: "TS-042",
    code: "TS-042",
    title: "Fix login bug on Safari",
    description: "Cookie not persisting after refresh on Safari 14+",
    priority: "urgent",
    status: "in_progress",
    dueDate: "May 28",
    isOverdue: false,
    assignee: { initial: "B", name: "Bob", color: "bg-emerald-600" },
  },
  {
    id: "TS-041",
    code: "TS-041",
    title: "Refactor authentication middleware",
    description: "Split JWT decoding from role enforcement logic",
    priority: "urgent",
    status: "todo",
    dueDate: "May 22",
    isOverdue: true,
    assignee: { initial: "A", name: "Alice", color: "bg-violet-600" },
  },
  {
    id: "TS-040",
    code: "TS-040",
    title: "Add activity log API endpoint",
    description: "Paginated feed with action filters",
    priority: "high",
    status: "in_progress",
    dueDate: "Jun 1",
    isOverdue: false,
    assignee: { initial: "A", name: "Alice", color: "bg-violet-600" },
  },
  {
    id: "TS-039",
    code: "TS-039",
    title: "Deploy backend to Render",
    description: "Persistent disk setup and environment variables",
    priority: "medium",
    status: "in_progress",
    dueDate: "Jun 5",
    isOverdue: false,
    assignee: { initial: "C", name: "Carol", color: "bg-sky-600" },
  },
  {
    id: "TS-038",
    code: "TS-038",
    title: "Write seed script for demo data",
    description: "5 demo users, 20 tasks, activity history",
    priority: "medium",
    status: "todo",
    dueDate: "Jun 2",
    isOverdue: false,
    assignee: { initial: "C", name: "Carol", color: "bg-sky-600" },
  },
  {
    id: "TS-037",
    code: "TS-037",
    title: "Set up Alembic migrations",
    description: "Init folder, env.py, first revision",
    priority: "low",
    status: "done",
    dueDate: "May 20",
    isOverdue: false,
    assignee: { initial: "A", name: "Alice", color: "bg-violet-600" },
  },
];

export const TaskList = () => {
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
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};
