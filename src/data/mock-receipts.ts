export type ReceiptStatus = "conciliado" | "problema" | "alerta" | "recebido" | "analisando";
export type ReceiptSource = "whatsapp" | "manual";

export interface Receipt {
  id: string;
  date: string;
  time: string;
  clientName: string;
  clientBank: string;
  amount: string;
  status: ReceiptStatus;
  source: ReceiptSource;
  transactionId: string;
  agency: string;
  account: string;
  cpfCnpj: string;
  description: string;
  receiverName: string;
  receiverBank: string;
  receiverCpfCnpj: string;
  receiverPixId: string;
  linkedReceivable?: {
    title: string;
    client: string;
    amount: string;
  };
}

export const statusConfig: Record<ReceiptStatus, { label: string; variant: "success" | "destructive" | "warning" | "default" | "secondary" }> = {
  conciliado: { label: "Conciliado", variant: "success" },
  problema: { label: "Problema", variant: "destructive" },
  alerta: { label: "Alerta", variant: "warning" },
  recebido: { label: "Recebido", variant: "success" },
  analisando: { label: "Analisando", variant: "secondary" },
};

export const statusDescription: Record<ReceiptStatus, string> = {
  conciliado: "Vinculado a uma conta a receber",
  problema: "Duplicidade, fraude suspeita ou dados inválidos",
  alerta: "Possível divergência detectada",
  recebido: "Comprovante recebido com sucesso",
  analisando: "Em análise pelo sistema",
};

export const receipts: Receipt[] = [
  {
    id: "1", date: "26/02/2026", time: "14:30", clientName: "João Silva", clientBank: "Nubank",
    amount: "R$ 150.00", status: "conciliado", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "34895931-5",
    cpfCnpj: "***.916.152.***", description: "Pagamento referente ao serviço de automação",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
    linkedReceivable: { title: "Instalação elétrica", client: "João Silva", amount: "R$ 150,00" },
  },
  {
    id: "2", date: "26/02/2026", time: "15:45", clientName: "Maria Santos", clientBank: "Inter",
    amount: "R$ 200.50", status: "conciliado", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "34895931-5",
    cpfCnpj: "***.916.152.***", description: "Pagamento referente ao serviço de automação",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
    linkedReceivable: { title: "Instalação elétrica", client: "Maria Santos", amount: "R$ 200,50" },
  },
  {
    id: "3", date: "26/02/2026", time: "16:20", clientName: "Pedro Costa", clientBank: "Nubank",
    amount: "R$ 150.00", status: "problema", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "22341567-8",
    cpfCnpj: "***.234.567.***", description: "Pagamento de manutenção",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
  {
    id: "4", date: "26/02/2026", time: "17:10", clientName: "Ana Paula Oliveira", clientBank: "Itaú",
    amount: "R$ 320.00", status: "conciliado", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "3456", account: "78901234-0",
    cpfCnpj: "***.456.789.***", description: "Serviço de consultoria",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
    linkedReceivable: { title: "Consultoria técnica", client: "Ana Paula Oliveira", amount: "R$ 320,00" },
  },
  {
    id: "5", date: "26/02/2026", time: "18:00", clientName: "Carlos Mendes", clientBank: "Banco do Brasil",
    amount: "R$ 100.00", status: "alerta", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "1234", account: "56789012-3",
    cpfCnpj: "***.567.890.***", description: "Pagamento parcial",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
  {
    id: "6", date: "25/02/2026", time: "10:30", clientName: "Juliana Ferreira", clientBank: "PicPay",
    amount: "R$ 180.00", status: "recebido", source: "manual",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "12345678-9",
    cpfCnpj: "***.678.901.***", description: "Serviço de instalação",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
  {
    id: "7", date: "25/02/2026", time: "14:20", clientName: "Roberto Alves", clientBank: "Santander",
    amount: "R$ 250.00", status: "recebido", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0456", account: "98765432-1",
    cpfCnpj: "***.789.012.***", description: "Manutenção preventiva",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
  {
    id: "8", date: "24/02/2026", time: "09:15", clientName: "Fernanda Lima", clientBank: "Nubank",
    amount: "R$ 150.00", status: "analisando", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "34895931-5",
    cpfCnpj: "***.890.123.***", description: "Pagamento referente ao serviço de automação",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
  {
    id: "9", date: "24/02/2026", time: "11:40", clientName: "Lucas Rodrigues", clientBank: "C6 Bank",
    amount: "R$ 450.00", status: "recebido", source: "manual",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "65432198-7",
    cpfCnpj: "***.901.234.***", description: "Projeto de automação residencial",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
  {
    id: "10", date: "23/02/2026", time: "16:30", clientName: "Mariana Castro", clientBank: "Inter",
    amount: "R$ 200.00", status: "alerta", source: "whatsapp",
    transactionId: "E18236120206021614545s030f089c1a", agency: "0001", account: "11223344-5",
    cpfCnpj: "***.012.345.***", description: "Serviço de manutenção corretiva",
    receiverName: "Melo Automação e Sistemas", receiverBank: "BCO DO BRASIL S.A.",
    receiverCpfCnpj: "12.345.678/0001-90", receiverPixId: "F345678901234567890123456789018C",
  },
];
