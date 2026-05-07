"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye } from "lucide-react";
import Link from "next/link";
import { warnings, warningTypeConfig, type WarningType } from "@/data/mock-alerts";
import { formatDateTime } from "@/lib/formatters";

const borderColor: Record<WarningType, string> = {
  critico: "border-destructive",
  atencao: "border-warning",
};

const filters = [
  { label: "Todos", value: "all" },
  { label: "Atenção", value: "atencao" },
  { label: "Crítico", value: "critico" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

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
  const [filter, setFilter] = useState<FilterValue>("all");

  const pending = useMemo(
    () => warnings.filter((w) => !w.resolved),
    []
  );

  const filtered = useMemo(() => {
    if (filter === "all") return pending;
    return pending.filter((w) => w.type === filter);
  }, [pending, filter]);

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

      <Card>
        <CardContent className="p-5">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((warning) => {
          const config = warningTypeConfig[warning.type];
          const { date, time } = formatDateTime(warning.createdAt);

          return (
            <Card key={warning.id} className={`border-l-4 ${borderColor[warning.type]}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`size-5 mt-0.5 ${warning.type === "critico" ? "text-destructive" : "text-warning"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {date}, {time}
                      </span>
                    </div>
                    <p className="font-semibold">{warning.message}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Cliente: {warning.clientName}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" asChild>
                        <Link href={`/receipts/${warning.pixReceiptId}`}>
                          <Eye className="size-4" />
                          Ver Comprovante
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: integrar com API
                        }}
                      >
                        Resolver
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
