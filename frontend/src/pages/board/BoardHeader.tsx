import { ButtonGroup } from "@/components/ui/button-group";
import { CreateTaskDialog } from "../tasks/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getRoute } from "@/routes/utils";
import { routes } from "@/routes/routes";
import { RouteName } from "@/routes/types";

export const BoardHeader = () => {
  const navigate = useNavigate();

  const route = getRoute(location.pathname, routes);
  const isTaskBoardRoute = route?.name === RouteName.Board;

  const onNavigate = () => {
    navigate("/tasks");
  };
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
            className={`h-6 px-5 text-xs border border-[--sidebar-border] `}
            onClick={onNavigate}
          >
            List
          </Button>

          <Button
            variant="ghost"
            className={`h-6 px-5 text-xs border border-[--sidebar-border] ${isTaskBoardRoute ? "bg-black hover:black text-white" : ""}`}
          >
            Board
          </Button>
        </ButtonGroup>

        <CreateTaskDialog />
      </div>
    </div>
  );
};
