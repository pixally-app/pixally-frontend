"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, Search, Plus, Loader2 } from "lucide-react";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { ClientDetailsSheet } from "@/components/clients/client-details-sheet";
import { formatCurrency } from "@/lib/formatters";
import {
  listClients,
  createClient,
  updateClient,
  deleteClient,
  type Client,
} from "@/services/clients";
import type { ClientFormValues } from "@/schemas/client";

export function formatPhone(phone: Client["phones"][number]) {
  const { dialCode, phoneNumber } = phone;
  const ddd = phoneNumber.slice(0, 2);
  const number = phoneNumber.slice(2);
  return `${dialCode} ${ddd} ${number}`;
}

export function formatFirstPhone(phones: Client["phones"]) {
  if (!phones.length) return "-";
  return formatPhone(phones[0]);
}

function parsePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const phoneNumber = digits.startsWith("55") ? digits.slice(2) : digits;
  return { dialCode: "+55", phoneNumber };
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
    const phoneStr = formatFirstPhone(c.phones).toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.document.includes(term) ||
      phoneStr.includes(term)
    );
  });

  async function handleCreate(data: ClientFormValues) {
    try {
      const document = data.document.replace(/\D/g, "");
      const response = await createClient({
        name: data.name,
        document,
        documentType: getDocumentType(data.document),
        street: data.street || undefined,
        neighborhood: data.neighborhood || undefined,
        number: data.number || undefined,
        phones: [parsePhone(data.phones)],
      });
      setClients((prev) => [response, ...prev]);
      toast.success("Cliente criado com sucesso!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao criar cliente.");
      } else {
        toast.error("Erro ao criar cliente.");
      }
      throw error;
    }
  }

  async function handleUpdate(clientId: string, phones: Client["phones"], data: ClientFormValues) {
    try {
      const document = data.document.replace(/\D/g, "");
      const existingPhone = phones[0];
      const phone = parsePhone(data.phones);
      const response = await updateClient(clientId, {
        name: data.name,
        document,
        documentType: getDocumentType(data.document),
        street: data.street || undefined,
        neighborhood: data.neighborhood || undefined,
        number: data.number || undefined,
        phones: [existingPhone ? { id: existingPhone.id, ...phone } : phone],
      });
      setClients((prev) => prev.map((c) => (c.id === clientId ? response : c)));
      toast.success("Cliente atualizado com sucesso!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao atualizar cliente.");
      } else {
        toast.error("Erro ao atualizar cliente.");
      }
      throw error;
    }
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
        {filtered.map((client) => (
          <ClientDetailsSheet
            key={client.id}
            client={client}
            formatPhone={formatPhone}
            formatFirstPhone={formatFirstPhone}
            onEdit={(data) => handleUpdate(client.id, client.phones, data)}
            onDelete={() => handleDelete(client.id)}
            trigger={
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0">
                      <Users className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold truncate">{client.name}</h3>
                        {client.totalReceivable > 0 && (
                          <Badge variant="destructive" className="text-xs shrink-0">
                            A receber
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{client.document}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5" />
                      <span>{formatFirstPhone(client.phones)}</span>
                      {client.phones.length > 1 && (
                        <span className="text-xs">+{client.phones.length - 1}</span>
                      )}
                    </div>
                  </div>

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
                </CardContent>
              </Card>
            }
          />
        ))}
      </div>
    </div>
  );
}
