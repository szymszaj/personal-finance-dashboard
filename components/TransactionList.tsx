"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import type { Transaction } from "@/types/database";

interface Props {
  userId: string;
  month: string;
  onUpdate: () => void;
}

export default function TransactionList({ userId, month, onUpdate }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month)
      .order("date", { ascending: false });

    setTransactions(data || []);
    setLoading(false);
  }, [userId, month, supabase]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleDelete = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tę transakcję?")) {
      await supabase.from("transactions").delete().eq("id", id);
      loadTransactions();
      onUpdate();
    }
  };

  if (loading) {
    return <div className="text-center py-4">Ładowanie...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        Brak transakcji w tym miesiącu
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  transaction.type === "expense"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {transaction.type === "expense" ? "Wydatek" : "Oszczędność"}
              </span>
              <span className="text-sm text-gray-500">
                {transaction.category}
              </span>
            </div>
            <p className="mt-1 font-medium text-gray-900">
              {transaction.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(transaction.date), "d MMMM yyyy", {
                locale: pl,
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-900">
              {transaction.amount.toLocaleString("pl-PL")} zł
            </span>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="text-red-600 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
              title="Usuń"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
