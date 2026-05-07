"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receivableSchema, type ReceivableFormValues } from "@/schemas/receivable";
import { Input } from "@/components/ui/input";
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
import { clients } from "@/data/mock-clients";

export type ReceivableFormData = Omit<ReceivableFormValues, "isInstallment">;

interface ReceivableFormDialogProps {
  trigger: React.ReactNode;
  onSubmit: (data: ReceivableFormData) => void;
}

export function ReceivableFormDialog({
  trigger,
  onSubmit,
}: ReceivableFormDialogProps) {
  const [open, setOpen] = useState(false);

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

  const amountNumber = parseFloat((amount || "").replace(/\./g, "").replace(",", ".")) || 0;
  const installmentValue =
    isInstallment && installments > 1 ? amountNumber / installments : 0;

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      reset();
    }
  }

  function onFormSubmit(data: ReceivableFormValues) {
    onSubmit({
      serviceName: data.serviceName,
      description: data.description ?? "",
      clientId: data.clientId,
      amount: data.amount,
      installments: data.isInstallment ? data.installments : 1,
      dueDate: data.dueDate,
    });
    setOpen(false);
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
              {errors.serviceName && (
                <p id="receivable-service-error" className="text-sm text-destructive">{errors.serviceName.message}</p>
              )}
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
              {errors.clientId && (
                <p id="receivable-client-error" className="text-sm text-destructive">{errors.clientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-amount">Valor Total (R$)</Label>
              <Input
                id="receivable-amount"
                placeholder="0,00"
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "receivable-amount-error" : undefined}
                {...register("amount")}
              />
              {errors.amount && (
                <p id="receivable-amount-error" className="text-sm text-destructive">{errors.amount.message}</p>
              )}
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
              {errors.dueDate && (
                <p id="receivable-dueDate-error" className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
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
                {errors.installments && (
                  <p id="receivable-installments-error" className="text-sm text-destructive">{errors.installments.message}</p>
                )}
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
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
