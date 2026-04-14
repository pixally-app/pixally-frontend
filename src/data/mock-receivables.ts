export type ReceivableStatus = "pending" | "reconciled" | "overdue";

export interface Receivable {
  id: string;
  description: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: ReceivableStatus;
  receiptNumber?: number;
}

export const receivables: Receivable[] = [
  {
    id: "1",
    description: "Manutenção ar condicionado",
    clientName: "João Silva",
    amount: 15000,
    dueDate: "2026-03-04",
    status: "reconciled",
    receiptNumber: 1,
  },
  {
    id: "2",
    description: "Instalação elétrica",
    clientName: "Maria Santos",
    amount: 20050,
    dueDate: "2026-03-09",
    status: "reconciled",
    receiptNumber: 2,
  },
  {
    id: "3",
    description: "Troca de filtro",
    clientName: "João Silva",
    amount: 20000,
    dueDate: "2026-03-14",
    status: "pending",
  },
  {
    id: "4",
    description: "Consultoria técnica",
    clientName: "Carlos Mendes",
    amount: 18000,
    dueDate: "2026-02-27",
    status: "overdue",
  },
  {
    id: "5",
    description: "Projeto de instalação",
    clientName: "Ana Paula Oliveira",
    amount: 32000,
    dueDate: "2026-03-19",
    status: "reconciled",
    receiptNumber: 3,
  },
  {
    id: "6",
    description: "Manutenção preventiva",
    clientName: "João Silva",
    amount: 15000,
    dueDate: "2026-03-24",
    status: "pending",
  },
];
