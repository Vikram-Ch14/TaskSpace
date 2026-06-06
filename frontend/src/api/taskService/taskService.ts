import { axiosInstance } from "@/pages/config/axios";
import type { TaskStats } from "@/pages/dashboard/types";
import type { Tasks } from "./types";

enum TaskService {
  base = `/api/task`,
}

const getMetricsUrl = () => `${TaskService.base}/dashboard`;

const getTasksUrl = () => `${TaskService.base}/tasks`;

const createTaskUrl = () => `${TaskService.base}/create`;

const updateTaskUrl = (taskId: string) => `${TaskService.base}/${taskId}`;

export const getMetrics = async (): Promise<TaskStats> => {
  const response = await axiosInstance.get<TaskStats>(getMetricsUrl());
  return response.data;
};

export const getTasks = async (payload: Object): Promise<Tasks> => {
  const response = await axiosInstance.post<Tasks>(getTasksUrl(), payload);
  return response.data;
};

export const createTask = async (payload: Object) => {
  const response = await axiosInstance.post(createTaskUrl(), payload);
  return response.data;
};

export const updateTask = async (taskId: string, payload: Object) => {
  const response = await axiosInstance.put(updateTaskUrl(taskId), payload);
  return response.data;
}
