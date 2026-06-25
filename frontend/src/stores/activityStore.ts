import { create } from "zustand";

export type ActivityStatus = "all" | "created" | "updated" | "deleted" | "completed";

type ActivityStore = {
  activityStatus: ActivityStatus[];
  setActivityStatus: (activityStatus: ActivityStatus[]) => void;
};

export const useActivityStore = create<ActivityStore>((set) => ({
  activityStatus: ["all"],
  setActivityStatus: (activityStatus: ActivityStatus[]) =>
    set({ activityStatus }),
}));
