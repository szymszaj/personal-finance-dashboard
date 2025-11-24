"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { createSupabaseClient } from "@/lib/supabase";
import type { Transaction, FixedExpense } from "@/types/database";

interface Props {
  userId: string;
  month: string;
}

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function ExpenseChart({ userId, month }: Props) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const loadExpenses = async () => {
      const { data: fixedExpenses } = await supabase
        .from("fixed_expenses")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .eq("type", "expense");

      const categoryMap = new Map<string, number>();

      fixedExpenses?.forEach((exp: FixedExpense) => {
        const current = categoryMap.get(exp.category) || 0;
        categoryMap.set(exp.category, current + Number(exp.amount));
      });

      transactions?.forEach((trans: Transaction) => {
        const current = categoryMap.get(trans.category) || 0;
        categoryMap.set(trans.category, current + Number(trans.amount));
      });

      const chartData = Array.from(categoryMap.entries()).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      setData(chartData);
    };

    if (userId && month) {
      loadExpenses();
    }
  }, [userId, month]);

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        Brak wydatków w tym miesiącu
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${Number(value).toLocaleString("pl-PL")} zł`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
