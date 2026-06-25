import { axiosInstance } from "@/pages/config/axios";
import type { ActivityLog } from "./types";

enum ActivityService {
  base = `/api/activitylog`,
}

const getActivityLogsUrl = () => `${ActivityService.base}`;

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const response = await axiosInstance.get(getActivityLogsUrl());
  return response.data;
};
