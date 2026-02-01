"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  Wallet01Icon,
  Tag01Icon,
  Edit01Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  CreditCardIcon,
} from "@/components/icons";
import { DatePicker } from "@/components/ui/DatePicker";

const svgPaths = {
  closeX: "M18 6L6 18M6 6l12 12",
};

const CATEGORIES = [
  "Moradia",
  "Assinatura",
  "Estudo",
  "Saúde",
  "Transporte",
  "Outros",
];

const RECURRENCE_OPTIONS = ["Mensal", "Semanal", "Anual"];

const PAYMENT_METHODS = ["PIX", "Débito", "Cartão de Crédito"];

export interface FixedAccountFormData {
  name: string;
  category: string;
  amount: string;
  recurrence: string;
  date: string;
  paymentMethod: string;
}

export interface FixedAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FixedAccountFormData) => void;
  initialData?: FixedAccountFormData | null;
}

export function FixedAccountModal({ open, onClose, onSubmit, initialData }: FixedAccountModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const recurrenceRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setAmount(initialData.amount);
      setRecurrence(initialData.recurrence);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
    } else {
      setName("");
      setCategory("");
      setAmount("");
      setRecurrence("");
      setDate("");
      setPaymentMethod("");
    }
  }, [open, initialData]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setCategoryOpen(false);
      if (recurrenceRef.current && !recurrenceRef.current.contains(e.target as Node))
        setRecurrenceOpen(false);
      if (paymentRef.current && !paymentRef.current.contains(e.target as Node))
        setPaymentOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    onSubmit?.({
      name: name.trim(),
      category: category || CATEGORIES[0],
      amount: amount.trim(),
      recurrence: recurrence || RECURRENCE_OPTIONS[0],
      date,
      paymentMethod: paymentMethod || PAYMENT_METHODS[0],
    });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        aria-hidden
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div
          className="bg-[var(--surface-card)] w-full max-w-[480px] max-h-[90vh] overflow-y-auto overflow-x-hidden border border-[var(--neutral-100)] shadow-[var(--shadow-modal)] relative font-['Lexend'] pointer-events-auto rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] sm:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex flex-row items-center p-6 gap-2">
            <div className="flex-1 flex flex-col items-start min-w-0">
              <h2 className="text-[var(--neutral-text-black)] text-[20px] font-medium">
                {initialData ? "Editar Conta Fixa" : "Adicionar Conta Fixa"}
              </h2>
              <p className="text-[var(--neutral-text-muted)] text-[14px] font-light mt-1">
                Previsibilidade para seus pagamentos recorrentes.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 shrink-0 hover:bg-[var(--feedback-error-base)]/10 rounded-full transition-colors flex items-center justify-center"
              aria-label="Fechar"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[var(--feedback-error-base)]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d={svgPaths.closeX} />
              </svg>
            </button>
          </div>

          <div className="px-6 pb-6 gap-3 flex flex-col">
            {/* Descrição / Nome - full width */}
            <div className="w-full h-fit py-2 px-4 rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
              <Icon icon={Edit01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
              <input
                type="text"
                placeholder="Ex: Almoço, Uber, Mercado..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-[14px] text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none py-2"
              />
            </div>

            {/* Row: Categoria | Valor */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="relative min-w-0" ref={categoryRef}>
                <button
                  type="button"
                  onClick={() => {
                    setRecurrenceOpen(false);
                    setPaymentOpen(false);
                    setCategoryOpen((o) => !o);
                  }}
                  className="w-full min-w-0 h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
                >
                  <Icon icon={Tag01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                  <span className={`flex-1 text-left text-[14px] font-light truncate ${category ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]"}`}>
                    {category || "Categoria"}
                  </span>
                  <Icon icon={ArrowDown01Icon} size={16} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
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
              <div className="min-w-0 h-[var(--height-control)] py-2 px-4 rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
                <Icon icon={Wallet01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-[14px] text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none"
                />
              </div>
            </div>

            {/* Row: Recorrência | Data */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="relative min-w-0" ref={recurrenceRef}>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryOpen(false);
                    setPaymentOpen(false);
                    setRecurrenceOpen((o) => !o);
                  }}
                  className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
                >
                  <Icon icon={Calendar01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                  <span className={`flex-1 text-left text-[14px] font-light truncate ${recurrence ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]"}`}>
                    {recurrence || "Recorrência"}
                  </span>
                  <Icon icon={ArrowDown01Icon} size={16} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${recurrenceOpen ? "rotate-180" : ""}`} />
                </button>
                {recurrenceOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)] py-1 z-10">
                    {RECURRENCE_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRecurrence(r);
                          setRecurrenceOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14px] font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <DatePicker
                  value={date}
                  onChange={setDate}
                  placeholder="00/00/0000"
                />
              </div>
            </div>

            {/* Meio pagamento - full width */}
            <div className="relative" ref={paymentRef}>
              <button
                type="button"
                onClick={() => {
                  setCategoryOpen(false);
                  setRecurrenceOpen(false);
                  setPaymentOpen((o) => !o);
                }}
                className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
              >
                <Icon icon={CreditCardIcon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <span className={`flex-1 text-left text-[14px] font-light truncate ${paymentMethod ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]"}`}>
                  {paymentMethod || "Meio pagamento"}
                </span>
                <Icon icon={ArrowDown01Icon} size={16} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${paymentOpen ? "rotate-180" : ""}`} />
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

          {/* Footer */}
          <div className="w-full bg-[var(--surface-input)] p-6 flex gap-2 items-center border-t border-[var(--neutral-100)]">
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
              className="flex-[1.5] h-[var(--height-control)] flex items-center justify-center text-white text-[14px] font-normal rounded-[var(--radius-md)] bg-[var(--brand-base)] hover:opacity-90 transition-colors"
            >
              {initialData ? "Salvar alterações" : "Salvar Conta"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
