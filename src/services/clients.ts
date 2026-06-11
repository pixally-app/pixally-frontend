import { api } from "./api";

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
  const response = await api.get<PaginatedClients>("/clients", { params });
  return response.data;
}

export async function getClient(id: string): Promise<Client> {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
}

export async function createClient(data: CreateClientData): Promise<Client> {
  const response = await api.post<Client>("/clients", data);
  return response.data;
}

export async function updateClient(id: string, data: UpdateClientData): Promise<Client> {
  const response = await api.patch<Client>(`/clients/${id}`, data);
  return response.data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
