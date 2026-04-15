"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { receivables, type ReceivableStatus } from "@/data/mock-receivables";
import { receipts, statusConfig as receiptStatusConfig } from "@/data/mock-receipts";
import { formatCurrency, formatDate } from "@/lib/formatters";

const statusConfig: Record<
  ReceivableStatus,
  { label: string; variant: "warning" | "success" | "destructive"; icon: typeof Clock }
> = {
  pending: { label: "Pendente", variant: "warning", icon: Clock },
  reconciled: { label: "Conciliado", variant: "success", icon: CheckCircle2 },
  overdue: { label: "Vencido", variant: "destructive", icon: AlertTriangle },
};

export default function ReceivableDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const receivable = receivables.find((r) => r.id === id);

  if (!receivable) {
    return (
      <div className="space-y-6">
        <Link
          href="/receivables"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Conta a receber não encontrada</h1>
      </div>
    );
  }

  const linkedReceipts = receipts.filter((r) => r.receivableId === receivable.id);
  const status = statusConfig[receivable.status];
  const StatusIcon = status.icon;
  const remaining = receivable.amount - receivable.amountPaid;
  const progressPercent = receivable.amount > 0
    ? Math.round((receivable.amountPaid / receivable.amount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/receivables"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Detalhes da Conta a Receber</h1>
        <p className="text-sm text-muted-foreground">
          {receivable.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Descrição</dt>
                  <dd className="text-sm font-medium">{receivable.description}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Cliente</dt>
                  <dd className="text-sm font-medium">{receivable.clientName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Criado em</dt>
                  <dd className="text-sm font-medium">{formatDate(receivable.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Vencimento</dt>
                  <dd className="text-sm font-medium">{formatDate(receivable.dueDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="size-3" />
                      {status.label}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Valor Total</dt>
                  <dd className="text-sm font-semibold">{formatCurrency(receivable.amount)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Valor Pago</dt>
                  <dd className="text-sm font-semibold text-success">{formatCurrency(receivable.amountPaid)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Restante</dt>
                  <dd className="text-sm font-semibold text-destructive">{formatCurrency(remaining)}</dd>
                </div>
              </dl>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">PIX Vinculados</CardTitle>
        </CardHeader>
        <CardContent>
          {linkedReceipts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedReceipts.map((receipt) => {
                  const rStatus = receiptStatusConfig[receipt.status];
                  return (
                    <TableRow key={receipt.id}>
                      <TableCell className="text-sm">
                        {receipt.date}, {receipt.time}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-primary">
                        {receipt.amount}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={rStatus.variant} className="gap-1">
                          {rStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/receipts/${receipt.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                        >
                          Ver comprovante
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum PIX vinculado a esta conta a receber.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
