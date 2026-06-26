"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, ChevronRight, Wallet, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { ReceivableFormDialog } from "@/components/receivables/receivable-form-dialog";
import { statusConfig } from "@/components/receivables/status-config";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  listReceivables,
  createReceivable,
  type AccountReceivable,
  type AccountReceivableStatus,
} from "@/services/receivables";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const filters = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "PENDING" },
  { label: "Pagos", value: "PAID" },
  { label: "Vencidos", value: "OVERDUE" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

export default function ReceivablesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [receivables, setReceivables] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceivables = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter as AccountReceivableStatus, limit: 100 } : { limit: 100 };
      const response = await listReceivables(params);
      setReceivables(response.data);
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao carregar contas a receber"
        : "Erro ao carregar contas a receber";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]);

  const sortedReceivables = useMemo(
    () => [...receivables].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [receivables]
  );

  const summary = useMemo(() => {
    let pendente = 0;
    let pago = 0;
    let vencido = 0;

    for (const r of receivables) {
      if (r.status === "PENDING") pendente += r.totalAmount;
      else if (r.status === "PAID") pago += r.totalAmount;
      else if (r.status === "OVERDUE") vencido += r.totalAmount;
    }

    return { pendente, pago, vencido };
  }, [receivables]);

  async function handleCreate(data: {
    serviceName: string;
    description: string;
    clientId: string;
    amount: string;
    installments: number;
    dueDate: string;
  }) {
    const totalAmount = parseFloat(data.amount.replace(/\./g, "").replace(",", "."));
    const installmentCount = data.installments > 1 ? data.installments : undefined;

    await createReceivable({
      clientId: data.clientId,
      serviceName: data.serviceName || undefined,
      serviceDescription: data.description || undefined,
      totalAmount,
      installmentCount,
      dueDate: data.dueDate,
    });

    toast.success("Conta a receber criada com sucesso!");
    fetchReceivables();
  }

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
              {formatCurrency(summary.pendente)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pago</span>
              <CheckCircle2 className="size-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(summary.pago)}
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
              {formatCurrency(summary.vencido)}
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

        <ReceivableFormDialog
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              Nova Conta a Receber
            </Button>
          }
          onSubmit={handleCreate}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="hidden sm:table-cell">Vencimento</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : receivables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Wallet className="size-8" />
                    <p className="text-sm">Nenhuma conta a receber encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedReceivables.map((r) => {
                const config = statusConfig[r.status];
                const StatusIcon = config.icon;

                return (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/receivables/${r.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/receivables/${r.id}`);
                      }
                    }}
                  >
                    <TableCell className="font-medium">
                      {r.serviceName ?? "-"}
                    </TableCell>
                    <TableCell>{r.clientName ?? "-"}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatCurrency(r.totalAmount)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(r.dueDate)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={config.variant} className="gap-1">
                        <StatusIcon className="size-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-10 pr-4">
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
