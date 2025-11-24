"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

interface Props {
  userId: string;
  month: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Czynsz",
  "Rachunki",
  "Internet",
  "Telefon",
  "Ubezpieczenia",
  "Subskrypcje",
  "Transport",
  "Kredyt",
  "Inne",
];

export default function FixedExpenseForm({ userId, month, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("fixed_expenses").insert({
      user_id: userId,
      name,
      amount: parseFloat(amount),
      category,
      month,
    });

    setName("");
    setAmount("");
    setCategory(CATEGORIES[0]);
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nazwa
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Czynsz mieszkania"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategoria
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

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
          placeholder="1500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {loading ? "Dodawanie..." : "Dodaj wydatek"}
      </button>
    </form>
  );
}
