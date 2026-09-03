"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getDashboardSummary, type DashboardSummary } from "@/services/dashboard";
import { formatCurrency } from "@/lib/formatters";

const cardConfig = [
  { label: "Recebido este mês", key: "receivedThisMonth" as const, format: "currency", valueClassName: "text-success" },
  { label: "A receber", key: "totalPending" as const, format: "currency", valueClassName: "text-warning" },
  { label: "Vencidos", key: "totalOverdue" as const, format: "currency", valueClassName: "text-destructive" },
  { label: "Processados este mês", key: "processedThisMonth" as const, format: "number" },
];

export function SummaryCards() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => toast.error("Não foi possível carregar o resumo financeiro."));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cardConfig.map((card) => {
        const raw = summary?.[card.key];
        const value =
          raw == null
            ? "-"
            : card.format === "currency"
            ? formatCurrency(raw)
            : String(raw);

        return (
          <Card
            key={card.label}
            className="p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
          >
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`text-2xl font-bold ${card.valueClassName ?? ""}`}>{value}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
