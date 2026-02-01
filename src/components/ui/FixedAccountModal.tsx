"use client";

import { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/Icon";
import { BottomSheet } from "@/components/ui/BottomSheet";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import {
  Wallet01Icon,
  Tag01Icon,
  Edit01Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  CreditCardIcon,
} from "@/components/icons";
import { DatePicker } from "@/components/ui/DatePicker";

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
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const recurrenceTriggerRef = useRef<HTMLButtonElement>(null);
  const paymentTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number } | null>(null);

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

  const updateDropdownPosition = useCallback((trigger: HTMLButtonElement | null) => {
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setDropdownStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  useLayoutEffect(() => {
    if (categoryOpen) updateDropdownPosition(categoryTriggerRef.current);
    else if (recurrenceOpen) updateDropdownPosition(recurrenceTriggerRef.current);
    else if (paymentOpen) updateDropdownPosition(paymentTriggerRef.current);
    else setDropdownStyle(null);
  }, [categoryOpen, recurrenceOpen, paymentOpen, updateDropdownPosition]);

  const dropdownContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inTrigger =
        categoryTriggerRef.current?.contains(target) ||
        recurrenceTriggerRef.current?.contains(target) ||
        paymentTriggerRef.current?.contains(target);
      const inDropdown = dropdownContentRef.current?.contains(target);
      if (!inTrigger && !inDropdown) {
        setCategoryOpen(false);
        setRecurrenceOpen(false);
        setPaymentOpen(false);
      }
    }
    if (categoryOpen || recurrenceOpen || paymentOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [categoryOpen, recurrenceOpen, paymentOpen]);

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

  const isValid = useMemo(() => {
    const t = name.trim();
    const a = amount.trim().replace(",", ".").replace(/\s/g, "");
    const parsed = parseFloat(a);
    return t.length > 0 && !Number.isNaN(parsed) && parsed > 0;
  }, [name, amount]);
  const hasDirtyChanges = useMemo(
    () => !!(name || category || amount || recurrence || date || paymentMethod),
    [name, category, amount, recurrence, date, paymentMethod]
  );

  if (!open) return null;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={initialData ? "Editar Conta Fixa" : "Adicionar Conta Fixa"}
      subtitle="Previsibilidade para seus pagamentos recorrentes."
      hasDirtyChanges={hasDirtyChanges}
      footer={
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[var(--height-control)] flex items-center justify-center text-[var(--neutral-text-muted)] text-sm font-light rounded-[var(--radius-md)] hover:bg-[var(--neutral-100)] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={cn(
              "flex-[1.5] h-[var(--height-control)] flex items-center justify-center text-white text-sm font-normal rounded-[var(--radius-md)] transition-colors",
              isValid ? "bg-[var(--brand-base)] hover:opacity-90" : "bg-[var(--neutral-300)] cursor-not-allowed opacity-60"
            )}
          >
            {initialData ? "Salvar alterações" : "Salvar Conta"}
          </button>
        </div>
      }
    >
      <div className="gap-3 flex flex-col pb-4">
            {/* Nome da conta - full width */}
            <div className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
              <Icon icon={Edit01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
              <input
                type="text"
                placeholder="Ex: Almoço, Uber, Mercado..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none"
              />
            </div>

            {/* Row: Categoria | Valor */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="relative min-w-0">
                <button
                  ref={categoryTriggerRef}
                  type="button"
                  onClick={() => {
                    setRecurrenceOpen(false);
                    setPaymentOpen(false);
                    setCategoryOpen((o) => !o);
                  }}
                  className="w-full min-w-0 h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
                >
                  <Icon icon={Tag01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                  <span className={`flex-1 text-left text-sm font-light truncate ${category ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]"}`}>
                    {category || "Categoria"}
                  </span>
                  <Icon icon={ArrowDown01Icon} size={16} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                </button>
                {categoryOpen && dropdownStyle && typeof document !== "undefined" &&
                  createPortal(
                    <div
                      ref={dropdownContentRef}
                      className="fixed z-[60] max-h-[200px] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)] py-1"
                      style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
                    >
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCategory(c);
                            setCategoryOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                        >
                          {c}
                        </button>
                      ))}
                    </div>,
                    document.body
                  )}
              </div>
              <div className="min-w-0 h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 focus-within:ring-1 focus-within:ring-[var(--neutral-stroke-muted)] focus-within:border-[var(--neutral-stroke-soft)]">
                <Icon icon={Wallet01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-sm text-[var(--neutral-text-black)] placeholder:text-[var(--neutral-text-muted)] font-light outline-none"
                />
              </div>
            </div>

            {/* Row: Recorrência | Data */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="relative min-w-0">
                <button
                  ref={recurrenceTriggerRef}
                  type="button"
                  onClick={() => {
                    setCategoryOpen(false);
                    setPaymentOpen(false);
                    setRecurrenceOpen((o) => !o);
                  }}
                  className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
                >
                  <Icon icon={Calendar01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                  <span className={`flex-1 text-left text-sm font-light truncate ${recurrence ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]"}`}>
                    {recurrence || "Recorrência"}
                  </span>
                  <Icon icon={ArrowDown01Icon} size={16} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${recurrenceOpen ? "rotate-180" : ""}`} />
                </button>
                {recurrenceOpen && dropdownStyle && typeof document !== "undefined" &&
                  createPortal(
                    <div
                      ref={dropdownContentRef}
                      className="fixed z-[60] rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)] py-1"
                      style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
                    >
                      {RECURRENCE_OPTIONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setRecurrence(r);
                            setRecurrenceOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                        >
                          {r}
                        </button>
                      ))}
                    </div>,
                    document.body
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
            <div className="relative">
              <button
                ref={paymentTriggerRef}
                type="button"
                onClick={() => {
                  setCategoryOpen(false);
                  setRecurrenceOpen(false);
                  setPaymentOpen((o) => !o);
                }}
                className="w-full h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--surface-input)] border border-[var(--neutral-100)] flex items-center px-4 gap-2 cursor-pointer hover:bg-[var(--neutral-75)] transition-colors"
              >
                <Icon icon={CreditCardIcon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <span className={`flex-1 text-left text-sm font-light truncate ${paymentMethod ? "text-[var(--neutral-700)]" : "text-[var(--neutral-text-muted)]"}`}>
                  {paymentMethod || "Meio pagamento"}
                </span>
                <Icon icon={ArrowDown01Icon} size={16} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${paymentOpen ? "rotate-180" : ""}`} />
              </button>
              {paymentOpen && dropdownStyle && typeof document !== "undefined" &&
                createPortal(
                  <div
                    ref={dropdownContentRef}
                    className="fixed z-[60] rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)] py-1"
                    style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(pm);
                          setPaymentOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                      >
                        {pm}
                      </button>
                    ))}
                  </div>,
                  document.body
                )}
            </div>
          </div>
    </BottomSheet>
  );
}
