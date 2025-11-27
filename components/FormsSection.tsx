"use client";

import IncomeForm from "@/components/IncomeForm";
import FixedExpenseForm from "@/components/FixedExpenseForm";
import TransactionForm from "@/components/TransactionForm";

interface Props {
  userId: string;
  month: string;
  onSuccess: () => void;
}

export default function FormsSection({ userId, month, onSuccess }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Miesięczny zarobek</h2>
        <IncomeForm userId={userId} month={month} onSuccess={onSuccess} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Stałe wydatki</h2>
        <FixedExpenseForm userId={userId} month={month} onSuccess={onSuccess} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Nowa transakcja</h2>
        <TransactionForm userId={userId} month={month} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
