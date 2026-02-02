"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatCurrency, parseCurrency } from "@/lib/utils";
import type { FinancialData } from "@/components/ui/FinanceCards";
import type { Transaction } from "@/components/ui/RecentTransactions";
import type { Bill, BillStatus } from "@/components/ui/UpcomingBills";

// --- Tipos canônicos (fonte única da verdade) ---

export interface TransactionRow {
  id: string;
  description: string;
  category: string;
  date: string;
  paymentMethod: string;
  details: string;
  amount: number;
  type: "income" | "expense";
}

export interface FixedAccountItem {
  id: number;
  name: string;
  category: string;
  amount: string;
  recurrence: string;
  date: string;
  paymentMethod: string;
  isPaid: boolean;
}

// --- Helpers de data ---

const MONTH_NAMES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function parseDateDDMMYYYY(str: string): Date | null {
  const [d, m, y] = str.split("/").map(Number);
  if (!d || !m || !y) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function parseDateYYYYMMDD(str: string): Date | null {
  if (!str || str.length < 10) return null;
  const [y, m, d] = str.slice(0, 10).split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

/** Converte YYYY-MM-DD (modal) para DD/MM/YYYY (exibição) */
export function dateInputToDDMMYYYY(inputStr: string): string {
  if (!inputStr) return "";
  const d = parseDateYYYYMMDD(inputStr);
  if (!d) return inputStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function isCurrentMonth(dateStr: string, format: "ddmmyyyy" | "yyyymmdd"): boolean {
  const d = format === "ddmmyyyy" ? parseDateDDMMYYYY(dateStr) : parseDateYYYYMMDD(dateStr);
  if (!d) return false;
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function formatTransactionDateForDisplay(dateStr: string): string {
  const d = parseDateDDMMYYYY(dateStr);
  if (!d) return dateStr;
  return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}

function daysUntilDue(isoDate: string): number {
  const d = parseDateYYYYMMDD(isoDate);
  if (!d) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDueDateLabel(isoDate: string): string {
  const days = daysUntilDue(isoDate);
  if (days > 0) return `Vence em ${days} dias`;
  if (days === 0) return "Vence hoje";
  return `Venceu há ${Math.abs(days)} dias`;
}

// --- Dados iniciais (mesmos que estavam nas telas) ---

const INITIAL_TRANSACTIONS: TransactionRow[] = [
  { id: "1", description: "Salário Mensal", category: "Salário", date: "04/01/2025", paymentMethod: "PIX", details: "Pagamento mensal", amount: 8500, type: "income" },
  { id: "2", description: "Supermercado", category: "Alimentação", date: "05/01/2025", paymentMethod: "Cartão de Crédito", details: "Compras do mês", amount: -450, type: "expense" },
  { id: "3", description: "Internet", category: "Contas", date: "10/01/2025", paymentMethod: "Débito", details: "Provedor XYZ", amount: -150, type: "expense" },
  { id: "4", description: "Freelance", category: "Trabalho", date: "15/01/2025", paymentMethod: "PIX", details: "Projeto website", amount: 2000, type: "income" },
  { id: "5", description: "Academia", category: "Saúde", date: "20/01/2025", paymentMethod: "Débito", details: "Mensalidade", amount: -100, type: "expense" },
];

const INITIAL_FIXED_ACCOUNTS: FixedAccountItem[] = [
  { id: 1, name: "Aluguel", category: "Moradia", amount: "R$ 2.800,00", recurrence: "Mensal", date: "2025-01-04", paymentMethod: "PIX", isPaid: false },
  { id: 2, name: "Conta de Luz", category: "Moradia", amount: "R$ 450,00", recurrence: "Mensal", date: "2025-01-05", paymentMethod: "PIX", isPaid: false },
  { id: 3, name: "Internet", category: "Assinatura", amount: "R$ 120,00", recurrence: "Mensal", date: "2025-01-10", paymentMethod: "Débito", isPaid: true },
  { id: 4, name: "Netflix", category: "Assinatura", amount: "R$ 55,90", recurrence: "Mensal", date: "2025-01-04", paymentMethod: "Cartão de Crédito", isPaid: false },
  { id: 5, name: "Faculdade", category: "Estudo", amount: "R$ 1.200,00", recurrence: "Mensal", date: "2025-01-10", paymentMethod: "Débito", isPaid: false },
];

// --- localStorage ---

const STORAGE_KEY_TRANSACTIONS = "fincontrol-transactions";
const STORAGE_KEY_FIXED_ACCOUNTS = "fincontrol-fixed-accounts";
const STORAGE_KEY_LAST_MONTH = "fincontrol-last-month";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota/parse errors
  }
}

// --- Context ---

interface FinanceContextValue {
  transactions: TransactionRow[];
  fixedAccounts: FixedAccountItem[];
  addTransaction: (data: Omit<TransactionRow, "id">) => void;
  updateTransaction: (id: string, data: Partial<TransactionRow>) => void;
  deleteTransaction: (id: string) => void;
  addFixedAccount: (data: Omit<FixedAccountItem, "id" | "isPaid">) => void;
  updateFixedAccount: (id: number, data: Partial<FixedAccountItem>) => void;
  deleteFixedAccount: (id: number) => void;
  markFixedAccountPaid: (id: number) => void;
  financialData: FinancialData;
  categoryChartData: { category: string; value: number; amount?: number }[];
  recentTransactionsForDashboard: Transaction[];
  upcomingBillsForDashboard: Bill[];
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<TransactionRow[]>(() =>
    loadFromStorage(STORAGE_KEY_TRANSACTIONS, INITIAL_TRANSACTIONS)
  );
  const [fixedAccounts, setFixedAccounts] = useState<FixedAccountItem[]>(() =>
    loadFromStorage(STORAGE_KEY_FIXED_ACCOUNTS, INITIAL_FIXED_ACCOUNTS)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY_TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_FIXED_ACCOUNTS, fixedAccounts);
  }, [fixedAccounts]);

  // Reset contas fixas ao mudar o mês (isPaid: false, datas atualizadas para o mês atual)
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const lastMonth = loadFromStorage(STORAGE_KEY_LAST_MONTH, "");

    if (lastMonth && lastMonth !== currentMonth) {
      setFixedAccounts((prev) => {
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return prev.map((f) => {
          const d = parseDateYYYYMMDD(f.date);
          const day = Math.min(d ? d.getDate() : 1, lastDayOfMonth);
          const newDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          return { ...f, isPaid: false, date: newDate };
        });
      });
    }
    saveToStorage(STORAGE_KEY_LAST_MONTH, currentMonth);
  }, []);

  const addTransaction = useCallback((data: Omit<TransactionRow, "id">) => {
    setTransactions((prev) => {
      const nextId = String(Math.max(0, ...prev.map((t) => parseInt(t.id, 10) || 0)) + 1);
      return [...prev, { ...data, id: nextId }];
    });
  }, []);

  const updateTransaction = useCallback((id: string, data: Partial<TransactionRow>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addFixedAccount = useCallback((data: Omit<FixedAccountItem, "id" | "isPaid">) => {
    setFixedAccounts((prev) => [
      ...prev,
      {
        ...data,
        id: Math.max(0, ...prev.map((i) => i.id)) + 1,
        isPaid: false,
      },
    ]);
  }, []);

  const updateFixedAccount = useCallback((id: number, data: Partial<FixedAccountItem>) => {
    setFixedAccounts((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i))
    );
  }, []);

  const deleteFixedAccount = useCallback((id: number) => {
    setFixedAccounts((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const markFixedAccountPaid = useCallback((id: number) => {
    setFixedAccounts((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isPaid: true } : i))
    );
  }, []);

  const financialData = useMemo((): FinancialData => {
    // Saldo: entradas/saídas das transações menos contas fixas marcadas como pagas
    const transactionsBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const paidFixedAmount = fixedAccounts
      .filter((f) => f.isPaid)
      .reduce((acc, f) => acc + parseCurrency(f.amount), 0);
    const balanceTotal = transactionsBalance - paidFixedAmount;

    const revenueMonth = transactions
      .filter((t) => t.type === "income" && isCurrentMonth(t.date, "ddmmyyyy"))
      .reduce((acc, t) => acc + t.amount, 0);
    const expensesMonth = transactions
      .filter((t) => t.type === "expense" && isCurrentMonth(t.date, "ddmmyyyy"))
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const badgeBalance = { text: "Saldo consolidado", variant: "neutral" as const };

    const alertExpenses = expensesMonth > revenueMonth && revenueMonth > 0
      ? { label: "Atenção", message: "Gastos elevados", variant: "error" as const, showIcon: true }
      : undefined;

    return {
      balance: {
        amount: formatCurrency(balanceTotal),
        badge: badgeBalance,
      },
      revenue: {
        amount: formatCurrency(revenueMonth),
        badge: { text: "Consolidado do mês atual", variant: "neutral" },
      },
      expenses: {
        amount: formatCurrency(expensesMonth),
        alert: alertExpenses,
      },
    };
  }, [transactions, fixedAccounts]);

  const categoryChartData = useMemo(() => {
    const byCategory = new Map<string, number>();

    // Transações: despesas do mês por categoria
    transactions
      .filter((t) => t.type === "expense" && isCurrentMonth(t.date, "ddmmyyyy"))
      .forEach((t) => {
        byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + Math.abs(t.amount));
      });

    // Contas fixas: valor por categoria (cadastradas na categoria)
    fixedAccounts.forEach((f) => {
      const amount = parseCurrency(f.amount);
      byCategory.set(f.category, (byCategory.get(f.category) ?? 0) + amount);
    });

    const total = [...byCategory.values()].reduce((a, b) => a + b, 0);
    if (total === 0) return [];
    return [...byCategory.entries()]
      .map(([category, amount]) => ({
        category,
        value: Math.round((amount / total) * 100),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, fixedAccounts]);

  const recentTransactionsForDashboard = useMemo((): Transaction[] => {
    const sorted = [...transactions].sort((a, b) => {
      const da = parseDateDDMMYYYY(a.date)?.getTime() ?? 0;
      const db = parseDateDDMMYYYY(b.date)?.getTime() ?? 0;
      return db - da;
    });
    return sorted.slice(0, 12).map((t) => ({
      id: parseInt(t.id, 10) || 0,
      title: t.description,
      date: formatTransactionDateForDisplay(t.date),
      category: t.category,
      amount: t.amount >= 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount),
      type: t.type,
    }));
  }, [transactions]);

  const upcomingBillsForDashboard = useMemo((): Bill[] => {
    const sorted = [...fixedAccounts].sort((a, b) => {
      const da = parseDateYYYYMMDD(a.date)?.getTime() ?? 0;
      const db = parseDateYYYYMMDD(b.date)?.getTime() ?? 0;
      return da - db;
    });
    return sorted.slice(0, 10).map((item) => {
      let status: BillStatus = "Pendente";
      if (item.isPaid) status = "Pago";
      else if (daysUntilDue(item.date) < 0) status = "Atrasado";
      return {
        id: `bill-${item.id}`,
        description: item.name,
        dueDate: formatDueDateLabel(item.date),
        amount: item.amount,
        status,
      };
    });
  }, [fixedAccounts]);

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      fixedAccounts,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addFixedAccount,
      updateFixedAccount,
      deleteFixedAccount,
      markFixedAccountPaid,
      financialData,
      categoryChartData,
      recentTransactionsForDashboard,
      upcomingBillsForDashboard,
    }),
    [
      transactions,
      fixedAccounts,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addFixedAccount,
      updateFixedAccount,
      deleteFixedAccount,
      markFixedAccountPaid,
      financialData,
      categoryChartData,
      recentTransactionsForDashboard,
      upcomingBillsForDashboard,
    ]
  );

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
