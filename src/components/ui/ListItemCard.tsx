"use client";

import Link from "next/link";
import {
  RevenueIcon,
  ExpensesIcon,
} from "@/components/icons/FinanceIcons";
import type { Transaction } from "./RecentTransactions";
import type { Bill, BillStatus } from "./UpcomingBills";

const statusStyles: Record<BillStatus, { bg: string; text: string }> = {
  Pendente: {
    bg: "bg-[var(--feedback-warning-base)]/10",
    text: "text-[var(--feedback-warning-base)]",
  },
  Pago: {
    bg: "bg-[var(--feedback-success-base)]/10",
    text: "text-[var(--feedback-success-base)]",
  },
  Atrasado: {
    bg: "bg-[var(--feedback-error-base)]/10",
    text: "text-[var(--feedback-error-base)]",
  },
};

function TransactionIcon({ type }: { type: "income" | "expense" }) {
  const isIncome = type === "income";
  const colorVar = isIncome ? "--feedback-success-base" : "--feedback-error-base";
  const colorValue = isIncome ? "var(--feedback-success-lighter)" : "var(--feedback-error-lighter)";
  return (
    <div
      className="shrink-0 size-8 flex items-center justify-center [&_svg]:size-8"
      style={{ [colorVar]: colorValue } as React.CSSProperties}
    >
      {isIncome ? <RevenueIcon className="size-8" /> : <ExpensesIcon className="size-8" />}
    </div>
  );
}

const cardShellClasses =
  "bg-[var(--surface-card)] relative rounded-[var(--radius-lg)] w-full group transition-shadow duration-200 ease-out shadow-none hover:shadow-[var(--shadow-dropdown)]";
const cardBorderClasses =
  "absolute border border-[var(--neutral-100)] inset-0 pointer-events-none rounded-[var(--radius-lg)]";

/**
 * Card base compartilhado para itens de lista (transações e contas).
 * Usado internamente por TransactionItem e BillItem.
 */
function ListItemCard({ children, layout = "row" }: { children: React.ReactNode; layout?: "row" | "col" }) {
  return (
    <div className={`${cardShellClasses} shrink-0`}>
      <div aria-hidden="true" className={cardBorderClasses} />
      <div className={`flex ${layout === "row" ? "flex-row items-center" : "flex-col justify-center"} size-full relative z-10`}>
        {children}
      </div>
    </div>
  );
}

export interface TransactionItemProps {
  transaction: Transaction;
  /** Se informado, o card navega para esta URL ao ser clicado */
  href?: string;
}

/**
 * Item de transação (receita/despesa) para listas como Transações Recentes.
 */
export function TransactionItem({ transaction, href }: TransactionItemProps) {
  const content = (
    <ListItemCard layout="row">
      <div className="flex gap-2 items-center p-3 w-full min-w-0">
        <TransactionIcon type={transaction.type} />
        <div className="flex flex-1 min-w-0 gap-2 items-center justify-between">
          <div className="flex flex-1 min-w-0 flex-col items-start overflow-hidden">
            <p className="font-[var(--font-lexend)] font-normal text-[14px] text-[var(--neutral-700)] truncate w-full">
              {transaction.title}
            </p>
            <p className="font-[var(--font-lexend)] font-light text-[12px] text-[var(--neutral-text-muted)] truncate w-full">
              {transaction.date} • {transaction.category}
            </p>
          </div>
          <p className="font-[var(--font-lexend)] font-normal text-[14px] text-[var(--neutral-700)] tabular-nums shrink-0">
            {transaction.amount}
          </p>
        </div>
      </div>
    </ListItemCard>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full cursor-pointer">
        {content}
      </Link>
    );
  }
  return content;
}

export interface BillItemProps {
  bill: Bill;
  /** Se informado, o card navega para esta URL ao ser clicado */
  href?: string;
}

/**
 * Item de conta a pagar para listas como Próximas Contas.
 */
export function BillItem({ bill, href }: BillItemProps) {
  const statusStyle = statusStyles[bill.status];

  const content = (
    <ListItemCard layout="col">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 w-full min-w-0">
        <div className="flex flex-1 min-w-0 flex-col items-start gap-0.5">
          <p className="font-[var(--font-lexend)] font-normal text-[14px] text-[var(--neutral-text-strong)] truncate w-full max-w-full">
            {bill.description}
          </p>
          <p className="font-[var(--font-lexend)] font-light text-[12px] text-[var(--neutral-text-muted)]">
            {bill.dueDate}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0">
          <p className="font-[var(--font-lexend)] font-normal text-[14px] text-[var(--neutral-text-strong)] tabular-nums">
            {bill.amount}
          </p>
          <span
            className={`${statusStyle.bg} ${statusStyle.text} flex items-center justify-center px-3 py-0.5 rounded-[var(--radius-md)] shrink-0`}
          >
            <span className="font-[var(--font-lexend)] font-light text-[12px] leading-normal">
              {bill.status}
            </span>
          </span>
        </div>
      </div>
    </ListItemCard>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full cursor-pointer">
        {content}
      </Link>
    );
  }
  return content;
}
