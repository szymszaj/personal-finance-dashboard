"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type {
  FixedExpense,
  Transaction,
  MonthlySummary,
} from "@/types/database";
import DashboardHeader from "@/components/DashboardHeader";
import SummaryCards from "@/components/SummaryCards";
import ChartsSection from "@/components/ChartsSection";
import FormsSection from "@/components/FormsSection";
import TransactionList from "@/components/TransactionList";
import LoadingTransition from "@/components/transitions/LoadingTransition";

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const loadData = useCallback(
    async (userId: string, month: string) => {
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

      setTimeout(() => {
        setInitialLoad(false);
        setTimeout(() => setShowContent(true), 100);
      }, 300);
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

  if (!user || initialLoad) {
    return (
      <LoadingTransition
        title="Panel Finansowy"
        subtitle="Przygotowuję Twoje dane..."
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <DashboardHeader
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`transition-all duration-500 delay-100 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <SummaryCards summary={summary} />
        </div>

        <div
          className={`transition-all duration-500 delay-200 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <ChartsSection
            summary={summary}
            userId={user.id}
            month={currentMonth}
          />
        </div>

        <div
          className={`transition-all duration-500 delay-300 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <FormsSection
            userId={user.id}
            month={currentMonth}
            onSuccess={refreshData}
          />
        </div>

        <div
          className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-500 delay-[400ms] ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
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
