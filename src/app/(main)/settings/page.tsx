"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/schemas/change-password";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { Upload } from "lucide-react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [accountName, setAccountName] = useState("");
  const accountEmail = "usuario@email.com";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onChangePassword(data: ChangePasswordFormValues) {
    // TODO: integrar com API
    console.log("Alterar senha", data);
    reset();
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Digite sua senha atual"
                aria-invalid={!!errors.currentPassword}
                aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
                {...register("currentPassword")}
              />
              <FormErrorMessage id="current-password-error" message={errors.currentPassword?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite a nova senha"
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? "new-password-error" : undefined}
                {...register("newPassword")}
              />
              <FormErrorMessage id="new-password-error" message={errors.newPassword?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme a nova senha"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                {...register("confirmPassword")}
              />
              <FormErrorMessage id="confirm-password-error" message={errors.confirmPassword?.message} />
            </div>

            <Button type="submit">Alterar Senha</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
