import { ChevronDownIcon, Loader, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMembers } from "@/api/memberService/memberService";
import { createTask } from "@/api/taskService/taskService";
import { toast } from "sonner";
import { useTaskStore } from "@/stores/taskStore";
interface UserOption {
  label: string;
  value: string;
}

interface Member {
  id: string;
  username: string;
}

interface CreateTaskForm {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}

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

export const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setHasFetch = useTaskStore((state) => state.setHasFetch);

  const [form, setForm] = useState<CreateTaskForm>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
    });

    setDate(undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      setIsSubmitting(true);

      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assigned_to: form.assignee || null,
        due_date: date?.toISOString() ?? null,
      };

      await createTask(payload);
      setHasFetch((prev) => !prev);

      toast.success("Task created successfully");

      resetForm();
      setOpen(false);
    } catch {
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button
          variant="secondary"
          className="h-7 mx-4 flex items-center gap-1 border border-[--sidebar-border] bg-black px-2 text-xs font-medium text-white hover:bg-black hover:text-white"
          onClick={() => setOpen(true)}
        >
          <Plus size={14} />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl bg-white p-0 border border-[--sidebar-border]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b px-5 py-4 text-left border border-[--sidebar-border]">
            <DialogTitle className="text-xl font-medium">
              Create New Task
            </DialogTitle>

            <DialogDescription>
              Add a task to TaskSpace workspace
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 p-5">
            <FieldGroup>
              <Field>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  className="border border-[--sidebar-border]"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  rows={4}
                  className="resize-none border border-[--sidebar-border]"
                  placeholder="Add more details about this task..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <Label>Status</Label>

                  <Select
                    defaultValue={form.status}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        status: value,
                      }))
                    }
                    value={form.status}
                  >
                    <SelectTrigger className="w-full border border-[--sidebar-border]">
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
                </Field>

                <Field>
                  <Label>Priority</Label>

                  <Select
                    defaultValue={form.priority}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        priority: value,
                      }))
                    }
                    value={form.priority}
                  >
                    <SelectTrigger className="w-full border border-[--sidebar-border]">
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
                </Field>

                <Field>
                  <Label>Assignee</Label>

                  <Select
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        assignee: value,
                      }))
                    }
                    value={form.assignee}
                    defaultValue={form.assignee}
                  >
                    <SelectTrigger className="w-full border border-[--sidebar-border]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-[--sidebar-border]">
                      <SelectGroup>
                        {users.map((item: any) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      children={
                        <Button
                          variant={"outline"}
                          data-empty={!date}
                          className="flex w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-white border border-[--sidebar-border]"
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      }
                    />
                    <PopoverContent
                      className="w-auto p-0 border border-[--sidebar-border] bg-white"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < today}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              </div>
            </FieldGroup>
          </div>

          <DialogFooter className="border border-[--sidebar-border] px-5 py-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border border-[--sidebar-border]"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-black text-white hover:bg-black"
            >
             {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
