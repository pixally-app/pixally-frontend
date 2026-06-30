import { z } from "zod";

export const receivableSchema = z
  .object({
    serviceName: z.string().min(1, "Nome do serviço é obrigatório"),
    description: z.string(),
    clientId: z.string().min(1, "Selecione um cliente"),
    amount: z
      .string()
      .min(1, "Valor é obrigatório")
      .refine(
        (val) => /^\d+(\.\d{1,2})?$/.test(val.trim()),
        { message: "Formato de valor inválido" }
      )
      .refine(
        (val) => {
          const num = parseFloat(val.trim());
          return !isNaN(num) && num > 0;
        },
        { message: "Valor deve ser maior que zero" }
      ),
    dueDate: z.string().min(1, "Vencimento é obrigatório"),
    isInstallment: z.boolean(),
    installments: z.number().int().min(1),
  })
  .refine(
    (data) => !data.isInstallment || data.installments >= 2,
    {
      message: "Mínimo de 2 parcelas",
      path: ["installments"],
    }
  );

export type ReceivableFormValues = z.infer<typeof receivableSchema>;
