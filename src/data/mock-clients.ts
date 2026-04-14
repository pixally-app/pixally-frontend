export interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  receiptsCount: number;
  totalReceived: string;
  totalReceivable: string;
}

export const clients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    cpfCnpj: "123.456.789-00",
    phone: "+55 11 98765-4321",
    receiptsCount: 3,
    totalReceived: "R$ 450.00",
    totalReceivable: "R$ 350.00",
  },
  {
    id: "2",
    name: "Maria Santos",
    cpfCnpj: "234.567.890-11",
    phone: "+55 11 97654-3210",
    receiptsCount: 2,
    totalReceived: "R$ 400.00",
    totalReceivable: "R$ 200.50",
  },
  {
    id: "3",
    name: "Pedro Costa",
    cpfCnpj: "345.678.901-22",
    phone: "+55 11 96543-2109",
    receiptsCount: 1,
    totalReceived: "R$ 150.00",
    totalReceivable: "R$ 0.00",
  },
  {
    id: "4",
    name: "Ana Paula Oliveira",
    cpfCnpj: "456.789.012-33",
    phone: "+55 11 95432-1098",
    receiptsCount: 1,
    totalReceived: "R$ 320.00",
    totalReceivable: "R$ 0.00",
  },
  {
    id: "5",
    name: "Carlos Mendes",
    cpfCnpj: "567.890.123-44",
    phone: "+55 11 94321-0987",
    receiptsCount: 1,
    totalReceived: "R$ 0.00",
    totalReceivable: "R$ 180.00",
  },
];
