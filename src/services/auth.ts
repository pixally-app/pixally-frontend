import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

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
  try {
    const response = await api.post<LoginResponse>("/auth/login", { email, password });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      401: "Email ou senha inválidos.",
    }, "Erro ao fazer login. Tente novamente.");
  }
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      409: "Email ou documento já cadastrado.",
      400: "Dados inválidos. Verifique os campos.",
    }, "Erro ao criar conta. Tente novamente.");
  }
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  try {
    const response = await api.post<MessageResponse>("/auth/forgot-password", { email });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao enviar email. Tente novamente.");
  }
}

export async function resetPassword(token: string, password: string): Promise<MessageResponse> {
  try {
    const response = await api.post<MessageResponse>("/auth/reset-password", { token, password });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      400: "Link inválido ou expirado. Solicite um novo link.",
    }, "Erro ao redefinir senha. Tente novamente.");
  }
}
