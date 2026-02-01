import { type ReactNode } from "react";
import { WalletIcon, RevenueIcon, ExpensesIcon } from "@/components/icons/FinanceIcons";
import { Icon } from "@/components/ui/Icon";
import { AlertCircleIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface BalanceCardProps {
  title?: string;
  balance: string;
  badge?: {
    text: string;
    variant?: "neutral" | "success" | "warning";
  };
  icon?: ReactNode;
}

export function BalanceCard({ 
  title = "Saldo Atual", 
  balance, 
  badge,
  icon = <WalletIcon className="w-6 h-6 text-white" />
}: BalanceCardProps) {
  return (
    <div className="bg-[var(--brand-base)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-4 sm:p-3 min-w-0 flex-1 flex flex-col gap-3 font-[var(--font-lexend)] overflow-hidden">
      <div className="flex items-center justify-between w-full min-w-0 gap-2">
        <p className="font-light text-xs sm:text-sm text-white truncate shrink min-w-0">{title}</p>
        <span className="shrink-0">{icon}</span>
      </div>
      <p className="font-medium text-xl sm:text-2xl text-white tabular-nums break-words min-w-0 overflow-visible leading-tight">{balance}</p>
      {badge && (
        <Badge variant={badge.variant || "neutral"} className="bg-white/10 text-white truncate max-w-full text-xs sm:text-sm">
          {badge.text}
        </Badge>
      )}
    </div>
  );
}

interface RevenueCardProps {
  title?: string;
  amount: string;
  badge?: {
    text: string;
    variant?: "neutral" | "success" | "info";
  };
  icon?: ReactNode;
}

export function RevenueCard({ 
  title = "Receitas (Mês)", 
  amount, 
  badge,
  icon = <RevenueIcon className="w-6 h-6" />
}: RevenueCardProps) {
  return (
    <div className="bg-[var(--neutral-25)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-4 sm:p-3 min-w-0 flex-1 flex flex-col gap-3 font-[var(--font-lexend)] border border-[var(--neutral-100)] overflow-hidden">
      <div className="flex items-center justify-between w-full min-w-0 gap-2">
        <p className="font-light text-xs sm:text-sm text-[var(--neutral-700)] truncate shrink min-w-0">{title}</p>
        <span className="shrink-0">{icon}</span>
      </div>
      <p className="font-medium text-xl sm:text-2xl text-[var(--neutral-950)] tabular-nums break-words min-w-0 overflow-visible leading-tight">{amount}</p>
      {badge && (
        <Badge variant={badge.variant || "neutral"} className="bg-[var(--neutral-75)] truncate max-w-full text-xs sm:text-sm">
          {badge.text}
        </Badge>
      )}
    </div>
  );
}

interface ExpensesCardProps {
  title?: string;
  amount: string;
  alert?: {
    label: string;
    message: string;
    variant?: BadgeVariant;
    showIcon?: boolean;
  };
  icon?: ReactNode;
}

export function ExpensesCard({ 
  title = "Despesas (Mês)", 
  amount, 
  alert,
  icon = <ExpensesIcon className="w-6 h-6" />
}: ExpensesCardProps) {
  return (
    <div className="bg-[var(--neutral-25)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-4 sm:p-3 min-w-0 flex-1 flex flex-col gap-3 font-[var(--font-lexend)] border border-[var(--neutral-100)] overflow-hidden">
      <div className="flex items-center justify-between w-full min-w-0 gap-2">
        <p className="font-light text-xs sm:text-sm text-[var(--neutral-700)] truncate shrink min-w-0">{title}</p>
        <span className="shrink-0">{icon}</span>
      </div>
      <p className="font-medium text-xl sm:text-2xl text-[var(--neutral-950)] tabular-nums break-words min-w-0 overflow-visible leading-tight">{amount}</p>
      {alert && (
        <Badge
          variant={alert.variant || "error"}
          leftIcon={alert.showIcon !== false ? <Icon icon={AlertCircleIcon} size={16} /> : undefined}
          className="truncate max-w-full text-xs sm:text-sm"
        >
          <span className="font-medium truncate">{alert.label}</span>
          {alert.message ? <span className="truncate"> {alert.message}</span> : null}
        </Badge>
      )}
    </div>
  );
}

// Tipos para os dados financeiros
export interface FinancialData {
  balance: {
    amount: string;
    badge?: {
      text: string;
      variant?: "neutral" | "success" | "warning";
    };
  };
  revenue: {
    amount: string;
    badge?: {
      text: string;
      variant?: "neutral" | "success" | "info";
    };
  };
  expenses: {
    amount: string;
    alert?: {
      label: string;
      message: string;
      variant?: BadgeVariant;
      showIcon?: boolean;
    };
  };
}

interface FinancialStatsProps {
  data: FinancialData;
}

export function FinancialStats({ data }: FinancialStatsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full min-w-0 items-stretch">
      <BalanceCard 
        balance={data.balance.amount} 
        badge={data.balance.badge}
      />
      <RevenueCard 
        amount={data.revenue.amount} 
        badge={data.revenue.badge}
      />
      <ExpensesCard 
        amount={data.expenses.amount} 
        alert={data.expenses.alert}
      />
    </div>
  );
}
