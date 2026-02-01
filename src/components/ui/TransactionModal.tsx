"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DatePicker } from "@/components/ui/DatePicker";
import { Icon } from "@/components/ui/Icon";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  Wallet01Icon,
  Tag01Icon,
  CreditCardIcon,
  Edit01Icon,
  Message01Icon,
  ArrowDown01Icon,
} from "@/components/icons";
import { RevenueIcon, ExpensesIcon } from "@/components/icons/FinanceIcons";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  "Alimentação",
  "Contas",
  "Saúde",
  "Salário",
  "Trabalho",
  "Transporte",
  "Lazer",
  "Outros",
];

const PAYMENT_METHODS = ["PIX", "Débito", "Cartão de Crédito"];

export interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    type: "income" | "expense";
    amount: number;
    date: string;
    category: string;
    paymentMethod: string;
    name: string;
    description: string;
  }) => void;
}

export function TransactionModal({ open, onClose, onSubmit }: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const isExpense = transactionType === "expense";
  const isValid = useMemo(() => {
    const parsed = parseFloat(amount.replace(",", ".").replace(/\s/g, ""));
    return !Number.isNaN(parsed) && parsed > 0;
  }, [amount]);
  const hasDirtyChanges = useMemo(
    () => !!(amount || date || name || description || category || paymentMethod),
    [amount, date, name, description, category, paymentMethod]
  );

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setDate("");
    setName("");
    setDescription("");
    setCategory("");
    setPaymentMethod("");
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setCategoryOpen(false);
      if (paymentRef.current && !paymentRef.current.contains(e.target as Node))
        setPaymentOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount.replace(",", ".").replace(/\s/g, "")) || 0;
    const value = isExpense ? -Math.abs(numAmount) : Math.abs(numAmount);
    onSubmit?.({
      type: transactionType,
      amount: value,
      date,
      category: category || CATEGORIES[0],
      paymentMethod: paymentMethod || PAYMENT_METHODS[0],
      name: name.trim(),
      description: description.trim(),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Adicionar Transação"
      subtitle="Preencha os detalhes da transação financeira abaixo."
      hasDirtyChanges={hasDirtyChanges}
      footer={
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[var(--height-control)] flex items-center justify-center text-[var(--neutral-text-muted)] text-[14px] font-light rounded-[var(--radius-md)] hover:bg-[var(--neutral-100)] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={cn(
              "flex-[1.5] h-[var(--height-control)] flex items-center justify-center text-white text-[14px] font-normal rounded-[var(--radius-md)] transition-colors",
              isValid
                ? isExpense
                  ? "bg-[var(--feedback-error-base)] hover:bg-[var(--feedback-error-dark)]"
                  : "bg-[var(--feedback-success-base)] hover:bg-[var(--feedback-success-dark)]"
                : "bg-[var(--neutral-300)] cursor-not-allowed opacity-60"
            )}
          >
            Salvar Transação
          </button>
        </div>
      }
    >
      <div className="gap-3 flex flex-col pb-4">
            {/* Transaction Type Toggle */}
            <div className="relative w-full rounded-[var(--radius-lg)] bg-[var(--surface-input)] border border-[var(--neutral-100)] p-2 flex gap-2">
              <button
                type="button"
                onClick={() => setTransactionType("expense")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-md)] transition-all",
                  isExpense ? "bg-[var(--feedback-error-base)]/10" : "bg-transparent hover:bg-[var(--neutral-75)]"
                )}
              >
                <ExpensesIcon
                  muted={!isExpense}
                  className={cn("w-8 h-8 shrink-0", !isExpense && "text-[var(--neutral-icons-muted)]")}
                />
                <span
                  className={cn(
                    "text-[14px]",
                    isExpense ? "text-[var(--feedback-error-base)] font-normal" : "text-[var(--neutral-text-muted)] font-normal"
                  )}
                >
                  Despesa
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("income")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-md)] transition-all",
                  !isExpense ? "bg-[var(--feedback-success-base)]/10" : "bg-transparent hover:bg-[var(--neutral-75)]"
                )}
              >
                <RevenueIcon
                  muted={isExpense}
                  className={cn("w-8 h-8 shrink-0", isExpense && "text-[var(--neutral-icons-muted)]")}
                />
                <span
                  className={cn(
                    "text-[14px]",
                    !isExpense ? "text-[var(--feedback-success-base)] font-normal" : "text-[var(--neutral-text-muted)] font-normal"
                  )}
                >
                  Receita
                </span>
              </button>
            </div>

            {/* Amount Input */}
            <div className="w-full h-fit pt-2 pb-8 rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
              <Icon icon={Wallet01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
              <input
                type="text"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-[14px] text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => {
                  setPaymentOpen(false);
                  setCategoryOpen((o) => !o);
                }}
                className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
              >
                <Icon icon={Tag01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <span className={cn("flex-1 text-left text-[14px] font-light truncate", category ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]")}>
                  {category || "Selecione uma categoria"}
                </span>
                <Icon icon={ArrowDown01Icon} size={16} className={cn("shrink-0 text-[var(--neutral-icons-muted)] transition-transform", categoryOpen && "rotate-180")} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)] py-1 z-10">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setCategoryOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[14px] font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {/* Date */}
              <div className="flex-1 min-w-0">
                <DatePicker
                  value={date}
                  onChange={setDate}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              {/* Payment Method */}
              <div className="relative flex-1 min-w-0" ref={paymentRef}>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryOpen(false);
                    setPaymentOpen((o) => !o);
                  }}
                  className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
                >
                  <Icon icon={CreditCardIcon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                  <span className={cn("flex-1 text-left text-[14px] font-light truncate", paymentMethod ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]")}>
                    {paymentMethod || "Meio pagamento"}
                  </span>
                  <Icon icon={ArrowDown01Icon} size={16} className={cn("shrink-0 text-[var(--neutral-icons-muted)] transition-transform", paymentOpen && "rotate-180")} />
                </button>
                {paymentOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)] py-1 z-10">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(pm);
                          setPaymentOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14px] font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Nome da transação (despesa/receita) */}
            <div className="w-full h-fit pt-2 pb-8 rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
              <Icon icon={Edit01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
              <input
                type="text"
                placeholder="Nome da transação (ex: Almoço, Uber, Mercado...)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-[14px] text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none"
              />
            </div>

            {/* Descrição */}
            <div className="w-full h-fit pt-2 pb-8 rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
              <Icon icon={Message01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
              <input
                type="text"
                placeholder="Ex: Observações, detalhes adicionais..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-[14px] text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none"
              />
            </div>
          </div>
    </BottomSheet>
  );
}
