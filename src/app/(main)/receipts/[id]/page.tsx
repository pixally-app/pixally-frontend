"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Pencil, X, Check, Loader2, AlertTriangle, OctagonAlert, ZoomIn, ZoomOut, RotateCcw, Trash2 } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, inputBaseClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ResolveWarningDialog } from "@/components/receipts/resolve-warning-dialog";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { toast } from "sonner";
import { getReceipt, updateReceipt, deleteReceipt, type Receipt, type ReceiptWarning } from "@/services/receipts";
import { ApiError } from "@/lib/api-error";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { receiptEditSchema, type ReceiptEditValues } from "@/schemas/receipt-edit";
import { ReconciliationCard } from "@/components/receipts/reconciliation-card";

const payerFields = [
  { key: "depositOriginName", label: "Nome" },
  { key: "depositOriginBank", label: "Banco" },
  { key: "depositOriginAgency", label: "Agência" },
  { key: "depositOriginAccount", label: "Conta" },
  { key: "depositOriginDocument", label: "CPF/CNPJ" },
] as const;

const receiverFields = [
  { key: "depositDestinationName", label: "Nome", mono: false },
  { key: "depositDestinationBank", label: "Banco", mono: false },
  { key: "depositDestinationDocument", label: "CPF/CNPJ", mono: false },
  { key: "depositDestinationAccount", label: "Conta/Chave PIX", mono: true },
] as const;

function toEditValues(receipt: Receipt | null): ReceiptEditValues {
  return {
    pixTransactionId: receipt?.pixTransactionId ?? "",
    depositOriginName: receipt?.depositOriginName ?? "",
    depositOriginBank: receipt?.depositOriginBank ?? "",
    depositOriginAgency: receipt?.depositOriginAgency ?? "",
    depositOriginAccount: receipt?.depositOriginAccount ?? "",
    depositOriginDocument: receipt?.depositOriginDocument ?? "",
    depositAmount: receipt?.depositAmount != null ? String(receipt.depositAmount) : "",
    depositDateTime: receipt?.depositDateTime ? receipt.depositDateTime.slice(0, 16) : "",
    description: receipt?.description ?? "",
    depositDestinationName: receipt?.depositDestinationName ?? "",
    depositDestinationBank: receipt?.depositDestinationBank ?? "",
    depositDestinationDocument: receipt?.depositDestinationDocument ?? "",
    depositDestinationAccount: receipt?.depositDestinationAccount ?? "",
  };
}

