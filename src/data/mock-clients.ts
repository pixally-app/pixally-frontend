export interface Client {
  id: string;
  userId: string;
  name: string;
  document: string;
  documentType: string;
  status: boolean;
  phones: string;
  createdAt: string;
  updatedAt: string;
  receiptsCount: number;
  totalReceived: number;
  totalReceivable: number;
}

export const clients: Client[] = [
  {
    id: "1",
    userId: "u1",
    name: "João Silva",
    document: "123.456.789-00",
    documentType: "cpf",
    status: true,
    phones: "+55 11 98765-4321",
    createdAt: "2026-01-10T10:00:00",
    updatedAt: "2026-01-10T10:00:00",
    receiptsCount: 3,
    totalReceived: 45000,
    totalReceivable: 35000,
  },
  {
    id: "2",
    userId: "u1",
    name: "Maria Santos",
    document: "234.567.890-11",
    documentType: "cpf",
    status: true,
    phones: "+55 11 97654-3210",
    createdAt: "2026-01-12T14:00:00",
    updatedAt: "2026-01-12T14:00:00",
    receiptsCount: 2,
    totalReceived: 40000,
    totalReceivable: 20050,
  },
  {
    id: "3",
    userId: "u1",
    name: "Pedro Costa",
    document: "345.678.901-22",
    documentType: "cpf",
    status: true,
    phones: "+55 11 96543-2109",
    createdAt: "2026-01-15T09:00:00",
    updatedAt: "2026-01-15T09:00:00",
    receiptsCount: 1,
    totalReceived: 15000,
    totalReceivable: 0,
  },
  {
    id: "4",
    userId: "u1",
    name: "Ana Paula Oliveira",
    document: "456.789.012-33",
    documentType: "cpf",
    status: true,
    phones: "+55 11 95432-1098",
    createdAt: "2026-01-20T11:00:00",
    updatedAt: "2026-01-20T11:00:00",
    receiptsCount: 1,
    totalReceived: 32000,
    totalReceivable: 0,
  },
  {
    id: "5",
    userId: "u1",
    name: "Carlos Mendes",
    document: "567.890.123-44",
    documentType: "cpf",
    status: true,
    phones: "+55 11 94321-0987",
    createdAt: "2026-02-01T08:00:00",
    updatedAt: "2026-02-01T08:00:00",
    receiptsCount: 1,
    totalReceived: 0,
    totalReceivable: 18000,
  },
];
