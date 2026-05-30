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

interface MessageResponse {
  message: string;
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

export async function forgotPassword(email: string): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>("/auth/forgot-password", {
    email,
  });
  return response.data;
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
}
