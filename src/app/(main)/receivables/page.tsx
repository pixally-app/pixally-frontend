"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Clock, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { receivables, type ReceivableStatus } from "@/data/mock-receivables";

const statusConfig: Record<
  ReceivableStatus,
  { label: string; variant: "warning" | "success" | "destructive"; icon: typeof Clock }
> = {
  pending: { label: "Pendente", variant: "warning", icon: Clock },
  reconciled: { label: "Conciliado", variant: "success", icon: CheckCircle2 },
  overdue: { label: "Vencido", variant: "destructive", icon: AlertTriangle },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const filters = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Conciliados", value: "reconciled" },
  { label: "Vencidos", value: "overdue" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

export default function ReceivablesPage() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return receivables;
    return receivables.filter((r) => r.status === filter);
  }, [filter]);

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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <Button className="w-full sm:w-auto">
          <Plus className="size-4" />
          Nova Conta a Receber
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="hidden sm:table-cell">Vencimento</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const config = statusConfig[r.status];
              const StatusIcon = config.icon;

              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.description}</TableCell>
                  <TableCell>{r.clientName}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatCurrency(r.amount)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{formatDate(r.dueDate)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={config.variant} className="gap-1">
                      <StatusIcon className="size-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
