"use client";

import MonthlyChart from "@/components/MonthlyChart";
import ExpenseChart from "@/components/ExpenseChart";
import type { MonthlySummary } from "@/types/database";

interface Props {
  summary: MonthlySummary | null;
  userId: string;
  month: string;
}

export default function ChartsSection({ summary, userId, month }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Podsumowanie miesięczne</h2>
        <MonthlyChart summary={summary} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Struktura wydatków</h2>
        <ExpenseChart userId={userId} month={month} />
      </div>
    </div>
  );
}
