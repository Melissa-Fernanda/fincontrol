"use client";

import {
  BalanceCard,
  RevenueCard,
  ExpensesCard,
} from "@/components/ui/FinanceCards";
import { Icon } from "@/components/ui/Icon";
import {
  MoneyExchange03Icon,
  Calendar01Icon,
  AlertCircleIcon,
} from "@/components/icons";
import { UpcomingDueDates } from "@/components/ui/UpcomingDueDates";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency, parseCurrency } from "@/lib/utils";

export default function ContasFixasPage() {
  const { fixedAccounts, financialData } = useFinance();

  const totalComprometidoNum = fixedAccounts.reduce(
    (acc, item) => acc + parseCurrency(item.amount),
    0
  );
  const totalComprometido = formatCurrency(totalComprometidoNum);

  const paidCount = fixedAccounts.filter((i) => i.isPaid).length;
  const totalCount = fixedAccounts.length;
  const pendencias = `${paidCount}/${totalCount}`;
  const pctPago = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  const revenueNum = parseCurrency(financialData.revenue.amount);
  const impactoPct = revenueNum > 0
    ? Math.round((totalComprometidoNum / revenueNum) * 100)
    : 0;
  const impactoOrcamento =
    revenueNum > 0 ? `${impactoPct}% da Renda` : "Impacto na renda";
  const alertImpacto =
    impactoPct > 50
      ? { label: `${impactoPct}% da Renda`, message: "", variant: "error" as const, showIcon: true }
      : undefined;

  return (
    <>
      <div className="mb-6 shrink-0">
        <h1 className="text-[32px] font-semibold text-[var(--neutral-text-black)]">
          Contas Fixas
        </h1>
        <p className="mt-2 text-[var(--neutral-text-muted)]">
          Gerencie suas contas recorrentes e acompanhe os vencimentos mensais.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full min-w-0 items-stretch shrink-0">
        <BalanceCard
          title="Total Comprometido"
          balance={totalComprometido}
          badge={{ text: "Mensal", variant: "neutral" }}
          icon={
            <Icon icon={MoneyExchange03Icon} size={24} className="text-white shrink-0" />
          }
        />
        <RevenueCard
          title="Pendências"
          amount={pendencias}
          badge={{ text: `${pctPago}% Pago`, variant: "neutral" }}
          icon={
            <Icon icon={Calendar01Icon} size={24} className="text-amber-500 shrink-0" />
          }
        />
        <ExpensesCard
          title="Impacto no Orçamento"
          amount={impactoOrcamento}
          alert={alertImpacto}
          icon={
            <Icon icon={AlertCircleIcon} size={24} className="text-[var(--feedback-error-base)] shrink-0" />
          }
        />
      </div>

      <div className="mt-6 flex-1 min-h-0 flex flex-col">
        <UpcomingDueDates />
      </div>
    </>
  );
}
