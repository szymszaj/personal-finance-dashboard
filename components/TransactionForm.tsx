"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { format } from "date-fns";

interface Props {
  userId: string;
  month: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Jedzenie",
  "Transport",
  "Rozrywka",
  "Zakupy",
  "Zdrowie",
  "Edukacja",
  "Sport",
  "Prezenty",
  "Podróże",
  "Inne",
];

export default function TransactionForm({ userId, month, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"expense" | "savings">("expense");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from("transactions").insert({
      user_id: userId,
      amount: parseFloat(amount),
      category: type === "savings" ? "Oszczędności" : category,
      description,
      type,
      date,
      month,
    });

    setAmount("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setType("expense");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typ
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'expense' | 'savings')}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
        >
          <option value="expense">Wydatek</option>
          <option value="savings">Oszczędność</option>
        </select>
      </div>

      {type === "expense" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

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
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
          placeholder="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opis
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
          placeholder="Zakupy spożywcze"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 ${
          type === "expense"
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {loading
          ? "Dodawanie..."
          : type === "expense"
          ? "Dodaj wydatek"
          : "Dodaj oszczędność"}
      </button>
    </form>
  );
}
