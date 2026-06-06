import { axiosInstance } from "@/pages/config/axios";

enum MemberService {
  base = `/api/members`,
}

export const getMembersUrl = () => `${MemberService.base}`;

export const getMembers = async () => {
  const response = await axiosInstance.get(getMembersUrl());
  return response.data;
};
