import { api } from "./api";
import { resolveApiError } from "@/lib/api-error";

export interface QrCodeResponse {
  qrCode: string | null;
  state: string;
}

export interface ZapfyStatusResponse {
  state: string;
  active: boolean;
  connectedAt: string | null;
  disconnectedAt: string | null;
}

export async function getZapfyQrCode(): Promise<QrCodeResponse> {
  try {
    const response = await api.get<QrCodeResponse>("/zapfy/qrcode");
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Nenhuma integração WhatsApp configurada.",
      422: "Credenciais inválidas. Verifique sua instância Zapfy.",
      503: "Serviço temporariamente indisponível. Tente novamente.",
    }, "Erro ao carregar o QR Code. Tente novamente.");
  }
}

export async function disconnectZapfy(): Promise<void> {
  try {
    await api.post("/zapfy/disconnect");
  } catch (err) {
    throw resolveApiError(err, {
      404: "Nenhuma integração WhatsApp configurada.",
      503: "Serviço temporariamente indisponível. Tente novamente.",
    }, "Erro ao desconectar WhatsApp.");
  }
}

export async function getZapfyStatus(): Promise<ZapfyStatusResponse> {
  try {
    const response = await api.get<ZapfyStatusResponse>("/zapfy/status");
    return response.data;
  } catch (err) {
    throw resolveApiError(err, {
      404: "Nenhuma integração WhatsApp configurada.",
      503: "Serviço temporariamente indisponível. Tente novamente.",
    }, "Erro ao verificar status do WhatsApp.");
  }
}
