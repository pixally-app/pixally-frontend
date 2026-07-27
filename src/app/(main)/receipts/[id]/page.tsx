"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, X, Check, Loader2, AlertTriangle, OctagonAlert, ZoomIn, ZoomOut, RotateCcw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ResolveWarningDialog } from "@/components/receipts/resolve-warning-dialog";
import { toast } from "sonner";
import { getReceipt, deleteReceipt, type Receipt, type ReceiptWarning } from "@/services/receipts";
import { statusConfig } from "@/components/receipts/status-config";
import { ApiError } from "@/lib/api-error";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function Field({label, value, analysing, mono = false }: {
  label: string;
  value: string | null | undefined;
  analysing: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-sm font-medium text-right max-w-[60%] break-all ${mono ? "font-mono" : ""}`}>
        {value != null
          ? value
          : analysing
            ? <Skeleton className="h-4 w-32" />
            : <span className="text-muted-foreground">-</span>
        }
      </div>
    </div>
  );
  
}

function WarningItem({ warning, onResolve }: { warning: ReceiptWarning; onResolve?: () => void }) {
  const isRed = warning.type === "red";
  const Icon = isRed ? AlertTriangle : OctagonAlert;
  const colorClass = isRed ? "text-destructive" : "text-warning";
  const bgClass = isRed ? "bg-destructive/10 border-destructive/20" : "bg-warning/10 border-warning/20";

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${bgClass}`}>
      <Icon className={`size-4 mt-0.5 shrink-0 ${colorClass}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold uppercase mb-0.5 ${colorClass}`}>
          {isRed ? "Alerta Vermelho" : "Alerta Amarelo"}
        </p>
        <p className="text-sm text-foreground">{warning.message}</p>
        {warning.resolved && warning.resolutionReason && (
          <p className="text-xs text-muted-foreground mt-1">
            Resolvido: {warning.resolutionReason}
          </p>
        )}
      </div>
      {!warning.resolved && onResolve && (
        <Button variant="outline" size="sm" className="shrink-0 bg-background" onClick={onResolve}>
          Resolver
        </Button>
      )}
    </div>
  );
}

