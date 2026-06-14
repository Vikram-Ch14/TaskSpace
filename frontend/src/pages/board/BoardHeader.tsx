import { CreateTaskDialog } from "../tasks/CreateTaskDialog";

export const BoardHeader = () => {
  return (
    <div className="flex justify-end mx-4 w-full">
      <CreateTaskDialog />
    </div>
  );
};
