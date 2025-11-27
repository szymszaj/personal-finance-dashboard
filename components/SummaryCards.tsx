"use client";

import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import type { MonthlySummary } from "@/types/database";

interface Props {
  summary: MonthlySummary | null;
}

export default function SummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Dochód</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary?.income.toLocaleString("pl-PL")} zł
            </p>
          </div>
          <TrendingUp className="text-green-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Wydatki</p>
            <p className="text-2xl font-bold text-gray-900">
              {(
                (summary?.fixedExpenses || 0) + (summary?.randomExpenses || 0)
              ).toLocaleString("pl-PL")}{" "}
              zł
            </p>
          </div>
          <TrendingDown className="text-red-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Oszczędności</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary?.savings.toLocaleString("pl-PL")} zł
            </p>
          </div>
          <PiggyBank className="text-blue-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Pozostało</p>
            <p
              className={`text-2xl font-bold ${
                (summary?.remaining || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {summary?.remaining.toLocaleString("pl-PL")} zł
            </p>
          </div>
          <Wallet className="text-purple-500" size={32} />
        </div>
      </div>
    </div>
  );
}
