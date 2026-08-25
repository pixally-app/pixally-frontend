"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDashboardGraphic, type GraphicPoint } from "@/services/dashboard";

export function ReceiptsChart() {
  const isMobile = useIsMobile();
  const [data, setData] = useState<GraphicPoint[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getDashboardGraphic()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
        Não foi possível carregar os dados do gráfico.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 350 : 320}>
      <BarChart
        data={data}
        layout={isMobile ? "vertical" : "horizontal"}
        margin={{ top: 10, right: 10, left: isMobile ? 0 : -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={!isMobile}
          horizontal={isMobile}
          stroke="var(--border)"
        />
        {isMobile ? (
          <>
            <YAxis
              type="category"
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
              width={45}
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
            />
          </>
        )}
        <Tooltip
          cursor={{ fill: "color-mix(in srgb, var(--chart-1) 5%, transparent)" }}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [
            `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            "Recebido",
          ]}
        />
        <Bar
          dataKey="valor"
          fill="var(--chart-1)"
          radius={isMobile ? [0, 6, 6, 0] : [6, 6, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
