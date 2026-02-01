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
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold text-[var(--neutral-text-black)]">
          Dashboard
        </h1>
        <p className="mt-2 text-[var(--neutral-text-muted)]">
          Bem-vindo ao FinControl. Visão geral das suas finanças.
        </p>
      </div>

      <FinancialStats data={financialData} />

      <div className="mt-6 flex flex-col lg:flex-row gap-6 items-stretch min-h-[300px] sm:min-h-[400px] lg:min-h-[480px] lg:h-[480px]">
        <div className="flex-1 min-w-0 min-h-0 h-full">
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
          className="h-full"
        />
      </div>

      <div className="mt-6">
        <RecentTransactions
          transactions={recentTransactionsForDashboard}
          onViewDetails={() => router.push("/transacoes")}
          itemHref="/transacoes"
        />
      </div>
    </>
  );
}
