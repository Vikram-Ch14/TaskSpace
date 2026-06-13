import { Card } from "@/components/ui/card";
import type { TaskCardData } from "../tasks/types";
import { Badge } from "@/components/ui/badge";
import { priorityStyles } from "./constants";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type TaskCardProps = {
  task: TaskCardData;
  onSelect: (task: TaskCardData) => void;
};

export const TaskCard = ({ task, onSelect }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const priority = priorityStyles[task.priority];

  return (
    <Card
      key={task.id}
      className="rounded-md border border-slate-200 bg-white p-2 shadow-none cursor-grab "
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
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

        <span className="text-xs text-slate-400">{task.dueDate}</span>
      </div>
    </Card>
  );
};
