"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { settingsAccountSchema, type SettingsAccountFormValues } from "@/schemas/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { Loader2 } from "lucide-react";
import { updateMe } from "@/services/users";
import { useUser } from "@/contexts/user-context";

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsAccountFormValues>({
    resolver: zodResolver(settingsAccountSchema),
    defaultValues: {
      username: "",
      email: "",
      companyName: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      username: user.username ?? "",
      email: user.email,
      companyName: user.companyName ?? "",
    });
  }, [user, form]);

  async function onSave(data: SettingsAccountFormValues) {
    setIsSaving(true);
    try {
      const updated = await updateMe({
        username: data.username,
        email: data.email,
        companyName: data.companyName || undefined,
      });
      setUser(updated);
      toast.success("Dados atualizados com sucesso");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        toast.error(message ?? "Erro ao salvar dados");
      } else {
        toast.error("Erro ao salvar dados");
      }
    } finally {
      setIsSaving(false);
    }
  }

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
          <CardTitle className="text-lg font-bold">Minha Conta</CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome do Negócio</Label>
                <Input
                  id="company-name"
                  placeholder="Nome do seu negócio"
                  {...form.register("companyName")}
                />
                <FormErrorMessage message={form.formState.errors.companyName?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nome</Label>
                <Input
                  id="username"
                  placeholder="Seu nome"
                  {...form.register("username")}
                />
                <FormErrorMessage message={form.formState.errors.username?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...form.register("email")}
                />
                <FormErrorMessage message={form.formState.errors.email?.message} />
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
