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
import { Input, inputBaseClasses } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { Eye, EyeOff } from "lucide-react";
import { register as registerUser } from "@/services/auth";

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: SignUpFormData) {
    try {
      const response = await registerUser({
        username: data.name,
        email: data.email,
        password: data.password,
        document: data.document.replace(/\D/g, ""),
        phone: data.phone.replace(/\D/g, ""),
      });
      setCookie("access_token", response.access_token, {
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    }
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
            <FormErrorMessage id="name-error" message={errors.name?.message} />
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
                  name={field.name}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  aria-invalid={!!errors.document}
                  aria-describedby={
                    errors.document ? "document-error" : undefined
                  }
                  className={inputBaseClasses}
                  value={field.value}
                  onAccept={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />
            <FormErrorMessage id="document-error" message={errors.document?.message} />
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
                  name={field.name}
                  placeholder="(00) 00000-0000"
                  inputMode="numeric"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={inputBaseClasses}
                  value={field.value}
                  onAccept={(value: string) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />
            <FormErrorMessage id="phone-error" message={errors.phone?.message} />
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
            <FormErrorMessage id="email-error" message={errors.email?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FormErrorMessage id="password-error" message={errors.password?.message} />
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
