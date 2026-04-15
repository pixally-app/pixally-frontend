export type ReceivableStatus = "pending" | "reconciled" | "overdue";

export interface Receivable {
  id: string;
  description: string;
  clientName: string;
  amount: number;
  amountPaid: number;
  createdAt: string;
  dueDate: string;
  status: ReceivableStatus;
  linkedReceiptIds: string[];
}

export const receivables: Receivable[] = [
  {
    id: "1",
    description: "Manutenção ar condicionado",
    clientName: "João Silva",
    amount: 15000,
    amountPaid: 15000,
    createdAt: "2026-02-20",
    dueDate: "2026-03-04",
    status: "reconciled",
    linkedReceiptIds: ["1"],
  },
  {
    id: "2",
    description: "Instalação elétrica",
    clientName: "Maria Santos",
    amount: 20050,
    amountPaid: 20050,
    createdAt: "2026-02-25",
    dueDate: "2026-03-09",
    status: "reconciled",
    linkedReceiptIds: ["2"],
  },
  {
    id: "3",
    description: "Troca de filtro",
    clientName: "João Silva",
    amount: 20000,
    amountPaid: 0,
    createdAt: "2026-03-01",
    dueDate: "2026-03-14",
    status: "pending",
    linkedReceiptIds: [],
  },
  {
    id: "4",
    description: "Consultoria técnica",
    clientName: "Carlos Mendes",
    amount: 18000,
    amountPaid: 0,
    createdAt: "2026-02-15",
    dueDate: "2026-02-27",
    status: "overdue",
    linkedReceiptIds: [],
  },
  {
    id: "5",
    description: "Projeto de instalação",
    clientName: "Ana Paula Oliveira",
    amount: 32000,
    amountPaid: 32000,
    createdAt: "2026-03-05",
    dueDate: "2026-03-19",
    status: "reconciled",
    linkedReceiptIds: ["4"],
  },
  {
    id: "6",
    description: "Manutenção preventiva",
    clientName: "João Silva",
    amount: 15000,
    amountPaid: 0,
    createdAt: "2026-03-10",
    dueDate: "2026-03-24",
    status: "pending",
    linkedReceiptIds: [],
  },
];
