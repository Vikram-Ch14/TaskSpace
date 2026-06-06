import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const TaskCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <Skeleton width={70} height={12} />
        <Skeleton width={50} height={10} />
      </div>

      <div>
        <Skeleton height={18} width="75%" />

        <div className="mt-2 space-y-1">
          <Skeleton height={12} />
          <Skeleton height={12} width="90%" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={22} borderRadius={999} />
          <Skeleton width={60} height={12} />
        </div>

        <Skeleton
          circle
          width={22}
          height={22}
        />
      </div>
    </div>
  );
};