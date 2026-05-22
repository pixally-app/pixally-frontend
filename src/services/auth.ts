import { api } from "./api";

interface User {
  id: string;
  username: string | null;
  email: string;
  role: string;
  isActive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}
