import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial");
