"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { AlertTriangle, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { listWarnings, resolveWarning, type Warning, type WarningType } from "@/services/warnings";
import { formatDateTime } from "@/lib/formatters";
import { ResolveAlertDialog } from "@/components/alerts/resolve-alert-dialog";
import { toast } from "sonner";

const LIMIT = 9;

const warningConfig: Record<WarningType, { label: string; variant: "warning" | "destructive" }> = {
  yellow: { label: "Atenção", variant: "warning" },
  red: { label: "Crítico", variant: "destructive" },
};

const filters = [
  { label: "Todos", value: "all", activeVariant: "default" },
  { label: "Atenção", value: "yellow", activeVariant: "warning" },
  { label: "Crítico", value: "red", activeVariant: "destructive" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

const summaryCards = [
  { label: "Alertas Pendentes", key: "total" as const, color: "text-foreground", icon: <AlertTriangle className="size-5 text-warning" /> },
  { label: "Atenção", key: "yellow" as const, color: "text-warning", icon: <span className="size-3 rounded-full bg-warning" /> },
  { label: "Crítico", key: "red" as const, color: "text-destructive", icon: <span className="size-3 rounded-full bg-destructive" /> },
];

export default function AlertsPage() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [summary, setSummary] = useState({ total: 0, yellow: 0, red: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");

  const fetchWarnings = useCallback(async (p: number, f: FilterValue) => {
    setLoading(true);
    try {
      const params = {
        page: p,
        limit: LIMIT,
        ...(f !== "all" && { type: f as WarningType }),
      };
      const result = await listWarnings(params);
      setWarnings(result.data);
      setTotalPages(result.totalPages);
      const yellow = result.yellowCount ?? 0;
      const red = result.redCount ?? 0;
      setSummary({ total: yellow + red, yellow, red });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar alertas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarnings(page, filter);
  }, [fetchWarnings, page, filter]);

  function handleFilterChange(value: FilterValue) {
    setFilter(value);
    setPage(1);
  }

  async function handleResolve(warningId: string, reason: string) {
    try {
      await resolveWarning(warningId, reason);
      const isLastOnPage = warnings.length === 1 && page > 1;
      const targetPage = isLastOnPage ? page - 1 : page;
      if (isLastOnPage) setPage(targetPage);
      else fetchWarnings(page, filter);
      toast.success("Alerta resolvido com sucesso.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao resolver alerta.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alertas</h1>
        <p className="text-muted-foreground">Central de alertas detectados pelo sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                {card.icon}
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{summary[card.key]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? f.activeVariant : "outline"}
            size="sm"
            onClick={() => handleFilterChange(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="size-4 animate-spin" />
          Carregando alertas...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warnings.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="size-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhum alerta encontrado.</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              warnings.map((warning) => {
                const config = warningConfig[warning.type];
                const { date, time } = formatDateTime(warning.createdAt);

                return (
                  <Card key={warning.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <span className="text-sm text-muted-foreground">{date}, {time}</span>
                      </div>
                      <p className="font-semibold">{warning.message}</p>
                      {warning.client && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Cliente: {warning.client.name}
                        </p>
                      )}
                      <div className="flex flex-col items-stretch gap-2 mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/receipts/${warning.pixReceiptId}`}>
                            <Eye className="size-4" />
                            Ver Comprovante
                          </Link>
                        </Button>
                        <ResolveAlertDialog
                          trigger={<Button variant="outline" size="sm">Resolver</Button>}
                          onConfirm={(reason) => handleResolve(warning.id, reason)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
