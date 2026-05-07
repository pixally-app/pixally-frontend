"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { warnings } from "@/data/mock-alerts";

const summaryCards = [
  {
    label: "Alertas Pendentes",
    key: "total" as const,
    color: "text-foreground",
    icon: <AlertTriangle className="size-5 text-warning" />,
  },
  {
    label: "Atenção (Amarelo)",
    key: "atencao" as const,
    color: "text-warning",
    icon: <span className="size-3 rounded-full bg-warning" />,
  },
  {
    label: "Crítico (Vermelho)",
    key: "critico" as const,
    color: "text-destructive",
    icon: <span className="size-3 rounded-full bg-destructive" />,
  },
];

export default function AlertsPage() {
  const pending = useMemo(
    () => warnings.filter((w) => !w.resolved),
    []
  );

  const summary = useMemo(() => {
    let atencao = 0;
    let critico = 0;
    for (const w of pending) {
      if (w.type === "atencao") atencao++;
      else if (w.type === "critico") critico++;
    }
    return { total: pending.length, atencao, critico };
  }, [pending]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alertas</h1>
        <p className="text-muted-foreground">
          Central de problemas detectados pelo sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                {card.icon}
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>
                {summary[card.key]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
