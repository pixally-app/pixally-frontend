"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { receivables } from "@/data/mock-receivables";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ReceivablesPage() {
  const summary = useMemo(() => {
    let pending = 0;
    let reconciled = 0;
    let overdue = 0;

    for (const r of receivables) {
      if (r.status === "pending") pending += r.amount;
      else if (r.status === "reconciled") reconciled += r.amount;
      else if (r.status === "overdue") overdue += r.amount;
    }

    return { pending, reconciled, overdue };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contas a Receber</h1>
        <p className="text-muted-foreground">
          Registre o que tem para receber e acompanhe a conciliação automática
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pendente</span>
              <Clock className="size-5 text-warning" />
            </div>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(summary.pending)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Conciliado</span>
              <CheckCircle2 className="size-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(summary.reconciled)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Vencido</span>
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(summary.overdue)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
