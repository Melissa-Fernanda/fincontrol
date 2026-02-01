"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { DatePicker } from "@/components/ui/DatePicker";
import { TransactionModal } from "@/components/ui/TransactionModal";
import {
  Search01Icon,
  Tag01Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
} from "@/components/icons";
import { RevenueIcon, ExpensesIcon } from "@/components/icons/FinanceIcons";
import { formatCurrency } from "@/lib/utils";
import { useFinance, dateInputToDDMMYYYY, type TransactionRow } from "@/contexts/FinanceContext";

function parseDateDDMMYYYY(str: string): Date | null {
  const [d, m, y] = str.split("/").map(Number);
  if (!d || !m || !y) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function formatDateToInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatInputToDDMMYYYY(inputStr: string): string {
  if (!inputStr) return "";
  const [y, m, d] = inputStr.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export type { TransactionRow } from "@/contexts/FinanceContext";

const CATEGORY_ALL = "";

export function TransactionsTable() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
  } = useFinance();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(CATEGORY_ALL);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))).sort(),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const match =
          tx.description.toLowerCase().includes(query) ||
          tx.category.toLowerCase().includes(query) ||
          tx.details.toLowerCase().includes(query) ||
          tx.paymentMethod.toLowerCase().includes(query);
        if (!match) return false;
      }
      if (categoryFilter !== CATEGORY_ALL && tx.category !== categoryFilter)
        return false;
      const txDate = parseDateDDMMYYYY(tx.date);
      if (txDate && dateStart) {
        const start = new Date(dateStart);
        if (txDate < start) return false;
      }
      if (txDate && dateEnd) {
        const end = new Date(dateEnd);
        end.setHours(23, 59, 59, 999);
        if (txDate > end) return false;
      }
      return true;
    });
  }, [transactions, searchQuery, categoryFilter, dateStart, dateEnd]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      )
        setCategoryOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node))
        setDateOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateLabel =
    dateStart && dateEnd
      ? `${formatInputToDDMMYYYY(dateStart)} - ${formatInputToDDMMYYYY(dateEnd)}`
      : "00/00/0000 - 00/00/0000";

  return (
    <div className="w-full h-full min-h-0 min-w-0 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--neutral-100)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col font-['Lexend']">
      {/* Header Filters */}
      <div className="p-4 flex flex-wrap items-center gap-[10px] w-full border-b border-[var(--neutral-75)] shrink-0">
        {/* Search */}
        <div className="flex-1 min-w-[200px] h-[var(--height-control)] relative bg-[var(--surface-input)] rounded-[var(--radius-md)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 focus-within:border-[var(--neutral-stroke-muted)] transition-colors">
          <Icon icon={Search01Icon} size={20} className="text-[var(--neutral-icons-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Faça sua busca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-[14px] text-[var(--neutral-700)] placeholder:text-[var(--neutral-text-muted)] font-light"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button
            type="button"
            onClick={() => {
              setDateOpen(false);
              setCategoryOpen((o) => !o);
            }}
            className="h-[var(--height-control)] px-4 bg-[var(--surface-input)] rounded-[var(--radius-md)] border border-[var(--neutral-100)] flex items-center gap-2 text-[var(--neutral-text-muted)] hover:bg-[var(--neutral-75)] active:bg-[var(--neutral-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] transition-colors"
          >
            <Icon icon={Tag01Icon} size={20} className="shrink-0" />
            <span className="text-[14px] font-light">
              {categoryFilter === CATEGORY_ALL ? "Categoria" : categoryFilter}
            </span>
            <Icon icon={ArrowDown01Icon} size={12} className="ml-1 shrink-0" />
          </button>
          {categoryOpen && (
            <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-[var(--surface-card)] rounded-[var(--radius-md)] border border-[var(--neutral-100)] shadow-[var(--shadow-dropdown)] py-1 z-10">
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter(CATEGORY_ALL);
                  setCategoryOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-[14px] font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(cat);
                    setCategoryOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-[14px] font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="relative" ref={dateRef}>
          <button
            type="button"
            onClick={() => {
              setCategoryOpen(false);
              setDateOpen((o) => !o);
            }}
            className="h-[var(--height-control)] px-4 bg-[var(--surface-input)] rounded-[var(--radius-md)] border border-[var(--neutral-100)] flex items-center gap-2 text-[var(--neutral-text-muted)] hover:bg-[var(--neutral-75)] active:bg-[var(--neutral-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] transition-colors"
          >
            <Icon icon={Calendar01Icon} size={20} className="shrink-0" />
            <span className="text-[14px] font-light whitespace-nowrap">{dateLabel}</span>
            <Icon icon={ArrowDown01Icon} size={12} className="ml-1 shrink-0" />
          </button>
          {dateOpen && (
            <div className="absolute top-full right-0 mt-1 w-[280px] rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-dropdown)] z-10 flex flex-col gap-3 font-['Lexend']">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-light text-[var(--neutral-text-muted)]">De</label>
                <DatePicker
                  id="transactions-date-start"
                  value={dateStart}
                  onChange={setDateStart}
                  placeholder="dd/mm/aaaa"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-light text-[var(--neutral-text-muted)]">Até</label>
                <DatePicker
                  id="transactions-date-end"
                  value={dateEnd}
                  onChange={setDateEnd}
                  placeholder="dd/mm/aaaa"
                />
              </div>
              {(dateStart || dateEnd) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateStart("");
                    setDateEnd("");
                  }}
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--neutral-75)] py-2.5 text-[14px] font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-100)] active:bg-[var(--neutral-200)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] transition-colors"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          )}
        </div>

        {/* New Transaction Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-[var(--height-control)] px-4 bg-[var(--brand-base)] rounded-[var(--radius-md)] flex items-center gap-2 text-white hover:opacity-90 active:scale-[0.98] active:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] transition-all duration-150 ease-out shadow-[var(--shadow-card)]"
        >
          <Icon icon={Add01Icon} size={20} className="shrink-0" />
          <span className="text-[14px] font-normal">Nova Transação</span>
        </button>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          addTransaction({
            description: data.name.trim() || "Sem título",
            category: data.category,
            date: dateInputToDDMMYYYY(data.date),
            paymentMethod: data.paymentMethod,
            details: data.description.trim(),
            amount: data.amount,
            type: data.type,
          });
          setModalOpen(false);
        }}
      />

      {/* Table wrapper: scroll horizontal quando necessário */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 flex flex-col gap-2 bg-[var(--surface-input)]">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-1 min-h-0 flex-col items-center justify-center py-12 pt-4 px-4 text-center">
              <p className="text-[18px] font-medium text-[var(--neutral-text-black)]">
                Nenhuma transação cadastrada
              </p>
              <p className="mt-2 text-[14px] font-light text-[var(--neutral-text-muted)] max-w-[480px]">
                Adicione sua primeira transação para acompanhar entradas e saídas e manter suas finanças em dia.
              </p>
              <div className="mt-6 flex flex-1 min-h-0 w-full items-center justify-center">
                <img
                  src="/images/sem-transacoes.svg"
                  alt=""
                  className="h-full max-h-full w-auto object-contain"
                />
              </div>
            </div>
          ) : (
            <>
              {/* Desktop: Table view */}
              <div className="hidden md:block flex-1 min-h-0 overflow-x-auto">
              {/* Column Titles */}
              <div className="grid grid-cols-[minmax(140px,1fr)_70px_90px_minmax(80px,1fr)_90px_72px] gap-x-3 gap-y-0 items-center py-[10px] px-4 bg-[var(--neutral-75)] rounded-t-[var(--radius-md)] text-[var(--neutral-text-muted)] text-[14px] font-normal shrink-0 min-w-[560px]">
                <div className="min-w-0 truncate">Descrição / Categoria</div>
                <div className="text-center shrink-0">Data</div>
                <div className="text-center shrink-0 truncate">Pagamento</div>
                <div className="text-center min-w-0 truncate">Detalhes</div>
                <div className="text-center shrink-0">Valor</div>
                <div className="text-right shrink-0 w-[72px]">Ações</div>
              </div>

              {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-[minmax(140px,1fr)_70px_90px_minmax(80px,1fr)_90px_72px] gap-x-3 gap-y-0 items-center py-3 px-4 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--neutral-100)] hover:shadow-[var(--shadow-dropdown)] transition-shadow min-w-[560px]"
            >
              {/* Description / Category */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                  {tx.type === "income" ? (
                    <RevenueIcon className="w-7 h-7 text-[var(--feedback-success-base)]" />
                  ) : (
                    <ExpensesIcon className="w-7 h-7 text-[var(--feedback-error-base)]" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className="text-[var(--neutral-700)] text-[14px] font-normal leading-tight truncate">
                    {tx.description}
                  </span>
                  <span className="text-[var(--neutral-text-muted)] text-[12px] font-light leading-tight truncate">
                    {tx.category}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="text-center text-[var(--neutral-700)] text-[14px] font-normal whitespace-nowrap shrink-0">
                {tx.date}
              </div>

              {/* Payment Method */}
              <div className="flex justify-center min-w-0 shrink-0">
                <span className="bg-[var(--neutral-75)] px-2 py-1 rounded-[10px] text-[var(--neutral-700)] text-[13px] font-light truncate max-w-full">
                  {tx.paymentMethod}
                </span>
              </div>

              {/* Details */}
              <div className="text-center text-[var(--neutral-700)] text-[14px] font-normal truncate min-w-0">
                {tx.details}
              </div>

              {/* Value */}
              <div
                className={
                  tx.type === "income"
                    ? "text-center text-[14px] font-normal text-[var(--feedback-success-base)] whitespace-nowrap shrink-0"
                    : "text-center text-[14px] font-normal text-[var(--feedback-error-base)] whitespace-nowrap shrink-0"
                }
              >
                {formatCurrency(tx.amount)}
              </div>

              {/* Actions - largura fixa para não cortar */}
              <div className="flex justify-end gap-2 w-[72px] shrink-0">
                <button
                  type="button"
                  className="text-[var(--neutral-icons-muted)] hover:text-[var(--brand-base)] transition-colors p-0.5"
                  aria-label="Editar"
                >
                  <Icon icon={Edit01Icon} size={20} />
                </button>
<button
                type="button"
                onClick={() => deleteTransaction(tx.id)}
                className="text-[var(--neutral-icons-muted)] hover:text-[var(--feedback-error-base)] transition-colors p-0.5"
                aria-label="Excluir"
              >
                <Icon icon={Delete01Icon} size={20} />
              </button>
              </div>
              </div>
              ))}
              </div>

              {/* Mobile: Card view */}
              <div className="md:hidden flex flex-col gap-3 pt-2">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col gap-2 p-4 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--neutral-100)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                          {tx.type === "income" ? (
                            <RevenueIcon className="w-8 h-8 text-[var(--feedback-success-base)]" />
                          ) : (
                            <ExpensesIcon className="w-8 h-8 text-[var(--feedback-error-base)]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[var(--neutral-700)] text-[14px] font-normal truncate">
                            {tx.description}
                          </p>
                          <p className="text-[var(--neutral-text-muted)] text-[12px]">
                            {tx.category} • {tx.date}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-[14px] font-normal shrink-0 ${
                          tx.type === "income"
                            ? "text-[var(--feedback-success-base)]"
                            : "text-[var(--feedback-error-base)]"
                        }`}
                      >
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--neutral-100)]">
                      <span className="text-[12px] text-[var(--neutral-text-muted)]">
                        {tx.paymentMethod}
                        {tx.details ? ` • ${tx.details}` : ""}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="p-2 text-[var(--neutral-icons-muted)] hover:text-[var(--brand-base)] transition-colors rounded-[var(--radius-md)]"
                          aria-label="Editar"
                        >
                          <Icon icon={Edit01Icon} size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-2 text-[var(--neutral-icons-muted)] hover:text-[var(--feedback-error-base)] transition-colors rounded-[var(--radius-md)]"
                          aria-label="Excluir"
                        >
                          <Icon icon={Delete01Icon} size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