function EditableField({
  id,
  label,
  isEditing,
  displayValue,
  editSlot,
}: {
  id: string;
  label: string;
  isEditing: boolean;
  displayValue: React.ReactNode;
  editSlot: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {isEditing
        ? <Label htmlFor={id} className="text-sm text-muted-foreground font-normal shrink-0">{label}</Label>
        : <div className="text-sm text-muted-foreground">{label}</div>
      }
      {isEditing
        ? <div className="w-[60%] space-y-1">{editSlot}</div>
        : displayValue
      }
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
  const [saving, setSaving] = useState(false);
  const [resolvingWarningId, setResolvingWarningId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReceiptEditValues>({
    resolver: zodResolver(receiptEditSchema),
    defaultValues: toEditValues(null),
  });

  const fetchReceipt = useCallback(async () => {
    try {
      const data = await getReceipt(id);
      setReceipt(data);
      reset(toEditValues(data));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        toast.error(err instanceof Error ? err.message : "Erro ao carregar comprovante.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

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

  const analysing = receipt.status === "ANALYSING";
  const datetime = receipt.depositDateTime ? formatDateTime(receipt.depositDateTime) : null;
  const imageUrl = receipt.blob?.[0]?.fileUrl ?? null;
  const hasWarnings = receipt.warnings.length > 0;

  function handleCancelEdit() {
    reset(toEditValues(receipt!));
    setIsEditing(false);
  }

  async function handleSave(data: ReceiptEditValues) {
    try {
      setSaving(true);
      const updated = await updateReceipt(id, {
        pixTransactionId: data.pixTransactionId || null,
        depositOriginName: data.depositOriginName || null,
        depositOriginBank: data.depositOriginBank || null,
        depositOriginAgency: data.depositOriginAgency || null,
        depositOriginAccount: data.depositOriginAccount || null,
        depositOriginDocument: data.depositOriginDocument || null,
        depositAmount: data.depositAmount ? parseFloat(data.depositAmount) : null,
        depositDateTime: data.depositDateTime || null,
        description: data.description || null,
        depositDestinationName: data.depositDestinationName || null,
        depositDestinationBank: data.depositDestinationBank || null,
        depositDestinationDocument: data.depositDestinationDocument || null,
        depositDestinationAccount: data.depositDestinationAccount || null,
      });
      setReceipt(updated);
      reset(toEditValues(updated));
      setIsEditing(false);
      toast.success("Comprovante atualizado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
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
                      <div className="flex-1 rounded-lg bg-muted overflow-hidden cursor-grab active:cursor-grabbing min-h-[300px] touch-none">
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

          <ReconciliationCard receipt={receipt} onUpdate={setReceipt} />

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">Dados do Pagador</CardTitle>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={saving} onClick={handleCancelEdit}>
                    <X className="size-4" />
                    Cancelar
                  </Button>
                  <Button size="sm" disabled={saving} onClick={handleSubmit(handleSave)}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
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
                <EditableField
                  id="field-pixTransactionId"
                  label="ID da Transação"
                  isEditing={isEditing}
                  displayValue={
                    <div className="text-sm font-medium font-mono text-right max-w-[60%] break-all">
                      {receipt.pixTransactionId ?? (analysing ? <Skeleton className="h-4 w-40" /> : <span className="text-muted-foreground">-</span>)}
                    </div>
                  }
                  editSlot={
                    <>
                      <Input
                        id="field-pixTransactionId"
                        className="h-8 text-sm font-mono"
                        aria-invalid={!!errors.pixTransactionId}
                        aria-describedby={errors.pixTransactionId ? "error-pixTransactionId" : undefined}
                        {...register("pixTransactionId")}
                      />
                      <FormErrorMessage id="error-pixTransactionId" message={errors.pixTransactionId?.message} />
                    </>
                  }
                />

                {payerFields.map(({ key, label }) => (
                  <EditableField
                    key={key}
                    id={`field-${key}`}
                    label={label}
                    isEditing={isEditing}
                    displayValue={
                      <div className="text-sm font-medium">
                        {receipt[key] ?? (analysing ? <Skeleton className="h-4 w-32" /> : <span className="text-muted-foreground">-</span>)}
                      </div>
                    }
                    editSlot={
                      <>
                        <Input
                          id={`field-${key}`}
                          className="h-8 text-sm"
                          aria-invalid={!!errors[key]}
                          aria-describedby={errors[key] ? `error-${key}` : undefined}
                          {...register(key)}
                        />
                        <FormErrorMessage id={`error-${key}`} message={errors[key]?.message} />
                      </>
                    }
                  />
                ))}

                <EditableField
                  id="field-depositAmount"
                  label="Valor"
                  isEditing={isEditing}
                  displayValue={
                    <div className="text-sm font-semibold text-success">
                      {receipt.depositAmount != null
                        ? formatCurrency(receipt.depositAmount)
                        : analysing ? <Skeleton className="h-4 w-20" /> : <span className="text-muted-foreground font-normal">-</span>
                      }
                    </div>
                  }
                  editSlot={
                    <>
                      <CurrencyInput
                        id="field-depositAmount"
                        placeholder="R$ 0,00"
                        intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                        decimalsLimit={2}
                        value={watch("depositAmount")}
                        onValueChange={(_val, _name, values) =>
                          setValue("depositAmount", values?.float?.toString() ?? "", { shouldValidate: true })
                        }
                        aria-invalid={!!errors.depositAmount}
                        aria-describedby={errors.depositAmount ? "error-depositAmount" : undefined}
                        className={inputBaseClasses + " h-8 text-sm"}
                      />
                      <FormErrorMessage id="error-depositAmount" message={errors.depositAmount?.message} />
                    </>
                  }
                />

                <EditableField
                  id="field-depositDateTime"
                  label="Data e Hora"
                  isEditing={isEditing}
                  displayValue={
                    <div className="text-sm font-medium">
                      {datetime
                        ? `${datetime.date}, ${datetime.time}`
                        : analysing ? <Skeleton className="h-4 w-32" /> : <span className="text-muted-foreground">-</span>
                      }
                    </div>
                  }
                  editSlot={
                    <>
                      <Input
                        id="field-depositDateTime"
                        type="datetime-local"
                        className="h-8 text-sm"
                        aria-invalid={!!errors.depositDateTime}
                        aria-describedby={errors.depositDateTime ? "error-depositDateTime" : undefined}
                        {...register("depositDateTime")}
                      />
                      <FormErrorMessage id="error-depositDateTime" message={errors.depositDateTime?.message} />
                    </>
                  }
                />

                <EditableField
                  id="field-description"
                  label="Descrição"
                  isEditing={isEditing}
                  displayValue={
                    <div className="text-sm font-medium text-right max-w-[60%]">
                      {receipt.description ?? (analysing ? <Skeleton className="h-4 w-40" /> : <span className="text-muted-foreground">-</span>)}
                    </div>
                  }
                  editSlot={
                    <>
                      <Input
                        id="field-description"
                        className="h-8 text-sm"
                        aria-invalid={!!errors.description}
                        aria-describedby={errors.description ? "error-description" : undefined}
                        {...register("description")}
                      />
                      <FormErrorMessage id="error-description" message={errors.description?.message} />
                    </>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Dados do Recebedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receiverFields.map(({ key, label, mono }) => (
                  <EditableField
                    key={key}
                    id={`field-${key}`}
                    label={label}
                    isEditing={isEditing}
                    displayValue={
                      <div className={`text-sm font-medium text-right max-w-[60%] break-all${mono ? " font-mono" : ""}`}>
                        {receipt[key] ?? (analysing ? <Skeleton className="h-4 w-32" /> : <span className="text-muted-foreground">-</span>)}
                      </div>
                    }
                    editSlot={
                      <>
                        <Input
                          id={`field-${key}`}
                          className={`h-8 text-sm${mono ? " font-mono" : ""}`}
                          aria-invalid={!!errors[key]}
                          aria-describedby={errors[key] ? `error-${key}` : undefined}
                          {...register(key)}
                        />
                        <FormErrorMessage id={`error-${key}`} message={errors[key]?.message} />
                      </>
                    }
                  />
                ))}
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
