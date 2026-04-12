"use client";

import { useState, useMemo } from "react";
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
import {
  Search,
  Download,
  MessageCircle,
  ArrowUpFromLine,
  Eye,
} from "lucide-react";
import Link from "next/link";

type ReceiptStatus = "conciliado" | "problema" | "alerta" | "recebido" | "analisando";
type ReceiptSource = "whatsapp" | "manual";

interface Receipt {
  id: string;
  date: string;
  time: string;
  clientName: string;
  clientBank: string;
  amount: string;
  status: ReceiptStatus;
  source: ReceiptSource;
}

const statusConfig: Record<ReceiptStatus, { label: string; variant: "success" | "destructive" | "warning" | "default" | "secondary" }> = {
  conciliado: { label: "Conciliado", variant: "success" },
  problema: { label: "Problema", variant: "destructive" },
  alerta: { label: "Alerta", variant: "warning" },
  recebido: { label: "Recebido", variant: "success" },
  analisando: { label: "Analisando", variant: "secondary" },
};

const receipts: Receipt[] = [
  { id: "1", date: "26/02/2026", time: "14:30", clientName: "João Silva", clientBank: "Nubank", amount: "R$ 150.00", status: "conciliado", source: "whatsapp" },
  { id: "2", date: "26/02/2026", time: "15:45", clientName: "Maria Santos", clientBank: "Inter", amount: "R$ 200.50", status: "conciliado", source: "whatsapp" },
  { id: "3", date: "26/02/2026", time: "16:20", clientName: "Pedro Costa", clientBank: "Nubank", amount: "R$ 150.00", status: "problema", source: "whatsapp" },
  { id: "4", date: "26/02/2026", time: "17:10", clientName: "Ana Paula Oliveira", clientBank: "Itaú", amount: "R$ 320.00", status: "conciliado", source: "whatsapp" },
  { id: "5", date: "26/02/2026", time: "18:00", clientName: "Carlos Mendes", clientBank: "Banco do Brasil", amount: "R$ 100.00", status: "alerta", source: "whatsapp" },
  { id: "6", date: "25/02/2026", time: "10:30", clientName: "Juliana Ferreira", clientBank: "PicPay", amount: "R$ 180.00", status: "recebido", source: "manual" },
  { id: "7", date: "25/02/2026", time: "14:20", clientName: "Roberto Alves", clientBank: "Santander", amount: "R$ 250.00", status: "recebido", source: "whatsapp" },
  { id: "8", date: "24/02/2026", time: "09:15", clientName: "Fernanda Lima", clientBank: "Nubank", amount: "R$ 150.00", status: "analisando", source: "whatsapp" },
  { id: "9", date: "24/02/2026", time: "11:40", clientName: "Lucas Rodrigues", clientBank: "C6 Bank", amount: "R$ 450.00", status: "recebido", source: "manual" },
  { id: "10", date: "23/02/2026", time: "16:30", clientName: "Mariana Castro", clientBank: "Inter", amount: "R$ 200.00", status: "alerta", source: "whatsapp" },
];

const sourceIcon = {
  whatsapp: <MessageCircle className="size-4" />,
  manual: <ArrowUpFromLine className="size-4" />,
};

const sourceLabel = {
  whatsapp: "WhatsApp",
  manual: "Manual",
};

export default function ReceiptsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return receipts.filter((r) => {
      const matchesSearch =
        !search ||
        r.clientName.toLowerCase().includes(search.toLowerCase()) ||
        r.amount.includes(search);

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesSource = sourceFilter === "all" || r.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [search, statusFilter, sourceFilter]);

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
                placeholder="Buscar por cliente ou valor..."
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
                  <SelectItem value="conciliado">Conciliado</SelectItem>
                  <SelectItem value="recebido">Recebido</SelectItem>
                  <SelectItem value="analisando">Analisando</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                  <SelectItem value="problema">Problema</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
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

          <p className="text-sm text-muted-foreground mt-4">
            {filtered.length} comprovante(s) encontrado(s)
          </p>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((receipt) => {
              const status = statusConfig[receipt.status];
              return (
                <TableRow key={receipt.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{receipt.date}</p>
                      <p className="text-sm text-muted-foreground">{receipt.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{receipt.clientName}</p>
                      <p className="text-sm text-muted-foreground">{receipt.clientBank}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-success">{receipt.amount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {sourceIcon[receipt.source]}
                      <span className="text-sm">{sourceLabel[receipt.source]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/receipts/${receipt.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Eye className="size-4" />
                      Ver
                    </Link>
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
