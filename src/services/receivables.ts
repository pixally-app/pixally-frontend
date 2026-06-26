import { api } from "./api";

export type AccountReceivableStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: AccountReceivableStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountReceivable {
  id: string;
  userId: string;
  clientId: string;
  pixReceiptId: string | null;
  clientName: string | null;
  serviceName: string | null;
  serviceDescription: string | null;
  totalAmount: number;
  installmentCount: number | null;
  dueDate: string;
  status: AccountReceivableStatus;
  paidAt: string | null;
  payStub: string | null;
  matchedAutomatically: boolean | null;
  installments?: Installment[];
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
  installmentCount?: number;
  dueDate: string;
  payStub?: string;
}

export interface UpdateReceivableData {
  pixReceiptId?: string;
  serviceName?: string;
  serviceDescription?: string;
  totalAmount?: number;
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
  const response = await api.patch<AccountReceivable>(`/accounts-receivable/${id}`, data);
  return response.data;
}

export async function markAllInstallmentsAsPaid(accountReceivableId: string): Promise<AccountReceivable> {
  const response = await api.patch<AccountReceivable>(`/accounts-receivable/${accountReceivableId}/installments/mark-all-paid`);
  return response.data;
}

export async function markInstallmentAsPaid(accountReceivableId: string, installmentId: string): Promise<AccountReceivable> {
  const response = await api.patch<AccountReceivable>(`/accounts-receivable/${accountReceivableId}/installments/${installmentId}/mark-paid`);
  return response.data;
}

export async function cancelReceivable(id: string): Promise<AccountReceivable> {
  const response = await api.patch<AccountReceivable>(`/accounts-receivable/${id}/cancel`);
  return response.data;
}

export async function deleteReceivable(id: string): Promise<void> {
  await api.delete(`/accounts-receivable/${id}`);
}
