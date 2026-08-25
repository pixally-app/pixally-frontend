import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

export interface DashboardSummary {
  receivedThisMonth: number;
  totalPending: number;
  totalOverdue: number;
  processedThisMonth: number;
}

export interface GraphicPoint {
  date: string;
  valor: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await api.get<DashboardSummary>("/dashboard/resumo");
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar resumo do dashboard.");
  }
}

export async function getDashboardGraphic(): Promise<GraphicPoint[]> {
  try {
    const response = await api.get<GraphicPoint[]>("/dashboard/graphic");
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {}, "Erro ao carregar dados do gráfico.");
  }
}
