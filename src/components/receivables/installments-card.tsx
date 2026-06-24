"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  markInstallmentGroupAsPaid,
  type AccountReceivable,
  type AccountReceivableStatus,
} from "@/services/receivables";
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

interface InstallmentsCardProps {
  installments: AccountReceivable[];
  installmentGroupId: string;
  currentInstallmentId: string;
  onAllPaid: () => Promise<void>;
}

export function InstallmentsCard({
  installments,
  installmentGroupId,
  currentInstallmentId,
  onAllPaid,
}: InstallmentsCardProps) {
  const [markingAll, setMarkingAll] = useState(false);

  const allPaid = installments.length > 0 && installments.every((i) => i.status === "pago");

  async function handleMarkAllAsPaid() {
    try {
      setMarkingAll(true);
      await markInstallmentGroupAsPaid(installmentGroupId);
      toast.success("Todas as parcelas marcadas como pagas!");
      await onAllPaid();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao atualizar parcelas"
        : "Erro ao atualizar parcelas";
      toast.error(message);
    } finally {
      setMarkingAll(false);
    }
  }

  if (installments.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Parcelas</CardTitle>
        {!allPaid && (
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
            const isCurrent = inst.id === currentInstallmentId;

            return (
              <li
                key={inst.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-foreground"}`}>
                    Parcela {inst.installmentNumber}/{inst.installmentCount}
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
                    {formatCurrency(inst.installmentAmount)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
