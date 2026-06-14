import type { KanbanColumn } from "./DndBoard";
import type { TaskCardData } from "../tasks/types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

type Props = {
  column: KanbanColumn;
  setSelectedTask: (task: TaskCardData) => void;
  activeTask: TaskCardData | null;
};

export const TaskColumn = ({ column, setSelectedTask, activeTask }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  return (
    <div
      key={column.id}
      ref={setNodeRef}
      className={`rounded-xl border border-slate-200 ${isOver ? "bg-slate-100" : "bg-slate-50"} p-3`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-slate-400" />

          <h2 className="text-sm font-medium text-slate-900">{column.title}</h2>
        </div>

        <div className="rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
          {column.count}
        </div>
      </div>

      <div className="space-y-2">
        {column.tasks.map((task) => {
          return (
            <TaskCard key={task.id} task={task} onSelect={setSelectedTask}  activeTask={activeTask}/>
          );
        })}
      </div>
    </div>
  );
};
