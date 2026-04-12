"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReceiptDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/receipts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Detalhes do Comprovante</h1>
        <p className="text-sm text-muted-foreground">
          ID da Transação PIX: F34567890123456789012345678901BC
        </p>
      </div>
    </div>
  );
}
