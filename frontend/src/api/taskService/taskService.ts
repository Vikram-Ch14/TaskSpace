import { axiosInstance } from "@/pages/config/axios";
import type { TaskStats } from "@/pages/dashboard/types";

enum TaskService {
  base = `/api/task`,
}

const getMetricsUrl = () => `${TaskService.base}/dashboard`;

export const getMetrics = async (): Promise<TaskStats> => {
  const response = await axiosInstance.get<TaskStats>(getMetricsUrl());
  return response.data;
};
