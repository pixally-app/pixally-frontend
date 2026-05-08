"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [accountName, setAccountName] = useState("");
  const accountEmail = "usuario@email.com";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Meu Negócio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nome do Negócio</Label>
            <Input
              id="business-name"
              placeholder="Nome do seu negócio"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="size-8" />
                <p className="text-sm">Clique ou arraste para enviar a logo</p>
              </div>
            </div>
          </div>

          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Minha Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-name">Nome</Label>
            <Input
              id="account-name"
              placeholder="Seu nome"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-email">Email</Label>
            <Input
              id="account-email"
              value={accountEmail}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              O email não pode ser alterado
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