export default function ReceiptDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resolvingWarningId, setResolvingWarningId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [payerData, setPayerData] = useState({
    depositOriginName: "",
    depositOriginAgency: "",
    depositOriginAccount: "",
    depositOriginDocument: "",
    depositOriginBank: "",
    description: "",
  });

  const fetchReceipt = useCallback(async () => {
    try {
      const data = await getReceipt(id);
      setReceipt(data);
      setPayerData({
        depositOriginName: data.depositOriginName ?? "",
        depositOriginAgency: data.depositOriginAgency ?? "",
        depositOriginAccount: data.depositOriginAccount ?? "",
        depositOriginDocument: data.depositOriginDocument ?? "",
        depositOriginBank: data.depositOriginBank ?? "",
        description: data.description ?? "",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        toast.error(err instanceof Error ? err.message : "Erro ao carregar comprovante.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReceipt();
  }, [fetchReceipt]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/receipts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="size-4 animate-spin" />
          Carregando...
        </div>
      </div>
    );
  }

  if (notFound || !receipt) {
    return (
      <div className="space-y-6">
        <Link href="/receipts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Comprovante não encontrado</h1>
      </div>
    );
  }

  const status = statusConfig[receipt.status] ?? {
    label: receipt.status,
    variant: "secondary" as const,
    bgColor: "bg-muted",
    textClass: "text-muted-foreground",
    badgeClass: "",
  };
  const analysing = receipt.status === "ANALYSING";
  const datetime = receipt.depositDateTime ? formatDateTime(receipt.depositDateTime) : null;
  const imageUrl = receipt.blob?.[0]?.fileUrl ?? null;
  const hasWarnings = receipt.warnings?.length > 0;

  function handleCancelEdit() {
    setPayerData({
      depositOriginName: receipt!.depositOriginName ?? "",
      depositOriginAgency: receipt!.depositOriginAgency ?? "",
      depositOriginAccount: receipt!.depositOriginAccount ?? "",
      depositOriginDocument: receipt!.depositOriginDocument ?? "",
      depositOriginBank: receipt!.depositOriginBank ?? "",
      description: receipt!.description ?? "",
    });
    setIsEditing(false);
  }

  function handleSave() {
    toast.info("Edição será habilitada em breve.");
    setIsEditing(false);
  }

  function handleResolveWarning(reason: string) {
    if (!resolvingWarningId || !receipt) return;
    setReceipt({
      ...receipt,
      warnings: receipt.warnings.map((w) =>
        w.id === resolvingWarningId
          ? { ...w, resolved: true, resolutionReason: reason, resolvedAt: new Date().toISOString() }
          : w
      ),
    });
    setResolvingWarningId(null);
    toast.success("Alerta resolvido com sucesso.");
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteReceipt(id);
      toast.success("Comprovante excluído.");
      router.push("/receipts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir comprovante.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/receipts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Comprovante</h1>
            {receipt.pixTransactionId && (
              <p className="text-sm text-muted-foreground font-mono">
                {receipt.pixTransactionId}
              </p>
            )}
          </div>
          {!analysing && (
            <ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm" disabled={deleting}>
                  {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  Excluir
                </Button>
              }
              title="Excluir comprovante"
              description="Essa ação não pode ser desfeita. O comprovante será removido permanentemente."
              confirmLabel="Excluir"
              icon={<Trash2 className="size-4" />}
              onConfirm={handleDelete}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Imagem do Comprovante</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {imageUrl ? (
                <TransformWrapper initialScale={1} minScale={0.5} maxScale={4} wheel={{ step: 0.1 }}>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <div className="flex flex-col flex-1 gap-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => zoomIn()}>
                          <ZoomIn className="size-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => zoomOut()}>
                          <ZoomOut className="size-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => resetTransform()}>
                          <RotateCcw className="size-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground">Scroll para zoom · Arraste para mover</span>
                      </div>
                      <div className="flex-1 rounded-lg bg-muted overflow-hidden cursor-grab active:cursor-grabbing min-h-[300px]">
                        <TransformComponent
                          wrapperStyle={{ width: "100%", height: "100%" }}
                          contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <img
                            src={imageUrl}
                            alt="Comprovante PIX"
                            className="max-h-full max-w-full object-contain select-none"
                            draggable={false}
                          />
                        </TransformComponent>
                      </div>
                    </div>
                  )}
                </TransformWrapper>
              ) : (
                <div className="flex-1 flex items-center justify-center rounded-lg bg-muted min-h-[300px]">
                  <p className="text-sm text-muted-foreground">
                    {analysing ? "Processando imagem..." : "Imagem não disponível"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {hasWarnings && (
            <div className="space-y-3">
              {receipt.warnings.map((warning) => (
                <WarningItem
                  key={warning.id}
                  warning={warning}
                  onResolve={() => setResolvingWarningId(warning.id)}
                />
              ))}
            </div>
          )}

          {receipt.client && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Cliente vinculado</p>
                <p className="font-semibold">{receipt.client.name}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">Dados do Pagador</CardTitle>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="size-4" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Check className="size-4" />
                    Salvar
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="size-4" />
                  Editar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(["depositOriginName", "depositOriginBank", "depositOriginAgency", "depositOriginAccount", "depositOriginDocument"] as const).map((field) => {
                  const labels: Record<string, string> = {
                    depositOriginName: "Nome",
                    depositOriginBank: "Banco",
                    depositOriginAgency: "Agência",
                    depositOriginAccount: "Conta",
                    depositOriginDocument: "CPF/CNPJ",
                  };
                  return (
                    <div key={field} className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">{labels[field]}</div>
                      {isEditing ? (
                        <Input
                          aria-label={labels[field]}
                          className="w-[60%] h-8 text-sm"
                          value={payerData[field]}
                          onChange={(e) => setPayerData({ ...payerData, [field]: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm font-medium">
                          {receipt[field] != null
                            ? receipt[field]
                            : analysing
                              ? <Skeleton className="h-4 w-32" />
                              : <span className="text-muted-foreground">-</span>
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Valor</div>
                  <div className="text-sm font-semibold text-success">
                    {receipt.depositAmount != null
                      ? formatCurrency(receipt.depositAmount)
                      : analysing
                        ? <Skeleton className="h-4 w-20" />
                        : <span className="text-muted-foreground">-</span>
                    }
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Data e Hora</div>
                  <div className="text-sm font-medium">
                    {datetime
                      ? `${datetime.date}, ${datetime.time}`
                      : analysing
                        ? <Skeleton className="h-4 w-32" />
                        : <span className="text-muted-foreground">-</span>
                    }
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Descrição</div>
                  {isEditing ? (
                    <Input
                      aria-label="Descrição"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.description}
                      onChange={(e) => setPayerData({ ...payerData, description: e.target.value })}
                    />
                  ) : (
                    <div className="text-sm font-medium text-right max-w-[60%]">
                      {receipt.description != null
                        ? receipt.description
                        : analysing
                          ? <Skeleton className="h-4 w-40" />
                          : <span className="text-muted-foreground">-</span>
                      }
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Dados do Recebedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Field label="Nome" value={receipt.depositDestinationName} analysing={analysing} />
                <Field label="Banco" value={receipt.depositDestinationBank} analysing={analysing} />
                <Field label="CPF/CNPJ" value={receipt.depositDestinationDocument} analysing={analysing} />
                <Field label="Conta/Chave PIX" value={receipt.depositDestinationAccount} analysing={analysing} mono />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ResolveWarningDialog
        open={resolvingWarningId !== null}
        onOpenChange={(open) => { if (!open) setResolvingWarningId(null); }}
        onConfirm={handleResolveWarning}
      />
    </div>
  );
}
