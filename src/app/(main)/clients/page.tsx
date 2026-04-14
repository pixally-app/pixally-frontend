"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, FileText, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { clients } from "@/data/mock-clients";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return clients;
    const term = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.cpfCnpj.includes(term) ||
        c.phone.includes(term)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os clientes que enviam comprovantes pelo WhatsApp
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF/CNPJ ou telefone..."
            aria-label="Buscar por nome, CPF/CNPJ ou telefone"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ClientFormDialog
          trigger={
            <Button>
              <Plus className="size-4" />
              Novo Cliente
            </Button>
          }
          title="Novo Cliente"
          description="Preencha os dados do novo cliente."
          onSubmit={(data) => {
            // TODO: integrar com API
            console.log(data);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const hasReceivable = client.totalReceivable > 0;

          return (
            <Card key={client.id} className="relative">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                    <Users className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{client.name}</h3>
                      {hasReceivable && (
                        <Badge variant="destructive" className="text-xs shrink-0">
                          A receber
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {client.cpfCnpj}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-3.5" />
                    <span>{client.receiptsCount} comprovante(s)</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Recebido</p>
                      <p className="font-semibold text-success">
                        {formatCurrency(client.totalReceived)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">A Receber</p>
                      <p className="font-semibold text-destructive">
                        {formatCurrency(client.totalReceivable)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <ClientFormDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8" aria-label={`Editar cliente ${client.name}`}>
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                      title="Editar Cliente"
                      description="Atualize os dados do cliente."
                      defaultValues={{
                        name: client.name,
                        nickname: "",
                        cpfCnpj: client.cpfCnpj,
                        phone: client.phone,
                        street: "",
                        neighborhood: "",
                        number: "",
                      }}
                      onSubmit={(data) => {
                        // TODO: integrar com API
                        console.log(data);
                      }}
                    />
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Excluir cliente ${client.name}`}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      }
                      title="Excluir cliente"
                      description={`Tem certeza que deseja excluir ${client.name}? Esta ação não pode ser desfeita.`}
                      confirmLabel="Excluir"
                      icon={<Trash2 className="size-4" />}
                      onConfirm={() => {
                        // TODO: integrar com API
                        console.log("delete", client.id);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
