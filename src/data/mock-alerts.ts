export type AlertSeverity = "atencao" | "critico";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  date: string;
  time: string;
  title: string;
  clientName: string;
  receiptId: string;
}

export const severityConfig: Record<
  AlertSeverity,
  { label: string; variant: "warning" | "destructive" }
> = {
  atencao: { label: "Atenção", variant: "warning" },
  critico: { label: "Crítico", variant: "destructive" },
};

export const alerts: Alert[] = [
  {
    id: "1",
    severity: "critico",
    date: "26/02/2026",
    time: "16:20:00",
    title: "ID de transação PIX duplicado (possível fraude ou reenvio)",
    clientName: "Pedro Costa",
    receiptId: "3",
  },
  {
    id: "2",
    severity: "atencao",
    date: "26/02/2026",
    time: "18:00:00",
    title: "Dados parcialmente extraídos do comprovante",
    clientName: "Carlos Mendes",
    receiptId: "5",
  },
  {
    id: "3",
    severity: "atencao",
    date: "23/02/2026",
    time: "16:30:00",
    title: "Comprovante recebido de número desconhecido (não cadastrado como cliente)",
    clientName: "Mariana Castro",
    receiptId: "10",
  },
];
