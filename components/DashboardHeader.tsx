"use client";

import { LogOut } from "lucide-react";

interface Props {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onLogout: () => void;
}

export default function DashboardHeader({
  currentMonth,
  onMonthChange,
  onLogout,
}: Props) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel Finansowy</h1>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
            />
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
