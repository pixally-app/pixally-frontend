import { type ReceiptStatus, type ReceiptOrigin } from "@/services/receipts";

export const statusConfig: Record<
  ReceiptStatus,
  {
    label: string;
    variant: "success" | "destructive" | "warning" | "default" | "secondary";
    bgColor: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  ANALYSING:   { label: "Analisando", variant: "secondary",   bgColor: "bg-secondary/30",  textClass: "text-muted-foreground", badgeClass: "bg-secondary/30 text-secondary-foreground border-secondary/30" },
  RECEIVED:    { label: "Recebido",   variant: "success",     bgColor: "bg-success/10",     textClass: "text-success",          badgeClass: "bg-success/10 text-success border-success/20"                   },
  RED_FLAG:    { label: "Alerta",     variant: "destructive", bgColor: "bg-destructive/10", textClass: "text-destructive",      badgeClass: "bg-destructive/10 text-destructive border-destructive/20"       },
  YELLOW_FLAG: { label: "Alerta",     variant: "warning",     bgColor: "bg-warning/10",     textClass: "text-warning",          badgeClass: "bg-warning/10 text-warning border-warning/20"                   },
  ERROR:       { label: "Erro",       variant: "destructive", bgColor: "bg-destructive/10", textClass: "text-destructive",      badgeClass: "bg-destructive/10 text-destructive border-destructive/20"       },
  RECONCILED:  { label: "Conciliado", variant: "success",     bgColor: "bg-success/10",     textClass: "text-success",          badgeClass: "bg-success/10 text-success border-success/20"                   },
};

export const originConfig: Record<ReceiptOrigin, { label: string }> = {
  whatsapp: { label: "WhatsApp" },
  manual:   { label: "Manual"   },
};
