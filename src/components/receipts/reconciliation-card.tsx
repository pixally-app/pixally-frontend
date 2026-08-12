"use client";

import { useState, useEffect } from "react";
import { Loader2, Link, Unlink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { reconcileReceipt, unreconcileReceipt, updateReceipt, type Receipt } from "@/services/receipts";
import { listClients, type Client } from "@/services/clients";
import { listReceivables, type AccountReceivable } from "@/services/receivables";
import { formatCurrency } from "@/lib/formatters";

interface ReconciliationCardProps {
  receipt: Receipt;
  onUpdate: (updated: Receipt) => void;
}

export function ReconciliationCard({ receipt, onUpdate: _onUpdate }: ReconciliationCardProps) {
  const isReconciled = receipt.status === "RECONCILED" || receipt.clientId !== null;
  const linkedReceivable = receipt.accountReceivable ?? null;

  const [mode, setMode] = useState<"view" | "linking">("view");
  const [clients, setClients] = useState<Client[]>([]);
  const [receivables, setReceivables] = useState<AccountReceivable[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedReceivableId, setSelectedReceivableId] = useState("");
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingReceivables, setLoadingReceivables] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    if (mode !== "linking") return;
    setLoadingClients(true);
    listClients({ limit: 100 })
      .then((res) => setClients(res.data))
      .catch(() => toast.error("Erro ao carregar clientes."))
      .finally(() => setLoadingClients(false));
  }, [mode]);

  useEffect(() => {
    if (!selectedClientId) {
      setReceivables([]);
      setSelectedReceivableId("");
      return;
    }
    setLoadingReceivables(true);
    listReceivables({ clientId: selectedClientId, limit: 100 })
      .then((res) => setReceivables(res.data.filter((r) => r.status !== "PAID" && r.status !== "CANCELLED")))
      .catch(() => toast.error("Erro ao carregar contas a receber."))
      .finally(() => setLoadingReceivables(false));
  }, [selectedClientId]);

  function handleStartEdit() {
    setSelectedClientId(receipt.clientId ?? "");
    setSelectedReceivableId("");
    setMode("linking");
  }

  function handleCancelLinking() {
    setMode("view");
    setSelectedClientId("");
    setSelectedReceivableId("");
    setReceivables([]);
  }

  async function handleReconcile() {
    try {
      setSaving(true);
      let updated: Receipt;
      if (selectedReceivableId) {
        updated = await reconcileReceipt(receipt.id, selectedReceivableId);
        toast.success("Comprovante conciliado com sucesso.");
      } else {
        updated = await updateReceipt(receipt.id, { clientId: selectedClientId });
        toast.success("Cliente vinculado com sucesso.");
      }
      _onUpdate(updated);
      setMode("view");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao conciliar comprovante.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUnreconcile() {
    try {
      setUnlinking(true);
      const updated = await unreconcileReceipt(receipt.id);
      _onUpdate(updated);
      toast.success("Comprovante desvinculado. Conta voltou a pendente.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao desvincular comprovante.");
    } finally {
      setUnlinking(false);
    }
  }

  if (mode === "linking") {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-bold">Conciliação</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={saving} onClick={handleCancelLinking}>
              Cancelar
            </Button>
            <Button size="sm" disabled={saving || !selectedClientId} onClick={handleReconcile}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Link className="size-4" />}
              Conciliar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="reconcile-client">Cliente</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId} disabled={loadingClients}>
                <SelectTrigger id="reconcile-client">
                  <SelectValue placeholder={loadingClients ? "Carregando..." : "Selecione o cliente"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reconcile-receivable">Conta a receber (opcional)</Label>
              <Select
                value={selectedReceivableId}
                onValueChange={setSelectedReceivableId}
                disabled={!selectedClientId || loadingReceivables}
              >
                <SelectTrigger id="reconcile-receivable">
                  <SelectValue placeholder={
                    !selectedClientId
                      ? "Selecione um cliente primeiro"
                      : loadingReceivables
                        ? "Carregando..."
                        : receivables.length === 0
                          ? "Nenhuma conta pendente"
                          : "Selecione a conta a receber"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {receivables.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.serviceName ?? "Sem nome"} — {formatCurrency(r.totalAmount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isReconciled) {
    const isAuto = linkedReceivable?.matchedAutomatically === true;
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-bold">Conciliação</CardTitle>
          <Badge variant={isAuto ? "success" : "secondary"}>
            {isAuto ? "Automático" : "Manual"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Cliente</div>
              <div className="text-sm font-medium">{receipt.client?.name ?? "-"}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Conta a receber</div>
              <div className="text-sm font-medium text-right max-w-[60%]">
                {linkedReceivable
                  ? `${linkedReceivable.serviceName ?? "Sem nome"} — ${formatCurrency(linkedReceivable.totalAmount)}`
                  : <span className="text-muted-foreground">-</span>
                }
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={handleStartEdit}>
                Editar
              </Button>
              <Button variant="destructive" size="sm" className="flex-1" disabled={unlinking} onClick={handleUnreconcile}>
                {unlinking ? <Loader2 className="size-4 animate-spin" /> : <Unlink className="size-4" />}
                Desvincular
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (

    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold">Conciliação</CardTitle>
      </CardHeader>
      <CardContent>
        <Button size="sm" className="w-full" onClick={() => setMode("linking")}>
          <Link className="size-4" />
          Conciliar
        </Button>
      </CardContent>
    </Card>
  );
}
