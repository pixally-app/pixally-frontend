"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getReceivable, type AccountReceivable, type AccountReceivableStatus } from "@/services/receivables";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const statusConfig: Record<
  AccountReceivableStatus,
  { label: string; variant: "warning" | "success" | "destructive"; icon: typeof Clock }
> = {
  pendente: { label: "Pendente", variant: "warning", icon: Clock },
  pago: { label: "Pago", variant: "success", icon: CheckCircle2 },
  vencido: { label: "Vencido", variant: "destructive", icon: AlertTriangle },
};

export default function ReceivableDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [receivable, setReceivable] = useState<AccountReceivable | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getReceivable(id)
      .then(setReceivable)
      .catch((err) => {
        if (isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Erro ao carregar conta a receber");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/receivables"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <p className="text-muted-foreground text-sm">Carregando...</p>
      </div>
    );
  }

  if (notFound || !receivable) {
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

  const status = statusConfig[receivable.status];
  const StatusIcon = status.icon;
  const amountPaid = receivable.paidAt ? receivable.totalAmount : 0;
  const remaining = receivable.totalAmount - amountPaid;
  const progressPercent = receivable.totalAmount > 0
    ? Math.round((amountPaid / receivable.totalAmount) * 100)
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
                  <dt className="text-sm text-muted-foreground">Serviço</dt>
                  <dd className="text-sm font-medium">{receivable.serviceName ?? "-"}</dd>
                </div>
                {receivable.serviceDescription && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Descrição</dt>
                    <dd className="text-sm font-medium">{receivable.serviceDescription}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-muted-foreground">Cliente</dt>
                  <dd className="text-sm font-medium">{receivable.clientName ?? "-"}</dd>
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
                {receivable.installmentCount && receivable.installmentCount > 1 && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Parcela</dt>
                    <dd className="text-sm font-medium">
                      {receivable.installmentNumber}/{receivable.installmentCount}
                    </dd>
                  </div>
                )}
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
                  <dd className="text-sm font-semibold">{formatCurrency(receivable.totalAmount)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Valor Pago</dt>
                  <dd className="text-sm font-semibold text-success">{formatCurrency(amountPaid)}</dd>
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
          <CardTitle className="text-lg font-bold">PIX Vinculado</CardTitle>
        </CardHeader>
        <CardContent>
          {receivable.pixReceiptId ? (
            <Link
              href={`/receipts/${receivable.pixReceiptId}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Ver comprovante PIX
              <ArrowRight className="size-3.5" />
            </Link>
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
