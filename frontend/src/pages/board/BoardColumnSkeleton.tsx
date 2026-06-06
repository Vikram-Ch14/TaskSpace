import { Card } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const KanbanCardSkeleton = () => {
  return (
    <Card className="rounded-md border border-slate-200 bg-white p-2 shadow-none">
      <Skeleton height={16} width="75%" />

      <div className="mt-2 space-y-1">
        <Skeleton height={12} />
        <Skeleton height={12} width="85%" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Skeleton
          width={60}
          height={20}
          borderRadius={6}
        />

        <Skeleton
          width={45}
          height={12}
        />
      </div>
    </Card>
  );
};

export const KanbanColumnSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton
            circle
            width={8}
            height={8}
          />

          <Skeleton
            width={90}
            height={16}
          />
        </div>

        <Skeleton
          width={28}
          height={20}
          borderRadius={6}
        />
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <KanbanCardSkeleton key={index} />
        ))}

        <Card className="rounded-xl border border-dashed border-slate-300 p-2 shadow-none">
          <div className="flex items-center justify-center">
            <Skeleton
              width={80}
              height={12}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};