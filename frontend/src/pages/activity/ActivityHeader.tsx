import { Button } from "@/components/ui/button";

export const ActivityHeader = () => {
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
        <Button
          variant="outline"
          className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium  bg-black text-white hover:bg-black hover:text-white rounded-md"
        >
          All
        </Button>
        <Button
          variant="secondary"
          className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f1f5f9] rounded-md hover:bg-[#f1f5f9]"
        >
          Created
        </Button>
        <Button
          variant="secondary"
          className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f1f5f9] rounded-md hover:bg-[#f1f5f9]"
        >
          Updated
        </Button>
        <Button
          variant="secondary"
          className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f1f5f9] rounded-md hover:bg-[#f1f5f9]"
        >
          Completed
        </Button>
        <Button
          variant="secondary"
          className="h-7 flex items-center gap-1 border border-[--sidebar-border] px-4 text-xs font-medium bg-[#f1f5f9] rounded-md hover:bg-[#f1f5f9]"
        >
          Deleted
        </Button>
      </div>
    </div>
  );
};
