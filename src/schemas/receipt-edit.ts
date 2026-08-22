import { z } from "zod";

export const receiptEditSchema = z.object({
  pixTransactionId: z.string().trim(),
  depositOriginName: z.string().trim(),
  depositOriginBank: z.string().trim(),
  depositOriginAgency: z.string().trim(),
  depositOriginAccount: z.string().trim(),
  depositOriginDocument: z.string().trim(),
  depositAmount: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      { message: "Valor inválido" }
    ),
  depositDateTime: z.string().trim(),
  description: z.string().trim(),
  depositDestinationName: z.string().trim(),
  depositDestinationBank: z.string().trim(),
  depositDestinationDocument: z.string().trim(),
  depositDestinationAccount: z.string().trim(),
});

export type ReceiptEditValues = z.infer<typeof receiptEditSchema>;
