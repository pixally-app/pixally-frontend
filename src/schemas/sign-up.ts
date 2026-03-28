import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  document: z
    .string()
    .min(1, "O documento é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 11 || digits.length === 14;
      },
      { message: "Digite um CPF ou CNPJ válido" },
    ),

  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      },
      { message: "Digite um telefone válido com DDD" },
    ),

  email: z
    .string()
    .min(1, "O email é obrigatório")
    .email("Digite um email válido"),

  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
