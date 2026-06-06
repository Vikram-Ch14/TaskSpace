import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  User,
  Flag,
  Circle,
  Trash2,
  ChevronDownIcon,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import type { TaskCardData } from "./types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format, isDate } from "date-fns";
import { useEffect, useState } from "react";
import type { TaskStatus, TaskPriority } from "@/api/taskService/types";
import { Calendar } from "@/components/ui/calendar";
import type { UserOption } from "./TaskList";
import { updateTask } from "@/api/taskService/taskService";
import { toast } from "sonner";

const statusOptions = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Highest", value: "highest" },
];

interface TaskDetailsDialogProps {
  task: TaskCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserOption[];
}

export const TaskDetailsDialog = ({
  task,
  open,
  onOpenChange,
  users,
}: TaskDetailsDialogProps) => {
  const [formData, setFormData] = useState({
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: undefined as Date | undefined,
    assigned_to: task?.assignee?.userId,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!task) return;

    const formatDate = task.dueDate ? new Date(task.dueDate) : undefined;

    setFormData({
      status: task.status,
      priority: task.priority,
      due_date: formatDate,
      assigned_to: task.assignee?.userId,
    });
  }, [task]);

  const handleSaveChanges = async () => {
    if (!task) return;
    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        due_date:
          formData.due_date && !isNaN(formData.due_date.getTime())
            ? formData.due_date
            : undefined,
      };

      await updateTask(task.id, payload);

      toast.success("Task updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    } finally {
      setIsSaving(false);
      onOpenChange(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-3xl
          p-0
          overflow-hidden
          bg-white
          border
          border-[--sidebar-border]
          gap-0
        "
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[--sidebar-border]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tasks</span>
            <span>•</span>
            <span className="font-medium text-slate-800">{task.code}</span>
          </div>

          <h1 className="mt-1 text-xl font-semibold text-slate-900">
            {task.title}
          </h1>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-[--sidebar-border]">
          <div className="flex gap-5">
            <button className="py-2 text-sm font-medium">Details</button>

            <button className="py-2 text-sm text-slate-500">Activity</button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          {/* Description */}
          <div className="mb-5">
            <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400">
              DESCRIPTION
            </h3>

            <p className="text-sm leading-6 text-slate-700">
              {task.description}
            </p>
          </div>

          {/* Properties */}
          <div>
            <h3 className="mb-3 text-[11px] font-semibold tracking-wider text-slate-400">
              PROPERTIES
            </h3>

            <div className="grid grid-cols-[160px_1fr] gap-y-4">
              {/* Status */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Circle className="h-4 w-4" />
                Status
              </div>

              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as TaskStatus,
                  }))
                }
              >
                <SelectTrigger className="w-1/2 border border-[--sidebar-border]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-white border border-[--sidebar-border]">
                  <SelectGroup>
                    {statusOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Priority */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Flag className="h-4 w-4" />
                Priority
              </div>

              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value as TaskPriority,
                  }))
                }
              >
                <SelectTrigger className="w-1/2 border border-[--sidebar-border]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-white border border-[--sidebar-border]">
                  <SelectGroup>
                    {priorityOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Assignee */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User className="h-4 w-4" />
                Assignee
              </div>

              <Select
                value={formData.assigned_to}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    assigned_to: value as TaskPriority,
                  }))
                }
              >
                <SelectTrigger className="w-1/2 border border-[--sidebar-border]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-white border border-[--sidebar-border]">
                  <SelectGroup>
                    {users.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarIcon className="h-4 w-4" />
                Due Date
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      w-1/2
                      justify-between
                      bg-white
                      border
                      border-[--sidebar-border]
                      font-normal
                    "
                  >
                    {formData.due_date && !isNaN(formData.due_date.getTime())
                      ? format(formData.due_date, "PPP")
                      : "Pick a date"}

                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-auto p-0 bg-white border border-[--sidebar-border]"
                >
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        due_date: date,
                      }))
                    }
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>

              {/* Created */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarIcon className="h-4 w-4" />
                Created
              </div>

              <span className="text-sm">May 18, 2026</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[--sidebar-border] px-4 py-3">
          <span className="text-xs text-slate-400">
            Last updated 18 min ago
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border border-[--sidebar-border]"
            >
              Close
            </Button>

            <Button
              size="sm"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-black text-white hover:bg-black"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
