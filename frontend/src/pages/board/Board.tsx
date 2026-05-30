import { Header } from "@/common/Header";
import { View } from "@/common/View";
import { DndBoard } from "./DndBoard";

export const Board = () => (
  <div className="h-screen w-full overflow-auto">
    <Header />
    <View>
      <div className="flex flex-1 flex-col gap-4 bg-[#F8FAFC] p-4">
       <DndBoard />
      </div>
    </View>
  </div>
);
