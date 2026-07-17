import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

export interface PhoneResponse {
  id: string;
  dialCode: string;
  phoneNumber: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  document: string;
  documentType: string;
  status: boolean;
  street: string | null;
  neighborhood: string | null;
  number: string | null;
  phones: PhoneResponse[];
  createdAt: string;
  updatedAt: string;
  receiptsCount: number;
  totalReceived: number;
  totalReceivable: number;
}

export interface PaginatedClients {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListClientsParams {
  name?: string;
  document?: string;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateClientData {
  name: string;
  document: string;
  documentType?: string;
  status?: boolean;
  street?: string;
  neighborhood?: string;
  number?: string;
  phones?: { dialCode: string; phoneNumber: string }[];
}

export interface UpdateClientData {
  name?: string;
  document?: string;
  documentType?: string;
  status?: boolean;
  street?: string;
  neighborhood?: string;
  number?: string;
  phones?: { id?: string; dialCode: string; phoneNumber: string }[];
}

export async function listClients(params?: ListClientsParams): Promise<PaginatedClients> {
  try {
    const response = await api.get<PaginatedClients>("/clients", { params });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar clientes.");
  }
}

export async function getClient(id: string): Promise<Client> {
  try {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Cliente não encontrado.",
    }, "Erro ao carregar cliente.");
  }
}

export async function createClient(data: CreateClientData): Promise<Client> {
  try {
    const response = await api.post<Client>("/clients", data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      409: "Cliente já cadastrado com este documento.",
      422: "Dados inválidos.",
    }, "Erro ao criar cliente.");
  }
}

export async function updateClient(id: string, data: UpdateClientData): Promise<Client> {
  try {
    const response = await api.patch<Client>(`/clients/${id}`, data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      409: "Documento já em uso por outro cliente.",
      422: "Dados inválidos.",
    }, "Erro ao atualizar cliente.");
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    await api.delete(`/clients/${id}`);
  } catch (err) {
    throw resolveApiError(err, {
      409: "Não é possível excluir um cliente com contas a receber em aberto. Cancele ou resolva-as primeiro.",
    }, "Erro ao excluir cliente.");
  }
}
