import { Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { type AccountReceivableStatus } from "@/services/receivables";

export const statusConfig: Record<
  AccountReceivableStatus,
  { label: string; variant: "warning" | "success" | "destructive"; icon: typeof Clock }
> = {
  PENDING: { label: "Pendente", variant: "warning", icon: Clock },
  PAID: { label: "Pago", variant: "success", icon: CheckCircle2 },
  OVERDUE: { label: "Vencido", variant: "destructive", icon: AlertTriangle },
  CANCELLED: { label: "Cancelado", variant: "destructive", icon: XCircle },
};
