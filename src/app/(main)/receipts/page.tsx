"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Download, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { listReceipts, type Receipt, type ReceiptStatus, type ReceiptOrigin } from "@/services/receipts";
import { statusConfig, originConfig } from "@/components/receipts/status-config";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

export default function ReceiptsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchReceipts = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const params: Parameters<typeof listReceipts>[0] = { limit: 100 };
      if (statusFilter !== "all") params.status = statusFilter as ReceiptStatus;
      if (originFilter !== "all") params.origin = originFilter as ReceiptOrigin;
      if (debouncedSearch) params.clientName = debouncedSearch;
      const response = await listReceipts(params);
      setReceipts(response.data);
      setTotal(response.total);
    } catch (err) {
      if (!silent) toast.error(err instanceof Error ? err.message : "Erro ao carregar comprovantes.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [debouncedSearch, statusFilter, originFilter]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const hasAnalysing = receipts.some((r) => r.status === "ANALYSING");

  useEffect(() => {
    const interval = setInterval(() => fetchReceipts(true), hasAnalysing ? 3000 : 5000);
    return () => clearInterval(interval);
  }, [hasAnalysing, fetchReceipts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comprovantes</h1>
        <p className="text-muted-foreground">
          Listagem completa de todos os comprovantes processados
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente"
                aria-label="Buscar por cliente"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="RECONCILED">Conciliado</SelectItem>
                  <SelectItem value="RECEIVED">Recebido</SelectItem>
                  <SelectItem value="ANALYSING">Analisando</SelectItem>
                  <SelectItem value="YELLOW_FLAG">Alerta</SelectItem>
                  <SelectItem value="RED_FLAG">Alerta Vermelho</SelectItem>
                  <SelectItem value="ERROR">Erro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>

              <Button className="ml-auto sm:ml-0">
                <Download className="size-4" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {!loading && (
            <p className="text-sm text-muted-foreground mt-4">
              {total} comprovante(s) encontrado(s)
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Remetente</TableHead>
              <TableHead className="hidden md:table-cell">Banco</TableHead>
              <TableHead className="hidden md:table-cell">Conta</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="hidden sm:table-cell">Origem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground text-sm">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : receipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="size-8" />
                    <p className="text-sm">Nenhum comprovante encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              receipts.map((receipt) => {
                const status = statusConfig[receipt.status] ?? { label: receipt.status, variant: "secondary" as const };
                const analysing = receipt.status === "ANALYSING";
                const datetime = receipt.depositDateTime ? formatDateTime(receipt.depositDateTime) : null;
                return (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      {datetime ? (
                        <div>
                          <p className="font-medium">{datetime.date}</p>
                          <p className="text-sm text-muted-foreground">{datetime.time}</p>
                        </div>
                      ) : analysing ? (
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {receipt.client?.name ? (
                        <span className="font-medium">{receipt.client.name}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {receipt.depositOriginName ? (
                        <span className="text-sm">{receipt.depositOriginName}</span>
                      ) : analysing ? (
                        <Skeleton className="h-4 w-28" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {receipt.depositOriginBank ? (
                        <span className="text-sm">{receipt.depositOriginBank}</span>
                      ) : analysing ? (
                        <Skeleton className="h-4 w-24" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {receipt.depositOriginAccount ? (
                        <span className="text-sm font-mono">{receipt.depositOriginAccount}</span>
                      ) : analysing ? (
                        <Skeleton className="h-4 w-24" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {receipt.depositAmount != null ? (
                        <span className="font-semibold text-success">{formatCurrency(receipt.depositAmount)}</span>
                      ) : analysing ? (
                        <Skeleton className="h-4 w-20" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{originConfig[receipt.origin].label}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.badgeClass}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/receipts/${receipt.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        <Eye className="size-4" />
                      </Link>
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
