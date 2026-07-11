import { api } from "./api";

export interface UserMe {
  id: string;
  username: string | null;
  email: string;
  companyName: string | null;
  role: string;
  isActive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  companyName?: string;
}

export async function getMe(): Promise<UserMe> {
  const response = await api.get<UserMe>("/users/me");
  return response.data;
}

export async function updateMe(data: UpdateUserData): Promise<UserMe> {
  const response = await api.patch<UserMe>("/users/me", data);
  return response.data;
}
