"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, inputBaseClasses } from "@/components/ui/input";
import CurrencyInput from "react-currency-input-field";
import { Label } from "@/components/ui/label";
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
import { updateInstallment, type Installment } from "@/services/receivables";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const installmentEditSchema = z.object({
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val.trim()),
      { message: "Formato de valor inválido" }
    )
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Valor deve ser maior que zero" }
    ),
  dueDate: z.string().optional(),
});

type InstallmentEditValues = z.infer<typeof installmentEditSchema>;

interface InstallmentEditDialogProps {
  installment: Installment;
  totalCount: number;
  accountReceivableId: string;
  onUpdate: () => Promise<void>;
}

export function InstallmentEditDialog({
  installment,
  totalCount,
  accountReceivableId,
  onUpdate,
}: InstallmentEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InstallmentEditValues>({
    resolver: zodResolver(installmentEditSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        amount: installment.amount.toString(),
        dueDate: installment.dueDate.split("T")[0],
      });
    }
  }, [open, installment, reset]);

  async function onFormSubmit(data: InstallmentEditValues) {
    try {
      setSubmitting(true);
      await updateInstallment(accountReceivableId, installment.id, {
        amount: data.amount ? parseFloat(data.amount) : undefined,
        dueDate: data.dueDate || undefined,
      });
      await onUpdate();
      toast.success("Parcela atualizada com sucesso!");
      setOpen(false);
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Erro ao atualizar parcela"
        : "Erro ao atualizar parcela";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Pencil className="size-3.5" />
          <span className="sr-only">Editar parcela</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Editar Parcela {installment.installmentNumber}/{totalCount}
          </DialogTitle>
          <DialogDescription>
            Altere o valor ou o vencimento desta parcela. Se o valor for alterado, o restante será redistribuído entre as parcelas não pagas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="inst-amount">Valor (R$)</Label>
              <CurrencyInput
                id="inst-amount"
                placeholder="R$ 0,00"
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                decimalsLimit={2}
                value={watch("amount")}
                onValueChange={(_val, _name, values) =>
                  setValue("amount", values?.float?.toString() ?? "", { shouldValidate: true })
                }
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "inst-amount-error" : undefined}
                className={inputBaseClasses}
              />
              <FormErrorMessage id="inst-amount-error" message={errors.amount?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inst-dueDate">Vencimento</Label>
              <Input
                id="inst-dueDate"
                type="date"
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "inst-dueDate-error" : undefined}
                {...register("dueDate")}
              />
              <FormErrorMessage id="inst-dueDate-error" message={errors.dueDate?.message} />
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
