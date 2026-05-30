import { Header } from "@/common/Header";
import { View } from "@/common/View";
import { TasksHeader } from "./TaskHeader";
import { TaskList } from "./TaskList";

export const Tasks = () => {
  return (
    <div className="h-screen w-full overflow-auto">
      <Header>
        <TasksHeader />
      </Header>
      <View>
        <div className="flex flex-1 flex-col gap-4 bg-[#F8FAFC] p-4">
          <TaskList />
        </div>
      </View>
    </div>
  );
};