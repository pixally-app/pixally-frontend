import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  document: z
    .string()
    .trim()
    .min(1, "CPF/CNPJ é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 11 || digits.length === 14;
      },
      { message: "Digite um CPF ou CNPJ válido" }
    ),
  phones: z
    .string()
    .trim()
    .min(1, "Telefone é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        const normalized = digits.startsWith("55") ? digits.slice(2) : digits;
        return normalized.length === 10 || normalized.length === 11;
      },
      { message: "Digite um telefone válido com DDD" }
    ),
  street: z.string().trim(),
  neighborhood: z.string().trim(),
  number: z.string().trim(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
