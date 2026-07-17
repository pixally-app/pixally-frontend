"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getReceivable, updateReceivable, cancelReceivable, type AccountReceivable } from "@/services/receivables";
import { ReceivableEditDialog } from "@/components/receivables/receivable-edit-dialog";
import { DueDateField } from "@/components/receivables/due-date-field";
import { InstallmentsCard } from "@/components/receivables/installments-card";
import { statusConfig } from "@/components/receivables/status-config";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";

export default function ReceivableDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [receivable, setReceivable] = useState<AccountReceivable | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function fetchReceivable() {
    const r = await getReceivable(id);
    setReceivable(r);
  }

  useEffect(() => {
    getReceivable(id)
      .then((r) => setReceivable(r))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error(err instanceof Error ? err.message : "Erro ao carregar conta a receber.");
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

  async function handleEdit(data: {
    serviceName: string;
    serviceDescription?: string;
    totalAmount: number;
    dueDate: string;
  }) {
    try {
      await updateReceivable(id, data);
      await fetchReceivable();
      toast.success("Conta atualizada com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar conta.");
      throw err;
    }
  }

  async function handleCancel() {
    try {
      setCancelling(true);
      await cancelReceivable(id);
      await fetchReceivable();
      toast.success("Conta cancelada com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cancelar conta.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleMarkAsPaid() {
    try {
      setMarkingPaid(true);
      await updateReceivable(id, { paidAt: new Date().toISOString() });
      await fetchReceivable();
      toast.success("Conta marcada como paga!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar conta.");
    } finally {
      setMarkingPaid(false);
    }
  }

  const status = statusConfig[receivable.status];
  const StatusIcon = status.icon;

  const installments = receivable.installments ?? [];
  const isInstallment = installments.length > 0;

  const totalAmount = receivable.totalAmount;
  const amountPaid = isInstallment
    ? installments.filter((i) => i.paidAt).reduce((sum, i) => sum + i.amount, 0)
    : receivable.paidAt ? receivable.totalAmount : 0;
  const remaining = totalAmount - amountPaid;
  const progressPercent = totalAmount > 0 ? Math.round((amountPaid / totalAmount) * 100) : 0;
  const paidCount = isInstallment ? installments.filter((i) => i.paidAt).length : null;
  const totalCount = isInstallment ? installments.length : null;

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Informações</CardTitle>
              {receivable.status !== "CANCELLED" && (
                <ReceivableEditDialog receivable={receivable} onSubmit={handleEdit} />
              )}
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
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="size-3" />
                      {status.label}
                    </Badge>
                  </dd>
                </div>
                {isInstallment && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Parcelas pagas</dt>
                    <dd className="text-sm font-medium">{paidCount}/{totalCount}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <DueDateField
                    date={formatDate(receivable.dueDate)}
                    status={receivable.status}
                  />
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
                  <dd className="text-sm font-semibold">{formatCurrency(totalAmount)}</dd>
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
                  <span className="text-muted-foreground">
                    {isInstallment ? "Parcelas pagas" : "Progresso"}
                  </span>
                  <span className="font-medium">
                    {isInstallment ? `${paidCount}/${totalCount}` : `${progressPercent}%`}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {!isInstallment && receivable.status !== "PAID" && receivable.status !== "CANCELLED" && (
                <Button
                  className="w-full"
                  onClick={handleMarkAsPaid}
                  disabled={markingPaid}
                >
                  <CheckCircle2 className="size-4" />
                  {markingPaid ? "Salvando..." : "Marcar como Pago"}
                </Button>
              )}

              {receivable.status !== "CANCELLED" && receivable.status !== "PAID" && (
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={cancelling}
                    >
                      <XCircle className="size-4" />
                      {cancelling ? "Cancelando..." : "Cancelar Conta"}
                    </Button>
                  }
                  title="Cancelar conta a receber"
                  description="Tem certeza que deseja cancelar esta conta? Esta ação não pode ser desfeita."
                  confirmLabel="Sim, cancelar"
                  variant="destructive"
                  onConfirm={handleCancel}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isInstallment && (
        <InstallmentsCard
          installments={installments}
          accountReceivableId={receivable.id}
          isCancelled={receivable.status === "CANCELLED"}
          onUpdate={fetchReceivable}
        />
      )}

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
