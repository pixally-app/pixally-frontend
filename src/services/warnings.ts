import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

export type WarningType = "red" | "yellow";

export interface Warning {
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
  client: { name: string } | null;
}

export interface PaginatedWarnings {
  data: Warning[];
  total: number;
  yellowCount: number;
  redCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListWarningsParams {
  type?: WarningType;
  page?: number;
  limit?: number;
}

export async function listWarnings(params?: ListWarningsParams): Promise<PaginatedWarnings> {
  try {
    const response = await api.get<PaginatedWarnings>("/warnings", { params });
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar alertas.");
  }
}

export async function resolveWarning(
  warningId: string,
  resolutionReason: string
): Promise<Warning> {
  try {
    const response = await api.patch<Warning>(`/warnings/${warningId}/resolve`, {
      resolutionReason,
    });
    return response.data;
  } catch (err) {
    throw resolveApiError(
      err,
      {
        400: "Alerta já foi resolvido.",
        404: "Alerta não encontrado.",
      },
      "Erro ao resolver alerta."
    );
  }
}
