"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientFormValues } from "@/schemas/client";
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

interface ClientFormDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  defaultValues?: ClientFormValues;
  onSubmit: (data: ClientFormValues) => void;
}

export function ClientFormDialog({
  trigger,
  title,
  description,
  defaultValues,
  onSubmit,
}: ClientFormDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: defaultValues ?? {
      name: "",
      nickname: "",
      cpfCnpj: "",
      phone: "",
      street: "",
      neighborhood: "",
      number: "",
    },
  });

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) {
      reset(defaultValues ?? {
        name: "",
        nickname: "",
        cpfCnpj: "",
        phone: "",
        street: "",
        neighborhood: "",
        number: "",
      });
    }
  }

  function onFormSubmit(data: ClientFormValues) {
    onSubmit(data);
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

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nome</Label>
              <Input
                id="client-name"
                placeholder="Nome completo"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "client-name-error" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id="client-name-error" className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-nickname">Apelido</Label>
              <Input
                id="client-nickname"
                placeholder="Apelido"
                {...register("nickname")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-cpfCnpj">CPF/CNPJ</Label>
              <Input
                id="client-cpfCnpj"
                placeholder="000.000.000-00"
                aria-invalid={!!errors.cpfCnpj}
                aria-describedby={errors.cpfCnpj ? "client-cpfCnpj-error" : undefined}
                {...register("cpfCnpj")}
              />
              {errors.cpfCnpj && (
                <p id="client-cpfCnpj-error" className="text-sm text-destructive">{errors.cpfCnpj.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Telefone</Label>
              <Input
                id="client-phone"
                placeholder="(00) 00000-0000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "client-phone-error" : undefined}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="client-phone-error" className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-street">Rua/Avenida</Label>
              <Input
                id="client-street"
                placeholder="Rua ou Avenida"
                {...register("street")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-neighborhood">Bairro</Label>
              <Input
                id="client-neighborhood"
                placeholder="Bairro"
                {...register("neighborhood")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-number">Numero</Label>
              <Input
                id="client-number"
                placeholder="No"
                {...register("number")}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
