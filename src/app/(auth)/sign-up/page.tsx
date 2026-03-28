"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMaskInput } from "react-imask";
import { signUpSchema, type SignUpFormData } from "@/schemas/sign-up";
import { documentMaskOptions, phoneMaskOptions } from "@/lib/masks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(_data: SignUpFormData) {
    // TODO: integrate sign-up API
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="italic">Criar Conta</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="document">Documento (CPF/CNPJ)</Label>
            <Controller
              name="document"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <IMaskInput
                  {...documentMaskOptions}
                  id="document"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  aria-invalid={!!errors.document}
                  aria-describedby={
                    errors.document ? "document-error" : undefined
                  }
                  className="flex h-10 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={field.value}
                  onAccept={(value: string) => field.onChange(value)}
                  inputRef={field.ref}
                />
              )}
            />
            {errors.document && (
              <p id="document-error" className="text-sm text-destructive">
                {errors.document.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <IMaskInput
                  {...phoneMaskOptions}
                  id="phone"
                  placeholder="(00) 00000-0000"
                  inputMode="numeric"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="flex h-10 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={field.value}
                  onAccept={(value: string) => field.onChange(value)}
                  inputRef={field.ref}
                />
              )}
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Criar conta
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Já tenho uma conta</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
