"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2, CheckCircle2, Info } from "lucide-react";

const steps = [
  "Abra o WhatsApp no seu celular",
  'Toque em "Dispositivos conectados"',
  'Toque em "Conectar um dispositivo"',
  "Escaneie o código QR abaixo",
];

export default function WhatsAppPage() {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const connectedPhone = "(11) 99999-9999";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">WhatsApp</h1>
        <p className="text-muted-foreground">
          Conecte seu WhatsApp para receber comprovantes automaticamente
        </p>
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
          {status === "disconnected" ? (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center rounded-lg bg-muted size-64 text-muted-foreground">
                <MessageCircle className="size-16" />
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

              <Button
                className="w-full"
                onClick={() => setStatus("connecting")}
              >
                <MessageCircle className="size-4" />
                Conectar
              </Button>
            </div>
          ) : status === "connecting" ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <MessageCircle className="size-12 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-lg font-semibold">Conectando...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Aguardando conexão...
              </p>
              <Button
                variant="outline"
                onClick={() => setStatus("disconnected")}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="size-12 text-success" />
              <span className="text-lg font-semibold">Conectado com sucesso</span>
              <p className="text-sm text-muted-foreground">
                {connectedPhone}
              </p>
              <Button
                variant="outline"
                onClick={() => setStatus("disconnected")}
              >
                Desconectar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
