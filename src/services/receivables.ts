import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

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

export interface ReceiptRef {
  id: string;
  depositAmount: number | null;
  depositDateTime: string | null;
}

export interface AccountReceivable {
  id: string;
  userId: string;
  clientId: string;
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
  receipts?: ReceiptRef[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReceivables {
  data: AccountReceivable[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalPending: number;
  totalPaid: number;
  totalOverdue: number;
}

export interface ListReceivablesParams {
  status?: AccountReceivableStatus;
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface CreateReceivableData {
  clientId: string;
  serviceName?: string;
  serviceDescription?: string;
  totalAmount: number;
  installmentCount?: number;
  dueDate: string;
  payStub?: string;
}

export interface UpdateReceivableData {
  serviceName?: string;
  serviceDescription?: string;
  totalAmount?: number;
  dueDate?: string;
  paidAt?: string;
  payStub?: string;
}

export async function listReceivables(params?: ListReceivablesParams): Promise<PaginatedReceivables> {
  try {
    const response = await api.get<PaginatedReceivables>("/accounts-receivable", { params });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar contas a receber.");
  }
}

export async function getReceivable(id: string): Promise<AccountReceivable> {
  try {
    const response = await api.get<AccountReceivable>(`/accounts-receivable/${id}`);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Conta a receber não encontrada.",
    }, "Erro ao carregar conta a receber.");
  }
}

export async function createReceivable(data: CreateReceivableData): Promise<AccountReceivable> {
  try {
    const response = await api.post<AccountReceivable>("/accounts-receivable", data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Cliente não encontrado.",
      422: "Dados inválidos.",
    }, "Erro ao criar conta a receber.");
  }
}

export async function updateReceivable(id: string, data: UpdateReceivableData): Promise<AccountReceivable> {
  try {
    const response = await api.patch<AccountReceivable>(`/accounts-receivable/${id}`, data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      422: "Dados inválidos.",
    }, "Erro ao atualizar conta.");
  }
}

export interface UpdateInstallmentData {
  amount?: number;
  dueDate?: string;
}

export async function updateInstallment(accountReceivableId: string, installmentId: string, data: UpdateInstallmentData): Promise<AccountReceivable> {
  try {
    const response = await api.patch<AccountReceivable>(`/accounts-receivable/${accountReceivableId}/installments/${installmentId}`, data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      422: "Dados inválidos.",
    }, "Erro ao atualizar parcela.");
  }
}

export async function markAllInstallmentsAsPaid(accountReceivableId: string): Promise<AccountReceivable> {
  try {
    const response = await api.patch<AccountReceivable>(`/accounts-receivable/${accountReceivableId}/installments/mark-all-paid`);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao marcar parcelas como pagas.");
  }
}

export async function markInstallmentAsPaid(accountReceivableId: string, installmentId: string): Promise<AccountReceivable> {
  try {
    const response = await api.patch<AccountReceivable>(`/accounts-receivable/${accountReceivableId}/installments/${installmentId}/mark-paid`);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao marcar parcela como paga.");
  }
}

export async function cancelReceivable(id: string): Promise<AccountReceivable> {
  try {
    const response = await api.patch<AccountReceivable>(`/accounts-receivable/${id}/cancel`);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      422: "Conta não pode ser cancelada neste status.",
    }, "Erro ao cancelar conta.");
  }
}

export async function deleteReceivable(id: string): Promise<void> {
  try {
    await api.delete(`/accounts-receivable/${id}`);
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao excluir conta a receber.");
  }
}
