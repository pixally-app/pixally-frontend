"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, FileText, Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/lib/formatters";
import {
  listClients,
  createClient,
  updateClient,
  deleteClient,
  type Client,
} from "@/services/clients";
import type { ClientFormValues } from "@/schemas/client";

function parsePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const phoneNumber = digits.startsWith("55") ? digits.slice(2) : digits;
  return { dialCode: "+55", phoneNumber };
}

function formatPhone(phones: Client["phones"]) {
  if (!phones.length) return "-";
  const { dialCode, phoneNumber } = phones[0];
  const ddd = phoneNumber.slice(0, 2);
  const number = phoneNumber.slice(2);
  return `${dialCode} ${ddd} ${number}`;
}

function getDocumentType(document: string) {
  const digits = document.replace(/\D/g, "");
  return digits.length <= 11 ? "cpf" : "cnpj";
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      const response = await listClients({ limit: 100 });
      setClients(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao carregar clientes.");
      } else {
        toast.error("Erro ao carregar clientes.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const phoneStr = formatPhone(c.phones).toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.document.includes(term) ||
      phoneStr.includes(term)
    );
  });

  async function handleCreate(data: ClientFormValues) {
    const document = data.document.replace(/\D/g, "");
    const response = await createClient({
      name: data.name,
      document,
      documentType: getDocumentType(data.document),
      phones: [parsePhone(data.phones)],
    });
    setClients((prev) => [response, ...prev]);
    toast.success("Cliente criado com sucesso!");
  }

  async function handleUpdate(clientId: string, phones: Client["phones"], data: ClientFormValues) {
    const document = data.document.replace(/\D/g, "");
    const existingPhone = phones[0];
    const phone = parsePhone(data.phones);
    const response = await updateClient(clientId, {
      name: data.name,
      document,
      documentType: getDocumentType(data.document),
      phones: [existingPhone ? { id: existingPhone.id, ...phone } : phone],
    });
    setClients((prev) => prev.map((c) => (c.id === clientId ? response : c)));
    toast.success("Cliente atualizado com sucesso!");
  }

  async function handleDelete(clientId: string) {
    try {
      await deleteClient(clientId);
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      toast.success("Cliente excluído com sucesso!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao excluir cliente.");
      } else {
        toast.error("Erro ao excluir cliente.");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          onSubmit={handleCreate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const hasReceivable = client.totalReceivable > 0;
          const phoneDisplay = formatPhone(client.phones);

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
                      {client.document}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5" />
                    <span>{phoneDisplay}</span>
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
                        document: client.document,
                        phones: phoneDisplay,
                        street: "",
                        neighborhood: "",
                        number: "",
                      }}
                      onSubmit={(data) => handleUpdate(client.id, client.phones, data)}
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
                      onConfirm={() => handleDelete(client.id)}
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
