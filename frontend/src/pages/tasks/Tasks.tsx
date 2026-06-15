import { Header } from "@/common/Header";
import { View } from "@/common/View";
import { TasksHeader } from "./TaskHeader";
import { TaskList } from "./TaskList";

export const Tasks = () => {
  return (
    <div className="h-screen w-full">
      <Header>
        <TasksHeader />
      </Header>
      <View>
        <div className="flex flex-1 flex-col gap-4 bg-[#F8FAFC] overflow-hidden">
          <TaskList />
        </div>
      </View>
    </div>
  );
};