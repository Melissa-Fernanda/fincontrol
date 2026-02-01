"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ArrowUpRight01Icon } from "@/components/icons";
import { TransactionItem } from "@/components/ui/ListItemCard";

export interface Transaction {
  id: number;
  title: string;
  date: string;
  category: string;
  amount: string;
  type: "income" | "expense";
}

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 1, title: "Salário Mensal", date: "04 de janeiro", category: "Salário", amount: "+R$ 8.500,00", type: "income" },
  { id: 2, title: "Salário Mensal", date: "04 de janeiro", category: "Salário", amount: "+R$ 8.500,00", type: "income" },
  { id: 3, title: "Salário Mensal", date: "04 de janeiro", category: "Salário", amount: "+R$ 8.500,00", type: "income" },
  { id: 4, title: "Gasto em Moradia", date: "18 de janeiro", category: "Moradia", amount: "-R$ 16,00", type: "expense" },
  { id: 5, title: "Gasto em Moradia", date: "18 de janeiro", category: "Moradia", amount: "-R$ 16,00", type: "expense" },
  { id: 6, title: "Gasto em Moradia", date: "18 de janeiro", category: "Moradia", amount: "-R$ 16,00", type: "expense" },
  { id: 7, title: "Gasto em Moradia", date: "18 de janeiro", category: "Moradia", amount: "-R$ 16,00", type: "expense" },
  { id: 8, title: "Freelance", date: "20 de janeiro", category: "Trabalho", amount: "+R$ 2.000,00", type: "income" },
  { id: 9, title: "Internet", date: "21 de janeiro", category: "Contas", amount: "-R$ 150,00", type: "expense" },
  { id: 10, title: "Supermercado", date: "22 de janeiro", category: "Alimentação", amount: "-R$ 450,00", type: "expense" },
  { id: 11, title: "Uber", date: "23 de janeiro", category: "Transporte", amount: "-R$ 25,00", type: "expense" },
  { id: 12, title: "Academia", date: "25 de janeiro", category: "Saúde", amount: "-R$ 100,00", type: "expense" },
];

interface RecentTransactionsProps {
  transactions?: Transaction[];
  onViewDetails?: () => void;
  /** URL para onde os cards de transação redirecionam ao clicar (ex: /transacoes) */
  itemHref?: string;
  className?: string;
}

export function RecentTransactions({
  transactions = DEFAULT_TRANSACTIONS,
  onViewDetails,
  itemHref,
  className = "",
}: RecentTransactionsProps) {
  return (
    <div
      className={`bg-[var(--surface-card)] relative rounded-[var(--radius-lg)] w-full border border-[var(--neutral-100)] shadow-[var(--shadow-card)] min-h-[400px] flex flex-col ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute border border-[var(--neutral-100)] inset-0 pointer-events-none rounded-[var(--radius-lg)]"
      />
      <div className="flex flex-col gap-4 p-4 rounded-[inherit] w-full flex-1 min-h-0 z-10">
        <div className="flex items-center justify-between shrink-0 w-full">
          <h2 className="font-[var(--font-lexend)] font-normal text-[18px] leading-[1.4] text-[var(--neutral-text-black)]">
            Transações Recentes
          </h2>
          {itemHref ? (
            <Link
              href={itemHref}
              className="bg-[var(--neutral-75)] hover:bg-[var(--neutral-100)] transition-colors cursor-pointer flex gap-2 items-center justify-center px-2 py-1.5 rounded-xl shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)]"
            >
              <span className="font-[var(--font-lexend)] font-light text-[14px] leading-[1.4] text-[var(--neutral-text-strong)]">
                Ver detalhes
              </span>
              <Icon icon={ArrowUpRight01Icon} size={14} className="text-[var(--neutral-text-strong)] shrink-0" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onViewDetails}
              className="bg-[var(--neutral-75)] hover:bg-[var(--neutral-100)] transition-colors cursor-pointer flex gap-2 items-center justify-center px-2 py-1.5 rounded-xl shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)]"
            >
              <span className="font-[var(--font-lexend)] font-light text-[14px] leading-[1.4] text-[var(--neutral-text-strong)]">
                Ver detalhes
              </span>
              <Icon icon={ArrowUpRight01Icon} size={14} className="text-[var(--neutral-text-strong)] shrink-0" />
            </button>
          )}
        </div>
        <div className="flex flex-1 min-h-0 flex-col gap-2 items-start w-full overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-4 px-4 text-center w-full">
              <p className="text-[16px] font-medium text-[var(--neutral-text-black)]">
                Nenhuma transação
              </p>
              <p className="mt-1 text-[13px] font-light text-[var(--neutral-text-muted)] w-full">
                Suas movimentações aparecerão aqui. Adicione transações na tela de Transações.
              </p>
              <div className="mt-4 w-full max-w-[280px] flex-1 min-h-0 flex items-center justify-center">
                <img
                  src="/images/sem-transacoes.svg"
                  alt=""
                  className="w-fit h-full object-contain opacity-90"
                />
              </div>
            </div>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} href={itemHref} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
