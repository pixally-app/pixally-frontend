import { z } from "zod";

function validateCPF(cpf: string): boolean {
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === Number(cpf[10]);
}

function validateCNPJ(cnpj: string): boolean {
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(cnpj[i]) * weights1[i];
  let rest = sum % 11;
  if (Number(cnpj[12]) !== (rest < 2 ? 0 : 11 - rest)) return false;

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(cnpj[i]) * weights2[i];
  rest = sum % 11;
  return Number(cnpj[13]) === (rest < 2 ? 0 : 11 - rest);
}

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  document: z
    .string()
    .min(1, "O documento é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        if (digits.length === 11) return validateCPF(digits);
        if (digits.length === 14) return validateCNPJ(digits);
        return false;
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
