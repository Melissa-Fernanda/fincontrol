import { TransactionsTable } from "@/components/ui/TransactionsTable";

export default function TransacoesPage() {
  return (
    <>
      <div className="mb-4 sm:mb-6 shrink-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-[var(--neutral-text-black)]">
          Transações
        </h1>
        <p className="mt-1 sm:mt-2 text-sm md:text-base text-[var(--neutral-text-muted)]">
          Consulte, filtre e gerencie todas as suas movimentações financeiras.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <TransactionsTable />
      </div>
    </>
  );
}
