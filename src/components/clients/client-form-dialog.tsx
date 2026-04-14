"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export interface ClientFormData {
  name: string;
  nickname: string;
  cpfCnpj: string;
  phone: string;
  street: string;
  neighborhood: string;
  number: string;
}

const emptyForm: ClientFormData = {
  name: "",
  nickname: "",
  cpfCnpj: "",
  phone: "",
  street: "",
  neighborhood: "",
  number: "",
};

interface ClientFormDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  defaultValues?: ClientFormData;
  onSubmit: (data: ClientFormData) => void;
}

export function ClientFormDialog({
  trigger,
  title,
  description,
  defaultValues,
  onSubmit,
}: ClientFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ClientFormData>(defaultValues ?? emptyForm);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      setForm(defaultValues ?? emptyForm);
    }
  }

  function handleSubmit() {
    onSubmit(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nome</Label>
            <Input
              id="client-name"
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-nickname">Apelido</Label>
            <Input
              id="client-nickname"
              placeholder="Apelido"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-cpfCnpj">CPF/CNPJ</Label>
            <Input
              id="client-cpfCnpj"
              placeholder="000.000.000-00"
              value={form.cpfCnpj}
              onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">Telefone</Label>
            <Input
              id="client-phone"
              placeholder="+55 69 99999-9999"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-street">Rua/Avenida</Label>
            <Input
              id="client-street"
              placeholder="Rua ou Avenida"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-neighborhood">Bairro</Label>
            <Input
              id="client-neighborhood"
              placeholder="Bairro"
              value={form.neighborhood}
              onChange={(e) =>
                setForm({ ...form, neighborhood: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-number">Número</Label>
            <Input
              id="client-number"
              placeholder="Nº"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
