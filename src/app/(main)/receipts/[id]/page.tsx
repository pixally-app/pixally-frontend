"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReceiptDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/receipts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Detalhes do Comprovante</h1>
        <p className="text-sm text-muted-foreground">
          ID da Transação PIX: F34567890123456789012345678901BC
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Imagem do Comprovante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg bg-muted h-[400px] text-muted-foreground text-sm">
                Imagem do comprovante
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-success/10">
            <CardContent className="p-4">
              <Badge variant="success" className="text-sm px-3 py-1">
                Conciliado
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Vinculado a uma conta a receber
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-success font-semibold text-sm mb-1">
                <span>Conta a Receber Vinculada</span>
              </div>
              <p className="font-semibold">Instalação elétrica</p>
              <p className="text-sm text-muted-foreground">
                Cliente: Maria Santos | Valor: R$ 200,50
              </p>
              <Link
                href="/receivables"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2"
              >
                Ver conta a receber
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
