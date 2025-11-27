"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  LogOut,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";
import type {
  FixedExpense,
  Transaction,
  MonthlySummary,
} from "@/types/database";
import MonthlyChart from "@/components/MonthlyChart";
import ExpenseChart from "@/components/ExpenseChart";
import IncomeForm from "@/components/IncomeForm";
import FixedExpenseForm from "@/components/FixedExpenseForm";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const loadData = useCallback(
    async (userId: string, month: string) => {
      setLoading(true);

      const { data: incomeData } = await supabase
        .from("monthly_income")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .single();

      const { data: fixedExpensesData } = await supabase
        .from("fixed_expenses")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month);

      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .order("date", { ascending: false });

      const income = incomeData?.amount || 0;
      const fixedExpenses =
        fixedExpensesData?.reduce(
          (sum: number, exp: FixedExpense) => sum + Number(exp.amount),
          0
        ) || 0;
      const randomExpenses =
        transactionsData
          ?.filter((t: Transaction) => t.type === "expense")
          .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0) ||
        0;
      const savings =
        transactionsData
          ?.filter((t: Transaction) => t.type === "savings")
          .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0) ||
        0;

      setSummary({
        month,
        income,
        fixedExpenses,
        randomExpenses,
        savings,
        remaining: income - fixedExpenses - randomExpenses - savings,
      });

      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        loadData(user.id, currentMonth);
      }
    };
    getUser();
  }, [currentMonth, loadData, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const refreshData = () => {
    if (user) {
      loadData(user.id, currentMonth);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Panel Finansowy
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="month"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={20} />
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    (summary?.fixedExpenses || 0) +
                    (summary?.randomExpenses || 0)
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Podsumowanie miesięczne
            </h2>
            <MonthlyChart summary={summary} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Struktura wydatków</h2>
            <ExpenseChart userId={user.id} month={currentMonth} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Miesięczny zarobek</h2>
            <IncomeForm
              userId={user.id}
              month={currentMonth}
              onSuccess={refreshData}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Stałe wydatki</h2>
            <FixedExpenseForm
              userId={user.id}
              month={currentMonth}
              onSuccess={refreshData}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Nowa transakcja</h2>
            <TransactionForm
              userId={user.id}
              month={currentMonth}
              onSuccess={refreshData}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Historia transakcji</h2>
          <TransactionList
            userId={user.id}
            month={currentMonth}
            onUpdate={refreshData}
          />
        </div>
      </main>
    </div>
  );
}
