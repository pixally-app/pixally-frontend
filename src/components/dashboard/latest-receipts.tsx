"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowUpFromLine } from "lucide-react";
import { listReceipts, type Receipt } from "@/services/receipts";
import { statusConfig } from "@/components/receipts/status-config";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

export function LatestReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listReceipts({ limit: 6 })
      .then((res) => setReceipts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 px-3">
            <div className="rounded-full bg-muted size-10 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nenhum comprovante encontrado.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {receipts.map((receipt) => {
        const status = statusConfig[receipt.status] ?? {
          label: receipt.status,
          badgeClass: "",
        };
        const name = receipt.client?.name ?? receipt.depositOriginName ?? "—";
        const datetime = receipt.depositDateTime
          ? formatDateTime(receipt.depositDateTime)
          : null;

        return (
          <Link
            key={receipt.id}
            href={`/receipts/${receipt.id}`}
            className="flex items-center gap-4 py-4 px-3 -mx-3 rounded-md transition-colors hover:bg-muted/50"
          >
            <div className="rounded-full bg-muted p-2.5 text-muted-foreground shrink-0">
              {receipt.origin === "whatsapp" ? (
                <MessageCircle className="size-5" />
              ) : (
                <ArrowUpFromLine className="size-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{name}</p>
              <p className="text-sm text-muted-foreground">
                {datetime ? `${datetime.date}, ${datetime.time}` : "—"}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-semibold text-success">
                {receipt.depositAmount != null
                  ? formatCurrency(receipt.depositAmount)
                  : "—"}
              </p>
              <Badge className={`text-[11px] ${status.badgeClass}`}>
                {status.label}
              </Badge>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
