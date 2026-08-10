import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

export type ReceiptStatus = "ANALYSING" | "RECEIVED" | "RED_FLAG" | "YELLOW_FLAG" | "ERROR" | "RECONCILED";
export type ReceiptOrigin = "whatsapp" | "manual";
export type WarningType = "red" | "yellow";

export interface ReceiptClient {
  id: string;
  name: string;
}

export interface ReceiptWarning {
  id: string;
  pixReceiptId: string;
  clientId: string | null;
  type: WarningType;
  message: string;
  resolved: boolean | null;
  resolutionReason: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptBlob {
  id: string;
  pixReceiptsId: string;
  mimeType: string;
  filePath: string | null;
  fileUrl: string | null;
}

export interface Receipt {
  id: string;
  userId: string;
  clientId: string | null;
  status: ReceiptStatus;
  origin: ReceiptOrigin;
  documentFormat: string | null;
  description: string | null;
  depositDateTime: string | null;
  depositAmount: string | number | null;
  depositOriginName: string | null;
  depositOriginDocument: string | null;
  depositOriginDocumentType: string | null;
  depositOriginBank: string | null;
  depositOriginAgency: string | null;
  depositOriginAccount: string | null;
  depositDestinationName: string | null;
  depositDestinationDocument: string | null;
  depositDestinationDocumentType: string | null;
  depositDestinationBank: string | null;
  depositDestinationAgency: string | null;
  depositDestinationAccount: string | null;
  pixTransactionId: string | null;
  processmentOcrOutcome: string | null;
  jid: string | null;
  messageId: string | null;
  isDeletedWhatsapp: boolean | null;
  blob: ReceiptBlob[];
  warnings: ReceiptWarning[];
  client: ReceiptClient | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReceipts {
  data: Receipt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListReceiptsParams {
  status?: ReceiptStatus;
  origin?: ReceiptOrigin;
  clientName?: string;
  page?: number;
  limit?: number;
}

export async function getReceipt(id: string): Promise<Receipt> {
  try {
    const response = await api.get<Receipt>(`/receipts/${id}`);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Comprovante não encontrado.",
    }, "Erro ao carregar comprovante.");
  }
}

export async function listReceipts(params?: ListReceiptsParams): Promise<PaginatedReceipts> {
  try {
    const response = await api.get<PaginatedReceipts>("/receipts", { params });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar comprovantes.");
  }
}

export async function deleteReceipt(id: string): Promise<void> {
  try {
    await api.delete(`/receipts/${id}`);
  } catch (err) {
    throw resolveApiError(err, {
      404: "Comprovante não encontrado.",
    }, "Erro ao excluir comprovante.");
  }
}

export interface UpdateReceiptPayload {
  pixTransactionId?: string | null;
  depositOriginName?: string | null;
  depositOriginBank?: string | null;
  depositOriginAgency?: string | null;
  depositOriginAccount?: string | null;
  depositOriginDocument?: string | null;
  depositAmount?: number | null;
  depositDateTime?: string | null;
  description?: string | null;
  depositDestinationName?: string | null;
  depositDestinationBank?: string | null;
  depositDestinationDocument?: string | null;
  depositDestinationAccount?: string | null;
  clientId?: string;
}

export async function updateReceipt(id: string, data: UpdateReceiptPayload): Promise<Receipt> {
  try {
    const response = await api.patch<Receipt>(`/receipts/${id}`, data);
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Comprovante não encontrado.",
    }, "Erro ao salvar alterações.");
  }
}

export async function uploadReceipt(file: File): Promise<Receipt> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<Receipt>("/receipts/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      400: "Arquivo inválido ou corrompido.",
      422: "Formato de comprovante não reconhecido.",
    }, "Erro ao enviar comprovante.");
  }
}
