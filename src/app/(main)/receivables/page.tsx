"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Plus, ChevronRight, Wallet } from "lucide-react";
import { ReceivableFormDialog } from "@/components/receivables/receivable-form-dialog";
import { statusConfig } from "@/components/receivables/status-config";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { PAGE_SIZE } from "@/lib/constants";
import {
  listReceivables,
  createReceivable,
  type AccountReceivable,
  type AccountReceivableStatus,
} from "@/services/receivables";
import { toast } from "sonner";

const filters = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "PENDING" },
  { label: "Pagos", value: "PAID" },
  { label: "Vencidos", value: "OVERDUE" },
  { label: "Cancelados", value: "CANCELLED" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

export default function ReceivablesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [receivables, setReceivables] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({ pendente: 0, pago: 0, vencido: 0 });

  const fetchReceivables = useCallback(async (p: number, f: FilterValue) => {
    try {
      setLoading(true);
      const params: Parameters<typeof listReceivables>[0] = { page: p, limit: PAGE_SIZE };
      if (f !== "all") params.status = f as AccountReceivableStatus;
      const response = await listReceivables(params);
      setReceivables(response.data);
      setTotalPages(response.totalPages);
      setSummary({ pendente: response.totalPending, pago: response.totalPaid, vencido: response.totalOverdue });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar contas a receber.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceivables(page, filter);
  }, [fetchReceivables, page, filter]);

  async function handleCreate(data: {
    serviceName: string;
    description: string;
    clientId: string;
    amount: string;
    installments: number;
    dueDate: string;
  }) {
    const totalAmount = parseFloat(data.amount);
    const installmentCount = data.installments > 1 ? data.installments : undefined;

    try {
      await createReceivable({
        clientId: data.clientId,
        serviceName: data.serviceName || undefined,
        serviceDescription: data.description || undefined,
        totalAmount,
        installmentCount,
        dueDate: data.dueDate,
      });
      toast.success("Conta a receber criada com sucesso!");
      fetchReceivables(page, filter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta a receber.");
      throw err;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contas a Receber</h1>
        <p className="text-muted-foreground">
          Registre o que tem para receber e acompanhe a conciliação automática
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="grid grid-cols-3 sm:flex sm:flex-row gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(f.value); setPage(1); }}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">Pendente</p>
            <p className="text-2xl font-bold text-warning">{formatCurrency(summary.pendente)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">Pago</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(summary.pago)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">Vencido</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(summary.vencido)}</p>
          </CardContent>
        </Card>
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
              receivables.map((r) => {
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
