"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "25/03", valor: 1200 },
  { date: "26/03", valor: 1800 },
  { date: "27/03", valor: 750 },
  { date: "28/03", valor: 1500 },
  { date: "29/03", valor: 2100 },
  { date: "30/03", valor: 1350 },
  { date: "31/03", valor: 900 },
];

export function ReceiptsChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#717182", fontSize: 13 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#717182", fontSize: 13 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(10, 102, 255, 0.05)" }}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [
            `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            "Recebido",
          ]}
        />
        <Bar
          dataKey="valor"
          fill="#0A66FF"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
