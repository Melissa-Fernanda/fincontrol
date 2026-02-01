import { TransactionsTable } from "@/components/ui/TransactionsTable";

export default function TransacoesPage() {
  return (
    <>
      <div className="mb-6 shrink-0">
        <h1 className="text-[32px] font-semibold text-[var(--neutral-text-black)]">
          Transações
        </h1>
        <p className="mt-2 text-[var(--neutral-text-muted)]">
          Consulte, filtre e gerencie todas as suas movimentações financeiras.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <TransactionsTable />
      </div>
    </>
  );
}
