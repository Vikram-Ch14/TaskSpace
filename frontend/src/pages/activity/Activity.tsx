import { Header } from "@/common/Header";
import { View } from "@/common/View";
import { ActivityHeader } from "./ActivityHeader";
import { ActivityFeed } from "./ActivityFeed";

export const Activity = () => (
  <div className="h-screen w-full overflow-auto">
    <Header>
      <ActivityHeader />
    </Header>
    <View>
      <ActivityFeed/>
    </View>
  </div>
);
