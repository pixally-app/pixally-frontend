import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

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
  try {
    const response = await api.get<UserMe>("/users/me");
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar dados do usuário.");
  }
}

export async function updateMe(data: UpdateUserData): Promise<UserMe> {
  try {
    const response = await api.patch<UserMe>("/users/me", data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      409: "Email já em uso.",
      422: "Dados inválidos.",
    }, "Erro ao salvar dados.");
  }
}
