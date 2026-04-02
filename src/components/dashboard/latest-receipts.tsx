import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowUpFromLine } from "lucide-react";

const statusConfig = {
  conciliado: { label: "Conciliado", variant: "success" as const },
  problema: { label: "Problema", variant: "destructive" as const },
  alerta: { label: "Alerta", variant: "warning" as const },
  recebido: { label: "Recebido", variant: "default" as const },
};

const receipts = [
  {
    id: "1",
    name: "João Silva",
    date: "26/02/2026, 14:30:00",
    amount: "R$ 150,00",
    status: "conciliado" as const,
    source: "whatsapp" as const,
  },
  {
    id: "2",
    name: "Maria Santos",
    date: "26/02/2026, 15:45:00",
    amount: "R$ 200,50",
    status: "conciliado" as const,
    source: "whatsapp" as const,
  },
  {
    id: "3",
    name: "Pedro Costa",
    date: "26/02/2026, 16:20:00",
    amount: "R$ 150,00",
    status: "problema" as const,
    source: "whatsapp" as const,
  },
  {
    id: "4",
    name: "Ana Paula Oliveira",
    date: "26/02/2026, 17:10:00",
    amount: "R$ 320,00",
    status: "conciliado" as const,
    source: "whatsapp" as const,
  },
  {
    id: "5",
    name: "Carlos Mendes",
    date: "26/02/2026, 18:00:00",
    amount: "R$ 0,00",
    status: "alerta" as const,
    source: "whatsapp" as const,
  },
  {
    id: "6",
    name: "Juliana Ferreira",
    date: "25/02/2026, 10:30:00",
    amount: "R$ 180,00",
    status: "recebido" as const,
    source: "upload" as const,
  },
];

export function LatestReceipts() {
  return (
    <div className="divide-y divide-border">
      {receipts.map((receipt) => {
        const status = statusConfig[receipt.status];
        return (
          <div
            key={receipt.id}
            className="flex items-center gap-4 py-4 px-3 -mx-3 rounded-md transition-colors"
          >
            <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
              {receipt.source === "whatsapp" ? (
                <MessageCircle className="size-5" />
              ) : (
                <ArrowUpFromLine className="size-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{receipt.name}</p>
              <p className="text-sm text-muted-foreground">{receipt.date}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-semibold text-success">{receipt.amount}</p>
              <Badge variant={status.variant} className="text-[11px]">
                {status.label}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
