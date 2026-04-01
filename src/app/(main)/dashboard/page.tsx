import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleCheckBig,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { ReceiptsChart } from "@/components/dashboard/receipts-chart";
import { LatestReceipts } from "@/components/dashboard/latest-receipts";
import { UploadReceipt } from "@/components/dashboard/upload-receipt";
import Link from "next/link";

const summaryCards = [
  {
    label: "Recebido este mês",
    value: "R$ 1.570,50",
    icon: CircleCheckBig,
    iconClassName: "text-success bg-success-foreground",
  },
  {
    label: "A receber",
    value: "R$ 530,00",
    icon: Clock,
    iconClassName: "text-warning bg-warning-foreground",
  },
  {
    label: "Vencidos",
    value: "R$ 180,00",
    icon: AlertTriangle,
    iconClassName: "text-destructive bg-destructive-foreground",
  },
  {
    label: "Comprovantes processados",
    value: "10",
    icon: FileText,
    iconClassName: "text-primary bg-primary-foreground",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card
            key={card.label}
            className="flex items-center justify-between p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer"
          >
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <div className={`rounded-full p-2.5 ${card.iconClassName}`}>
              <card.icon className="size-5" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Recebimentos dos últimos 7 dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReceiptsChart />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">
              Últimos Comprovantes
            </CardTitle>
            <Link
              href="/receipts"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            <LatestReceipts />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Enviar Comprovante
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <UploadReceipt />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
