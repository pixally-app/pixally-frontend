"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { receipts, statusConfig, statusDescription } from "@/data/mock-receipts";

const statusBgColor: Record<string, string> = {
  conciliado: "bg-success/10",
  problema: "bg-destructive/10",
  alerta: "bg-warning/10",
  recebido: "bg-success/10",
  analisando: "bg-secondary/30",
};

export default function ReceiptDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const receipt = receipts.find((r) => r.id === id);

  if (!receipt) {
    return (
      <div className="space-y-6">
        <Link
          href="/receipts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Comprovante não encontrado</h1>
      </div>
    );
  }

  const status = statusConfig[receipt.status];

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalhes do Comprovante</h1>
          {receipt.status === "problema" && (
            <Button variant="destructive">
              <Trash2 className="size-4" />
              Deletar
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          ID da Transação PIX: {receipt.transactionId}
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
          {/* Status badge */}
          <Card className={statusBgColor[receipt.status]}>
            <CardContent className="p-4">
              <Badge variant={status.variant} className="text-sm px-3 py-1">
                {status.label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {statusDescription[receipt.status]}
              </p>
            </CardContent>
          </Card>

          {/* Conta a receber vinculada */}
          {receipt.linkedReceivable && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-success font-semibold text-sm mb-1">
                  <span>Conta a Receber Vinculada</span>
                </div>
                <p className="font-semibold">{receipt.linkedReceivable.title}</p>
                <p className="text-sm text-muted-foreground">
                  Cliente: {receipt.linkedReceivable.client} | Valor: {receipt.linkedReceivable.amount}
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
          )}

          {/* Dados do Pagador */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">
                Dados do Pagador
              </CardTitle>
              <Button variant="outline" size="sm">
                <Pencil className="size-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Nome</dt>
                  <dd className="text-sm font-medium">{receipt.clientName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Agência</dt>
                  <dd className="text-sm font-medium">{receipt.agency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Conta</dt>
                  <dd className="text-sm font-medium">{receipt.account}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">CPF/CNPJ</dt>
                  <dd className="text-sm font-medium">{receipt.cpfCnpj}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Banco</dt>
                  <dd className="text-sm font-medium">{receipt.clientBank}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Valor</dt>
                  <dd className="text-sm font-semibold text-success">{receipt.amount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Descrição</dt>
                  <dd className="text-sm font-medium text-right max-w-[60%]">
                    {receipt.description}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Data e Hora do Pagamento</dt>
                  <dd className="text-sm font-medium">{receipt.date}, {receipt.time}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Dados do Recebedor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Dados do Recebedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Nome:</dt>
                  <dd className="text-sm font-medium">{receipt.receiverName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Banco:</dt>
                  <dd className="text-sm font-medium">{receipt.receiverBank}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">CPF/CNPJ:</dt>
                  <dd className="text-sm font-medium">{receipt.receiverCpfCnpj}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">ID da Transação PIX:</dt>
                  <dd className="text-sm font-medium text-right max-w-[60%] break-all">
                    {receipt.receiverPixId}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
