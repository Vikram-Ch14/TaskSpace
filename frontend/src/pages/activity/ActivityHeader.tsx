import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActivityStore, type ActivityStatus } from "@/stores/activityStore";

const statuses: ActivityStatus[] = [
  "all",
  "created",
  "updated",
  "completed",
  "deleted",
];

export const ActivityHeader = () => {
  const activityStatus = useActivityStore((state) => state.activityStatus);
  const setActivityStatus = useActivityStore(
    (state) => state.setActivityStatus,
  );

  const getButtonClass = (status: ActivityStatus) =>
    cn(
      "h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium rounded-md",
      activityStatus.includes(status)
        ? "bg-black text-white hover:bg-black hover:text-white"
        : "bg-[#f1f5f9] text-slate-700 hover:bg-[#f1f5f9] hover:text-slate-700",
    );

  const handleStatusChange = (status: ActivityStatus) => {
    const isSelected = activityStatus.includes(status);
    if (isSelected) {
      setActivityStatus(activityStatus.filter((s) => s !== status));
    } else {
      setActivityStatus([...activityStatus, status]);
    }
  };
  return (
    <div className="flex items-center justify-between bg-white w-full">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-900">
          Activity
        </h1>

        <p className="text-sm text-slate-500">
          Everything happening in TaskSpace
        </p>
      </div>
      <div className="flex items-center gap-2 px-4">
        {statuses.map((status) => (
          <Button
            key={status}
            variant="secondary"
            className={getButtonClass(status)}
            onClick={() => handleStatusChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};
