import { create } from "zustand";

type TaskStore = {
  hasFetch: boolean;
  setHasFetch: (fn: (hasFetch: boolean) => boolean) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  hasFetch: false,
  setHasFetch: (fn: (hasFetch: boolean) => boolean) =>
    set((state) => ({ hasFetch: fn(state.hasFetch) })),
}));
