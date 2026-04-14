"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, FileText, Search } from "lucide-react";
import { clients } from "@/data/mock-clients";

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const hasReceivable = client.totalReceivable !== "R$ 0.00";

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

                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Recebido</p>
                    <p className="font-semibold text-success">
                      {client.totalReceived}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">A Receber</p>
                    <p className="font-semibold text-destructive">
                      {client.totalReceivable}
                    </p>
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
