"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientFormValues } from "@/schemas/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";
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
      document: "",
      phones: "",
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
        document: "",
        phones: "",
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
              <FormErrorMessage id="client-name-error" message={errors.name?.message} />
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
              <Label htmlFor="client-document">CPF/CNPJ</Label>
              <Input
                id="client-document"
                placeholder="000.000.000-00"
                aria-invalid={!!errors.document}
                aria-describedby={errors.document ? "client-document-error" : undefined}
                {...register("document")}
              />
              <FormErrorMessage id="client-document-error" message={errors.document?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Telefone</Label>
              <Input
                id="client-phone"
                placeholder="(00) 00000-0000"
                aria-invalid={!!errors.phones}
                aria-describedby={errors.phones ? "client-phone-error" : undefined}
                {...register("phones")}
              />
              <FormErrorMessage id="client-phone-error" message={errors.phones?.message} />
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
              <Label htmlFor="client-number">Número</Label>
              <Input
                id="client-number"
                placeholder="Nº"
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
