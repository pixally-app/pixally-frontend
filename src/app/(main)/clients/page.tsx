"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Users, Phone, Search, Plus, Loader2 } from "lucide-react";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { ClientDetailsSheet } from "@/components/clients/client-details-sheet";
import { formatCurrency } from "@/lib/formatters";
import { CLIENT_PAGE_SIZE } from "@/lib/constants";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchClients = useCallback(async (p: number, name: string) => {
    try {
      setLoading(true);

      const params: Parameters<typeof listClients>[0] = { page: p, limit: CLIENT_PAGE_SIZE };
      if (name) params.name = name;
      const response = await listClients(params);
      setClients(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients(page, debouncedSearch);
  }, [fetchClients, page, debouncedSearch]);

  async function handleCreate(data: ClientFormValues) {
    try {
      const document = data.document.replace(/\D/g, "");
      await createClient({
        name: data.name,
        document,
        documentType: getDocumentType(data.document),
        street: data.street || undefined,
        neighborhood: data.neighborhood || undefined,
        number: data.number || undefined,
        phones: [parsePhone(data.phones)],
      });
      toast.success("Cliente criado com sucesso!");
      setPage(1);
      fetchClients(1, debouncedSearch);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar cliente.");
      throw err;
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar cliente.");
      throw err;
    }
  }

  async function handleDelete(clientId: string) {
    try {
      await deleteClient(clientId);
      toast.success("Cliente excluído com sucesso!");
      const isLastOnPage = clients.length === 1 && page > 1;
      if (isLastOnPage) {
        setPage(page - 1);
      } else {
        fetchClients(page, debouncedSearch);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir cliente.");
    }
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
            placeholder="Buscar por nome..."
            aria-label="Buscar por nome"
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
          <Users className="size-10" />
          <p className="text-sm">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
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
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
