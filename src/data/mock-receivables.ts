export type ReceivableStatus = "pending" | "reconciled" | "overdue";

export interface Receivable {
  id: string;
  userId: string;
  clientId: string;
  pixReceiptId: string | null;
  descriptionService: string;
  totalAmount: number;
  installmentGroupId: string | null;
  installmentCount: number;
  installmentNumber: number;
  installmentAmount: number;
  dueDate: string;
  status: ReceivableStatus;
  paidAt: string | null;
  matchedAutomatically: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed fields (API joins)
  clientName: string;
  amountPaid: number;
}

export const receivables: Receivable[] = [
  {
    id: "1",
    userId: "u1",
    clientId: "1",
    pixReceiptId: "1",
    descriptionService: "Manutenção ar condicionado",
    totalAmount: 15000,
    installmentGroupId: null,
    installmentCount: 1,
    installmentNumber: 1,
    installmentAmount: 15000,
    dueDate: "2026-03-04",
    status: "reconciled",
    paidAt: "2026-02-26T14:30:00",
    matchedAutomatically: true,
    createdAt: "2026-02-20T10:00:00",
    updatedAt: "2026-02-26T14:30:00",
    clientName: "João Silva",
    amountPaid: 15000,
  },
  {
    id: "2",
    userId: "u1",
    clientId: "2",
    pixReceiptId: "2",
    descriptionService: "Instalação elétrica",
    totalAmount: 20050,
    installmentGroupId: null,
    installmentCount: 1,
    installmentNumber: 1,
    installmentAmount: 20050,
    dueDate: "2026-03-09",
    status: "reconciled",
    paidAt: "2026-02-26T15:45:00",
    matchedAutomatically: true,
    createdAt: "2026-02-25T14:00:00",
    updatedAt: "2026-02-26T15:45:00",
    clientName: "Maria Santos",
    amountPaid: 20050,
  },
  {
    id: "3",
    userId: "u1",
    clientId: "1",
    pixReceiptId: null,
    descriptionService: "Troca de filtro",
    totalAmount: 20000,
    installmentGroupId: null,
    installmentCount: 1,
    installmentNumber: 1,
    installmentAmount: 20000,
    dueDate: "2026-03-14",
    status: "pending",
    paidAt: null,
    matchedAutomatically: false,
    createdAt: "2026-03-01T08:00:00",
    updatedAt: "2026-03-01T08:00:00",
    clientName: "João Silva",
    amountPaid: 0,
  },
  {
    id: "4",
    userId: "u1",
    clientId: "5",
    pixReceiptId: null,
    descriptionService: "Consultoria técnica",
    totalAmount: 18000,
    installmentGroupId: null,
    installmentCount: 1,
    installmentNumber: 1,
    installmentAmount: 18000,
    dueDate: "2026-02-27",
    status: "overdue",
    paidAt: null,
    matchedAutomatically: false,
    createdAt: "2026-02-15T10:00:00",
    updatedAt: "2026-02-15T10:00:00",
    clientName: "Carlos Mendes",
    amountPaid: 0,
  },
  {
    id: "5",
    userId: "u1",
    clientId: "4",
    pixReceiptId: "4",
    descriptionService: "Projeto de instalação",
    totalAmount: 32000,
    installmentGroupId: null,
    installmentCount: 1,
    installmentNumber: 1,
    installmentAmount: 32000,
    dueDate: "2026-03-19",
    status: "reconciled",
    paidAt: "2026-02-26T17:10:00",
    matchedAutomatically: true,
    createdAt: "2026-03-05T09:00:00",
    updatedAt: "2026-02-26T17:10:00",
    clientName: "Ana Paula Oliveira",
    amountPaid: 32000,
  },
  {
    id: "6",
    userId: "u1",
    clientId: "1",
    pixReceiptId: null,
    descriptionService: "Manutenção preventiva",
    totalAmount: 15000,
    installmentGroupId: null,
    installmentCount: 1,
    installmentNumber: 1,
    installmentAmount: 15000,
    dueDate: "2026-03-24",
    status: "pending",
    paidAt: null,
    matchedAutomatically: false,
    createdAt: "2026-03-10T11:00:00",
    updatedAt: "2026-03-10T11:00:00",
    clientName: "João Silva",
    amountPaid: 0,
  },
];
