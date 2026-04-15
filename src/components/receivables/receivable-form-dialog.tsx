"use client";

import { useState } from "react";
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

export interface ReceivableFormData {
  serviceName: string;
  description: string;
  clientId: string;
  amount: string;
  installments: number;
  dueDate: string;
}

const emptyForm: ReceivableFormData = {
  serviceName: "",
  description: "",
  clientId: "",
  amount: "",
  installments: 1,
  dueDate: "",
};

interface ReceivableFormDialogProps {
  trigger: React.ReactNode;
  onSubmit: (data: ReceivableFormData) => void;
}

export function ReceivableFormDialog({
  trigger,
  onSubmit,
}: ReceivableFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReceivableFormData>(emptyForm);
  const [isInstallment, setIsInstallment] = useState(false);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      setForm(emptyForm);
      setIsInstallment(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
    setOpen(false);
  }

  const amountNumber = parseFloat(form.amount.replace(",", ".")) || 0;
  const installmentValue =
    isInstallment && form.installments > 1
      ? amountNumber / form.installments
      : 0;

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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="receivable-service">Nome do Serviço</Label>
              <Input
                id="receivable-service"
                placeholder="Ex: Manutenção ar condicionado"
                value={form.serviceName}
                onChange={(e) =>
                  setForm({ ...form, serviceName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-description">Descrição</Label>
              <Textarea
                id="receivable-description"
                placeholder="Detalhes do serviço realizado"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={form.clientId}
                onValueChange={(value) =>
                  setForm({ ...form, clientId: value })
                }
              >
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-amount">Valor Total (R$)</Label>
              <Input
                id="receivable-amount"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivable-dueDate">Vencimento</Label>
              <Input
                id="receivable-dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="receivable-installment"
                checked={isInstallment}
                onCheckedChange={(checked) => {
                  setIsInstallment(checked === true);
                  if (!checked) {
                    setForm({ ...form, installments: 1 });
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
                  value={form.installments > 1 ? form.installments : ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      installments: parseInt(e.target.value) || 2,
                    })
                  }
                />
                {installmentValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {form.installments}x de{" "}
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
