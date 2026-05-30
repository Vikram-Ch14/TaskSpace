import { Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Todo",
    count: 12,
    tasks: [
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Set up FTS5 trigger sync",
        description: "Ensure inserts and updates stay in sync",
        priority: "Highest",
        due: "May 30",
        priorityClass:
          "bg-red-100 text-red-700 border-red-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
      {
        title: "Refactor authentication middleware",
        description: "Split JWT decoding from role enforcement",
        priority: "High",
        due: "May 22",
        priorityClass:
          "bg-amber-100 text-amber-700 border-amber-200",
      },
    ],
  },
  {
    title: "In Progress",
    count: 12,
    tasks: [
      {
        title: "Fix login bug on Safari",
        description: "Cookie not persisting after refresh",
        priority: "Highest",
        due: "May 28",
        priorityClass:
          "bg-red-100 text-red-700 border-red-200",
      },
    ],
  },
  {
    title: "Done",
    count: 23,
    tasks: [
      {
        title: "Set up Alembic migrations",
        description: "",
        priority: "Done",
        due: "",
        priorityClass:
          "bg-emerald-100 text-emerald-700 border-emerald-200",
      },
    ],
  },
];

export const DndBoard = () => {
  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.title}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          {/* Header */}
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
            {column.tasks.map((task) => (
              <Card
                key={task.title}
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
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${task.priorityClass}`}
                  >
                    {task.priority}
                  </Badge>

                  {task.due && (
                    <span className="text-xs text-slate-400">
                      {task.due}
                    </span>
                  )}
                </div>
              </Card>
            ))}

            <Button
              variant="ghost"
              className="h-9 w-full justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 hover:bg-slate-100"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add task
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};