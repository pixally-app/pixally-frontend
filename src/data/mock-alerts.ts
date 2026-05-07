export type WarningType = "atencao" | "critico";

export interface Warning {
  id: string;
  pixReceiptId: string;
  clientId: string | null;
  type: WarningType;
  message: string;
  resolved: boolean;
  resolutionReason: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed fields (API joins)
  clientName: string;
}

export const warningTypeConfig: Record<
  WarningType,
  { label: string; variant: "warning" | "destructive" }
> = {
  atencao: { label: "Atenção", variant: "warning" },
  critico: { label: "Crítico", variant: "destructive" },
};

export const warnings: Warning[] = [
  {
    id: "1",
    pixReceiptId: "3",
    clientId: "3",
    type: "critico",
    message: "ID de transação PIX duplicado (possível fraude ou reenvio)",
    resolved: false,
    resolutionReason: null,
    resolvedAt: null,
    createdAt: "2026-02-26T16:20:00",
    updatedAt: "2026-02-26T16:20:00",
    clientName: "Pedro Costa",
  },
  {
    id: "2",
    pixReceiptId: "5",
    clientId: "5",
    type: "atencao",
    message: "Dados parcialmente extraídos do comprovante",
    resolved: false,
    resolutionReason: null,
    resolvedAt: null,
    createdAt: "2026-02-26T18:00:00",
    updatedAt: "2026-02-26T18:00:00",
    clientName: "Carlos Mendes",
  },
  {
    id: "3",
    pixReceiptId: "10",
    clientId: null,
    type: "atencao",
    message: "Comprovante recebido de número desconhecido (não cadastrado como cliente)",
    resolved: false,
    resolutionReason: null,
    resolvedAt: null,
    createdAt: "2026-02-23T16:30:00",
    updatedAt: "2026-02-23T16:30:00",
    clientName: "Mariana Castro",
  },
];
