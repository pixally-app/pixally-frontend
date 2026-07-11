import { z } from "zod";

export const settingsAccountSchema = z.object({
  username: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  companyName: z.string().optional(),
});

export type SettingsAccountFormValues = z.infer<typeof settingsAccountSchema>;
