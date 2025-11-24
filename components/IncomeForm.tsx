"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase";

interface Props {
  userId: string;
  month: string;
  onSuccess: () => void;
}

export default function IncomeForm({ userId, month, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const loadIncome = async () => {
      const { data } = await supabase
        .from("monthly_income")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .single();

      if (data) {
        setAmount(data.amount.toString());
        setDescription(data.description || "");
        setEditing(true);
      } else {
        setAmount("");
        setDescription("");
        setEditing(false);
      }
    };

    if (userId && month) {
      loadIncome();
    }
  }, [userId, month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editing) {
      // Aktualizuj istniejący wpis
      await supabase
        .from("monthly_income")
        .update({
          amount: parseFloat(amount),
          description,
        })
        .eq("user_id", userId)
        .eq("month", month);
    } else {
      // Dodaj nowy wpis
      await supabase.from("monthly_income").insert({
        user_id: userId,
        amount: parseFloat(amount),
        month,
        description,
      });
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kwota (zł)
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="5000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opis (opcjonalnie)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Pensja, bonus..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {loading ? "Zapisywanie..." : editing ? "Zaktualizuj" : "Dodaj"}
      </button>
    </form>
  );
}
