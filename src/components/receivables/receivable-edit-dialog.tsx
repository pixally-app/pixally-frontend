
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, inputBaseClasses } from "@/components/ui/input";
import CurrencyInput from "react-currency-input-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { type AccountReceivable } from "@/services/receivables";

const editSchema = z.object({
  serviceName: z.string().min(1, "Nome do serviço é obrigatório"),
  serviceDescription: z.string().optional(),
  totalAmount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (val) => /^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(val.trim()),
      { message: "Formato de valor inválido" }
    )
    .refine(
      (val) => {
        const num = parseFloat(val.trim().replace(/\./g, "").replace(",", "."));
        return !isNaN(num) && num > 0;
      },
      { message: "Valor deve ser maior que zero" }
    ),
  dueDate: z.string().min(1, "Vencimento é obrigatório"),
});

type EditFormValues = z.infer<typeof editSchema>;

interface ReceivableEditDialogProps {
  receivable: AccountReceivable;
  onSubmit: (data: { serviceName: string; serviceDescription?: string; totalAmount: number; dueDate: string }) => Promise<void>;
}

export function ReceivableEditDialog({ receivable, onSubmit }: ReceivableEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        serviceName: receivable.serviceName ?? "",
        serviceDescription: receivable.serviceDescription ?? "",
        totalAmount: receivable.totalAmount.toString(),
        dueDate: receivable.dueDate.split("T")[0],
      });
    }
  }, [open, receivable, reset]);

  async function onFormSubmit(data: EditFormValues) {
    try {
      setSubmitting(true);
      const totalAmount = parseFloat(data.totalAmount);
      await onSubmit({
        serviceName: data.serviceName,
        serviceDescription: data.serviceDescription || undefined,
        totalAmount,
        dueDate: data.dueDate,
      });
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil className="size-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Conta a Receber</DialogTitle>
          <DialogDescription>Atualize os dados da conta a receber.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-serviceName">Nome do Serviço</Label>
              <Input
                id="edit-serviceName"
                placeholder="Ex: Manutenção ar condicionado"
                aria-invalid={!!errors.serviceName}
                aria-describedby={errors.serviceName ? "edit-serviceName-error" : undefined}
                {...register("serviceName")}
              />
              <FormErrorMessage id="edit-serviceName-error" message={errors.serviceName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                placeholder="Detalhes do serviço realizado"
                {...register("serviceDescription")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Valor Total (R$)</Label>
              <CurrencyInput
                id="edit-amount"
                placeholder="R$ 0,00"
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                decimalsLimit={2}
                value={watch("totalAmount")}
                onValueChange={(_val, _name, values) =>
                  setValue("totalAmount", values?.float?.toString() ?? "", { shouldValidate: true })
                }
                aria-invalid={!!errors.totalAmount}
                aria-describedby={errors.totalAmount ? "edit-amount-error" : undefined}
                className={inputBaseClasses}
              />
              <FormErrorMessage id="edit-amount-error" message={errors.totalAmount?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Vencimento</Label>
              <Input
                id="edit-dueDate"
                type="date"
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "edit-dueDate-error" : undefined}
                {...register("dueDate")}
              />
              <FormErrorMessage id="edit-dueDate-error" message={errors.dueDate?.message} />
            </div>
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
