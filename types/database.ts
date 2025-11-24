export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface MonthlyIncome {
  id: string;
  user_id: string;
  amount: number;
  month: string; // Format: YYYY-MM
  description?: string;
  created_at: string;
}

export interface FixedExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: string;
  month: string; // Format: YYYY-MM
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  type: "expense" | "income" | "savings";
  date: string;
  month: string; // Format: YYYY-MM
  created_at: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  fixedExpenses: number;
  randomExpenses: number;
  savings: number;
  remaining: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}
