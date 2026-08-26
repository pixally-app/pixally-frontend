import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptsChart } from "@/components/dashboard/receipts-chart";
import { LatestReceipts } from "@/components/dashboard/latest-receipts";
import { UploadReceipt } from "@/components/dashboard/upload-receipt";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SummaryCards />

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
