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
import type { MonthlySummary } from "@/types/database";

interface Props {
  summary: MonthlySummary | null;
}

export default function MonthlyChart({ summary }: Props) {
  if (!summary) {
    return (
      <div className="text-gray-500 text-center py-8">
        Brak danych do wyświetlenia
      </div>
    );
  }

  const data = [
    {
      name: "Dochód",
      wartość: summary.income,
      fill: "#10b981",
    },
    {
      name: "Wydatki stałe",
      wartość: summary.fixedExpenses,
      fill: "#ef4444",
    },
    {
      name: "Wydatki losowe",
      wartość: summary.randomExpenses,
      fill: "#f59e0b",
    },
    {
      name: "Oszczędności",
      wartość: summary.savings,
      fill: "#3b82f6",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => `${Number(value).toLocaleString("pl-PL")} zł`}
        />
        <Bar dataKey="wartość" />
      </BarChart>
    </ResponsiveContainer>
  );
}
