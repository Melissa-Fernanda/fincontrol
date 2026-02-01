"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ArrowUpRight01Icon } from "@/components/icons";
import { BillItem } from "@/components/ui/ListItemCard";

export type BillStatus = "Pendente" | "Pago" | "Atrasado";

export interface Bill {
  id: string;
  description: string;
  dueDate: string;
  amount: string;
  status: BillStatus;
}

export const DEFAULT_BILLS: Bill[] = [
  { id: "bill-1", description: "Aluguel", dueDate: "Vence em 5 dias", amount: "R$ 2.800,00", status: "Pendente" },
  { id: "bill-2", description: "Conta de Luz", dueDate: "Vence em 3 dias", amount: "R$ 450,00", status: "Pendente" },
  { id: "bill-3", description: "Internet", dueDate: "Vence em 10 dias", amount: "R$ 120,00", status: "Pago" },
  { id: "bill-4", description: "Supermercado", dueDate: "Venceu há 2 dias", amount: "R$ 890,00", status: "Atrasado" },
  { id: "bill-5", description: "Plano de Saúde", dueDate: "Vence em 15 dias", amount: "R$ 650,00", status: "Pendente" },
  { id: "bill-6", description: "Academia", dueDate: "Vence em 7 dias", amount: "R$ 99,00", status: "Pendente" },
  { id: "bill-7", description: "Streaming", dueDate: "Vence em 12 dias", amount: "R$ 55,90", status: "Pendente" },
];

interface UpcomingBillsProps {
  bills?: Bill[];
  onViewDetails?: () => void;
  /** URL para onde os cards de conta redirecionam ao clicar (ex: /contas-fixas) */
  itemHref?: string;
  className?: string;
}

export function UpcomingBills({
  bills = DEFAULT_BILLS,
  onViewDetails,
  itemHref,
  className = "",
}: UpcomingBillsProps) {
  return (
    <div
      className={`bg-[var(--surface-card)] relative rounded-[var(--radius-lg)] w-full max-w-[400px] min-w-0 shrink-0 flex flex-col min-h-0 h-full border border-[var(--neutral-100)] shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex min-w-0 flex-col gap-4 p-4 rounded-[inherit] w-full flex-1 overflow-hidden h-full">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 w-full">
          <h2 className="font-[var(--font-lexend)] font-normal text-[18px] leading-[1.4] text-[var(--neutral-text-black)]">
            Próximas Contas
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
        {/* Bills List */}
        <div className="flex flex-1 min-h-0 flex-col gap-2 items-start w-full overflow-y-auto">
          {bills.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-4 px-4 text-center w-full">
              <p className="text-[16px] font-medium text-[var(--neutral-text-black)]">
                Nenhuma conta fixa
              </p>
              <p className="mt-1 text-[13px] font-light text-[var(--neutral-text-muted)] max-w-[260px]">
                Suas contas recorrentes aparecerão aqui. Cadastre na tela de Contas Fixas.
              </p>
              <div className="mt-4 w-full max-w-[280px] flex-1 min-h-0 flex items-center justify-center">
                <img
                  src="/images/sem-conta-fixa.svg"
                  alt=""
                  className="w-fit h-full object-contain opacity-90"
                />
              </div>
            </div>
          ) : (
            bills.map((bill) => (
              <BillItem key={bill.id} bill={bill} href={itemHref} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
