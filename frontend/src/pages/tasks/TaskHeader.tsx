import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Plus } from "lucide-react";

export const TasksHeader = () => {
  return (
    <div className="flex items-center justify-between bg-white w-full">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-900">
          Tasks
        </h1>

        <p className="text-sm text-slate-500">47 tasks · TaskSpace Workspace</p>
      </div>
      <div className="flex items-center gap-1">
        <ButtonGroup>
          <Button
            variant="secondary"
            className="h-6 px-5 text-xs border border-[--sidebar-border]"
          >
            List
          </Button>

          <Button
            variant="ghost"
            className="h-6 px-5 text-xs border border-[--sidebar-border]"
          >
            Board
          </Button>
        </ButtonGroup>

        <Button
          variant="secondary"
          className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-2 text-xs font-medium mx-4 bg-black text-white hover:bg-black hover:text-white"
        >
          <Plus />
          New Task
        </Button>
      </div>
    </div>
  );
};
