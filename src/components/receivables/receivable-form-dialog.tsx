"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receivableSchema, type ReceivableFormValues } from "@/schemas/receivable";
import { Input, inputBaseClasses } from "@/components/ui/input";
import CurrencyInput from "react-currency-input-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { listClients, type Client } from "@/services/clients";

export type ReceivableFormData = Omit<ReceivableFormValues, "isInstallment">;

interface ReceivableFormDialogProps {
  trigger: React.ReactNode;
  onSubmit: (data: ReceivableFormData) => Promise<void>;
}

export function ReceivableFormDialog({
  trigger,
  onSubmit,
}: ReceivableFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (open) {
      listClients({ limit: 100 }).then((res) => setClients(res.data)).catch(() => {});
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReceivableFormValues>({
    resolver: zodResolver(receivableSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      clientId: "",
      amount: "",
      dueDate: "",
      isInstallment: false,
      installments: 1,
    },
  });

  const isInstallment = watch("isInstallment");
  const amount = watch("amount");
  const installments = watch("installments");

  const amountNumber = parseFloat((amount || "0").replace(/\./g, "").replace(",", ".")) || 0;
  const installmentValue =
    isInstallment && installments > 1 ? amountNumber / installments : 0;

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      reset();
    }
  }

  async function onFormSubmit(data: ReceivableFormValues) {
    try {
      setSubmitting(true);
      await onSubmit({
        serviceName: data.serviceName,
        description: data.description ?? "",
        clientId: data.clientId,
        amount: data.amount,
        installments: data.isInstallment ? data.installments : 1,
        dueDate: data.dueDate,
      });
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conta a Receber</DialogTitle>
          <DialogDescription>
            Preencha os dados do serviço realizado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="receivable-service">Nome do Serviço</Label>
              <Input
                id="receivable-service"
                placeholder="Ex: Manutenção ar condicionado"
                aria-invalid={!!errors.serviceName}
                aria-describedby={errors.serviceName ? "receivable-service-error" : undefined}
                {...register("serviceName")}
              />
              <FormErrorMessage id="receivable-service-error" message={errors.serviceName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-description">Descrição</Label>
              <Textarea
                id="receivable-description"
                placeholder="Detalhes do serviço realizado"
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={watch("clientId")}
                onValueChange={(value) => setValue("clientId", value, { shouldValidate: true })}
              >
                <SelectTrigger
                  aria-invalid={!!errors.clientId}
                  aria-describedby={errors.clientId ? "receivable-client-error" : undefined}
                >
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormErrorMessage id="receivable-client-error" message={errors.clientId?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-amount">Valor Total (R$)</Label>
              <CurrencyInput
                id="receivable-amount"
                placeholder="R$ 0,00"
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                decimalsLimit={2}
                value={amount}
                onValueChange={(val) =>
                  setValue("amount", val ?? "", { shouldValidate: true })
                }
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "receivable-amount-error" : undefined}
                className={inputBaseClasses}
              />
              <FormErrorMessage id="receivable-amount-error" message={errors.amount?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-dueDate">Vencimento</Label>
              <Input
                id="receivable-dueDate"
                type="date"
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "receivable-dueDate-error" : undefined}
                {...register("dueDate")}
              />
              <FormErrorMessage id="receivable-dueDate-error" message={errors.dueDate?.message} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="receivable-installment"
                checked={isInstallment}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setValue("isInstallment", isChecked, { shouldValidate: true });
                  if (!isChecked) {
                    setValue("installments", 1, { shouldValidate: true });
                  }
                }}
              />
              <Label htmlFor="receivable-installment" className="cursor-pointer">
                Parcelado
              </Label>
            </div>

            {isInstallment && (
              <div className="space-y-2">
                <Label htmlFor="receivable-installments">
                  Quantidade de Parcelas
                </Label>
                <Input
                  id="receivable-installments"
                  type="number"
                  min={2}
                  placeholder="2"
                  value={installments > 1 ? installments : ""}
                  aria-invalid={!!errors.installments}
                  aria-describedby={errors.installments ? "receivable-installments-error" : undefined}
                  onChange={(e) =>
                    setValue("installments", parseInt(e.target.value) || 2, { shouldValidate: true })
                  }
                />
                <FormErrorMessage id="receivable-installments-error" message={errors.installments?.message} />
                {installmentValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {installments}x de{" "}
                    <span className="font-medium text-foreground">
                      {installmentValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
