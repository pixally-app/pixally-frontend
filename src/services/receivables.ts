import { api } from "./api";

export type AccountReceivableStatus = "pendente" | "pago" | "vencido";

export interface AccountReceivable {
  id: string;
  userId: string;
  clientId: string;
  pixReceiptId: string | null;
  clientName: string | null;
  serviceName: string | null;
  serviceDescription: string | null;
  totalAmount: number;
  installmentGroupId: string | null;
  installmentCount: number | null;
  installmentNumber: number | null;
  installmentAmount: number;
  dueDate: string;
  status: AccountReceivableStatus;
  paidAt: string | null;
  payStub: string | null;
  matchedAutomatically: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReceivables {
  data: AccountReceivable[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListReceivablesParams {
  status?: AccountReceivableStatus;
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface CreateReceivableData {
  clientId: string;
  pixReceiptId?: string;
  serviceName?: string;
  serviceDescription?: string;
  totalAmount: number;
  installmentGroupId?: string;
  installmentCount?: number;
  installmentNumber?: number;
  installmentAmount?: number;
  dueDate: string;
  payStub?: string;
}

export interface UpdateReceivableData {
  pixReceiptId?: string;
  serviceName?: string;
  serviceDescription?: string;
  totalAmount?: number;
  installmentCount?: number;
  installmentNumber?: number;
  installmentAmount?: number;
  dueDate?: string;
  paidAt?: string;
  payStub?: string;
}

export async function listReceivables(params?: ListReceivablesParams): Promise<PaginatedReceivables> {
  const response = await api.get<PaginatedReceivables>("/accounts-receivable", { params });
  return response.data;
}

export async function getReceivable(id: string): Promise<AccountReceivable> {
  const response = await api.get<AccountReceivable>(`/accounts-receivable/${id}`);
  return response.data;
}

export async function createReceivable(data: CreateReceivableData): Promise<AccountReceivable> {
  const response = await api.post<AccountReceivable>("/accounts-receivable", data);
  return response.data;
}

export async function updateReceivable(id: string, data: UpdateReceivableData): Promise<AccountReceivable> {
  const response = await api.put<AccountReceivable>(`/accounts-receivable/${id}`, data);
  return response.data;
}

export async function deleteReceivable(id: string): Promise<void> {
  await api.delete(`/accounts-receivable/${id}`);
}
