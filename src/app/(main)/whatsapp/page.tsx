"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Info, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getZapfyQrCode, disconnectZapfy } from "@/services/zapfy";
import { useWhatsApp } from "@/contexts/whatsapp-context";
import { Button } from "@/components/ui/button";

const steps = [
  "Abra o WhatsApp no seu celular",
  'Toque em "Dispositivos conectados"',
  'Toque em "Conectar um dispositivo"',
  "Escaneie o código QR abaixo",
];

export default function WhatsAppPage() {
  const { isConnected, connectedAt, loading, statusError, refreshStatus } = useWhatsApp();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  const fetchQrCode = useCallback(() => {
    setQrLoading(true);
    getZapfyQrCode()
      .then(({ qrCode, state }) => {
        if (state === "connected") {
          refreshStatus();
        } else {
          setQrCode(qrCode);
        }
      })
      .catch((err) => {
        setQrCode(null);
        toast.error(err instanceof Error ? err.message : "Erro ao carregar o QR Code. Tente novamente.");
      })
      .finally(() => setQrLoading(false));
  }, [refreshStatus]);

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await disconnectZapfy();
      await refreshStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao desconectar WhatsApp.");
    } finally {
      setDisconnecting(false);
    }
  }

  useEffect(() => {
    if (loading) return;

    if (isConnected) {
      stopPolling();
      setQrCode(null);
      return;
    }

    if (statusError) return;

    fetchQrCode();

    pollingRef.current = setInterval(async () => {
      try {
        await refreshStatus();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao verificar status.");
        stopPolling();
      }
    }, 5000);

    return () => stopPolling();
  }, [loading, isConnected, statusError, refreshStatus, fetchQrCode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp</h1>
          <p className="text-muted-foreground">
            Conecte seu WhatsApp para receber comprovantes automaticamente
          </p>
        </div>

        {!loading && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              isConnected
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isConnected ? "bg-success" : "bg-muted-foreground"
              }`}
            />
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Recomendamos conectar um número dedicado ao negócio, de preferência
          usando o <span className="font-semibold">WhatsApp Business</span>.
          Isso evita conflitos com o uso pessoal e garante melhor estabilidade
          da conexão.
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : isConnected ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 className="size-12 text-success" />
              <p className="text-lg font-semibold">WhatsApp conectado</p>
              {connectedAt && (
                <p className="text-sm text-muted-foreground">
                  Conectado em{" "}
                  {new Date(connectedAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              )}
              <Button
                variant="outline"
                disabled={disconnecting}
                onClick={handleDisconnect}
              >
                {disconnecting && <Loader2 className="size-4 animate-spin" />}
                {disconnecting ? "Desconectando..." : "Desconectar"}
              </Button>
            </div>
          ) : statusError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-destructive">{statusError}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center rounded-lg bg-muted size-64">
                  {qrLoading || !qrCode ? (
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                  ) : (
                    <img
                      src={qrCode}
                      alt="QR Code WhatsApp"
                      className="size-64 rounded-lg"
                    />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={qrLoading}
                  onClick={fetchQrCode}
                >
                  <RefreshCw className="size-3.5" />
                  Recarregar QR Code
                </Button>
              </div>

              <div className="w-full space-y-3">
                <h2 className="text-lg font-semibold">Como conectar</h2>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
