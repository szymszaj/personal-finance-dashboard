-- Tabela użytkowników (automatycznie zarządzana przez Supabase Auth)

-- Tabela miesięcznych zarobków
CREATE TABLE monthly_income (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Tabela stałych wydatków
CREATE TABLE fixed_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela transakcji (wydatki losowe, oszczędności)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'savings')),
  date DATE NOT NULL,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla lepszej wydajności
CREATE INDEX idx_monthly_income_user_month ON monthly_income(user_id, month);
CREATE INDEX idx_fixed_expenses_user_month ON fixed_expenses(user_id, month);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, month);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);

-- Row Level Security (RLS)
ALTER TABLE monthly_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla monthly_income
CREATE POLICY "Users can view their own income" ON monthly_income
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income" ON monthly_income
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income" ON monthly_income
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income" ON monthly_income
  FOR DELETE USING (auth.uid() = user_id);

-- Polityki RLS dla fixed_expenses
CREATE POLICY "Users can view their own fixed expenses" ON fixed_expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fixed expenses" ON fixed_expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fixed expenses" ON fixed_expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fixed expenses" ON fixed_expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Polityki RLS dla transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);
