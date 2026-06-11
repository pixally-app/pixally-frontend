"use client";

import { Phone, FileText, MapPin, Users, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/lib/formatters";
import type { Client } from "@/services/clients";
import type { ClientFormValues } from "@/schemas/client";

interface ClientDetailsSheetProps {
  client: Client;
  trigger: React.ReactNode;
  formatPhone: (phone: Client["phones"][number]) => string;
  formatFirstPhone: (phones: Client["phones"]) => string;
  onEdit: (data: ClientFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function ClientDetailsSheet({
  client,
  trigger,
  formatPhone,
  formatFirstPhone,
  onEdit,
  onDelete,
}: ClientDetailsSheetProps) {
  const hasAddress = client.street || client.neighborhood || client.number;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="truncate">{client.name}</DialogTitle>
                {client.totalReceivable > 0 && (
                  <Badge variant="destructive" className="text-xs shrink-0">
                    A receber
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{client.document}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contato
            </h3>
            {client.phones.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                <span>Não informado</span>
              </div>
            ) : (
              client.phones.map((phone) => (
                <div key={phone.id} className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{formatPhone(phone)}</span>
                </div>
              ))
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Endereço
            </h3>
            {hasAddress ? (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  {(client.street || client.number) && (
                    <p>{[client.street, client.number].filter(Boolean).join(", ")}</p>
                  )}
                  {client.neighborhood && (
                    <p className="text-muted-foreground">{client.neighborhood}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>Não informado</span>
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Financeiro
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4" />
              <span>{client.receiptsCount} comprovante(s)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Total Recebido</p>
                <p className="font-semibold text-success text-sm">
                  {formatCurrency(client.totalReceived)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">A Receber</p>
                <p className="font-semibold text-destructive text-sm">
                  {formatCurrency(client.totalReceivable)}
                </p>
              </div>
            </div>
          </section>

          <div className="flex gap-2 pt-1">
            <ClientFormDialog
              trigger={
                <Button variant="outline" className="flex-1">
                  <Pencil className="size-4" />
                  Editar
                </Button>
              }
              title="Editar Cliente"
              description="Atualize os dados do cliente."
              defaultValues={{
                name: client.name,
                document: client.document,
                phones: client.phones.length ? formatFirstPhone(client.phones) : "",
                street: client.street ?? "",
                neighborhood: client.neighborhood ?? "",
                number: client.number ?? "",
              }}
              onSubmit={onEdit}
            />
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                  Excluir
                </Button>
              }
              title="Excluir cliente"
              description={`Tem certeza que deseja excluir ${client.name}? Esta ação não pode ser desfeita.`}
              confirmLabel="Excluir"
              icon={<Trash2 className="size-4" />}
              onConfirm={onDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
