"use client";

import { useRouter } from "next/navigation";
import { FinancialStats } from "@/components/ui/FinanceCards";
import { HorizontalBarChart } from "@/components/ui/HorizontalBarChart";
import { UpcomingBills } from "@/components/ui/UpcomingBills";
import { RecentTransactions } from "@/components/ui/RecentTransactions";
import { useFinance } from "@/contexts/FinanceContext";

export default function Home() {
  const router = useRouter();
  const {
    financialData,
    categoryChartData,
    recentTransactionsForDashboard,
    upcomingBillsForDashboard,
  } = useFinance();

  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-[var(--neutral-text-black)]">
          Dashboard
        </h1>
        <p className="mt-1 sm:mt-2 text-sm md:text-base text-[var(--neutral-text-muted)]">
          Bem-vindo ao FinControl. Visão geral das suas finanças.
        </p>
      </div>

      <FinancialStats data={financialData} />

      <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,400px)] gap-4 sm:gap-6 items-stretch w-full min-w-0">
        <div className="min-w-0 min-h-[280px] sm:min-h-[320px] lg:min-h-[400px] w-full overflow-hidden">
          <HorizontalBarChart
            data={categoryChartData}
            onViewDetails={() => router.push("/transacoes")}
            detailsHref="/transacoes"
          />
        </div>
        <UpcomingBills
          bills={upcomingBillsForDashboard}
          onViewDetails={() => router.push("/contas-fixas")}
          itemHref="/contas-fixas"
          className="w-full min-h-0"
        />
      </div>

      <div className="mt-4 sm:mt-6">
        <RecentTransactions
          transactions={recentTransactionsForDashboard}
          onViewDetails={() => router.push("/transacoes")}
          itemHref="/transacoes"
        />
      </div>
    </>
  );
}
