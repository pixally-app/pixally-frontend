"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  markAllInstallmentsAsPaid,
  markInstallmentAsPaid,
  type Installment,
} from "@/services/receivables";
import { statusConfig } from "@/components/receivables/status-config";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface InstallmentsCardProps {
  installments: Installment[];
  accountReceivableId: string;
  isCancelled?: boolean;
  onUpdate: () => Promise<void>;
}

export function InstallmentsCard({
  installments,
  accountReceivableId,
  isCancelled = false,
  onUpdate,
}: InstallmentsCardProps) {
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const allPaid = installments.length > 0 && installments.every((i) => i.status === "PAID");
  const totalCount = installments.length;

  async function handleMarkAllAsPaid() {
    try {
      setMarkingAll(true);
      await markAllInstallmentsAsPaid(accountReceivableId);
      toast.success("Todas as parcelas marcadas como pagas!");
      await onUpdate();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao atualizar parcelas"
        : "Erro ao atualizar parcelas";
      toast.error(message);
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleMarkOnePaid(installmentId: string) {
    try {
      setMarkingId(installmentId);
      await markInstallmentAsPaid(accountReceivableId, installmentId);
      toast.success("Parcela marcada como paga!");
      await onUpdate();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao atualizar parcela"
        : "Erro ao atualizar parcela";
      toast.error(message);
    } finally {
      setMarkingId(null);
    }
  }

  if (installments.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Parcelas</CardTitle>
        {!allPaid && !isCancelled && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllAsPaid}
            disabled={markingAll}
          >
            <CheckCircle2 className="size-4" />
            {markingAll ? "Salvando..." : "Marcar todas como pagas"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {installments.map((inst) => {
            const config = statusConfig[inst.status];
            const StatusIcon = config.icon;
            const isMarkingThis = markingId === inst.id;

            return (
              <li
                key={inst.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    Parcela {inst.installmentNumber}/{totalCount}
                  </span>
                  <Badge variant={config.variant} className="gap-1">
                    <StatusIcon className="size-3" />
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {formatDate(inst.dueDate)}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(inst.amount)}
                  </span>
                  {inst.status !== "PAID" && !isCancelled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkOnePaid(inst.id)}
                      disabled={isMarkingThis || markingAll}
                      className="text-xs"
                    >
                      {isMarkingThis ? "..." : "Marcar pago"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
