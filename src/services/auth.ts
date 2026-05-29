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

interface RegisterData {
  username: string;
  email: string;
  password: string;
  document: string;
  phone: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/register", data);
  return response.data;
}
