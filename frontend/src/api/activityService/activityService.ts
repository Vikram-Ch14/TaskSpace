import { axiosInstance } from "@/pages/config/axios";

enum ActivityService {
  base = `/api/activitylog`,
}

const getActivityLogsUrl = () => `${ActivityService.base}`;

export const getActivityLogs = async () => {
  const response = await axiosInstance.get(getActivityLogsUrl());
  return response.data;
};
