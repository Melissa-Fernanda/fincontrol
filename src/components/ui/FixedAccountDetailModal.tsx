"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  ArrowDown01Icon,
  Calendar01Icon,
  CreditCardIcon,
} from "@/components/icons";
import { DatePicker } from "@/components/ui/DatePicker";
import type { IconSvgElement } from "@hugeicons/react";

const RECURRENCE_OPTIONS = ["Mensal", "Semanal", "Anual"];
const PAYMENT_METHODS = ["PIX", "Débito", "Cartão de Crédito"];

export interface FixedAccountDetailItem {
  id: number;
  name: string;
  category: string;
  amount: string;
  recurrence: string;
  date: string;
  paymentMethod: string;
  isPaid: boolean;
}

export interface FixedAccountDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: FixedAccountDetailItem | null;
  icon?: IconSvgElement;
  onMarkAsPaid?: (id: number) => void;
}

const svgPaths = { closeX: "M18 6L6 18M6 6l12 12" };

export function FixedAccountDetailModal({
  open,
  onClose,
  item,
  icon: IconComponent,
  onMarkAsPaid,
}: FixedAccountDetailModalProps) {
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);
  const recurrenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !item) return;
    setDate(item.date);
    setPaymentMethod(item.paymentMethod);
    setRecurrence(item.recurrence);
  }, [open, item]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (paymentRef.current && !paymentRef.current.contains(e.target as Node))
        setPaymentOpen(false);
      if (recurrenceRef.current && !recurrenceRef.current.contains(e.target as Node))
        setRecurrenceOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsPaid = () => {
    if (item) {
      onMarkAsPaid?.(item.id);
      onClose();
    }
  };

  const hasDirtyChanges = useMemo(() => {
    if (!item) return false;
    return date !== item.date || paymentMethod !== item.paymentMethod || recurrence !== item.recurrence;
  }, [item, date, paymentMethod, recurrence]);

  if (!open || !item) return null;

  const customHeader = (
    <div className="bg-[var(--brand-base)] w-full p-6 pb-8 text-white relative shrink-0">
      <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-[48px] h-[48px] bg-[var(--fathomgray-800)] rounded-[var(--radius-md)] flex items-center justify-center border border-[var(--fathomgray-700)] shrink-0 overflow-hidden">
                  {IconComponent && (
                    <Icon icon={IconComponent} size={24} className="text-[var(--neutral-300)] shrink-0" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xl font-medium leading-tight text-[var(--neutral-300)] truncate">
                    {item.name}
                  </span>
                  <span className="text-sm font-light text-[var(--neutral-500)]">
                    Conta Recorrente
                  </span>
                </div>
              </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors shrink-0"
          aria-label="Fechar"
        >
                <span className="w-full h-full rounded-full bg-[var(--feedback-error-base)]/10 flex items-center justify-center border border-[var(--feedback-error-base)]/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-[var(--feedback-error-base)]"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  >
                    <path d={svgPaths.closeX} />
                  </svg>
          </span>
        </button>
      </div>
      {/* Card do valor */}
      <div className="w-full bg-white/[0.08] rounded-[var(--radius-lg)] p-3 py-4 flex flex-col items-center border border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 border border-white/[0.08] rounded-[var(--radius-lg)] pointer-events-none" />
              <span className="text-base font-normal text-white mb-2">Valor Mensal</span>
              <span className="text-[24px] font-medium text-white mb-3">{item.amount}</span>
              <div className="bg-white/[0.12] px-3 py-1 rounded-[var(--radius-md)] flex items-center gap-1.5">
                <Icon icon={Calendar01Icon} size={14} className="text-white shrink-0" />
                <span className="text-sm font-light text-white">Em aberto</span>
        </div>
      </div>
    </div>
  );

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      customHeader={customHeader}
      hasDirtyChanges={hasDirtyChanges}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[var(--height-control)] flex items-center justify-center text-[var(--neutral-text-muted)] text-sm font-normal rounded-[var(--radius-md)] hover:bg-[var(--neutral-100)] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleMarkAsPaid}
            className="flex-[1.5] h-[var(--height-control)] bg-[var(--feedback-success-base)] text-white text-sm font-normal rounded-[var(--radius-md)] flex items-center justify-center hover:bg-[var(--feedback-success-dark)] transition-colors shadow-sm border border-[var(--feedback-success-base)]/10"
          >
            Marcar como Paga
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 px-6 pt-3 pb-3 w-full">
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="00/00/0000"
            />

            <div className="relative" ref={paymentRef}>
              <button
                type="button"
                onClick={() => {
                  setRecurrenceOpen(false);
                  setPaymentOpen((o) => !o);
                }}
                className="w-full h-[var(--height-control)] bg-[var(--surface-input)] border border-[var(--neutral-100)] rounded-[var(--radius-md)] px-4 flex items-center gap-3 hover:border-[var(--neutral-stroke-muted)] transition-colors cursor-pointer text-left"
              >
                <Icon icon={CreditCardIcon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <span className={`flex-1 text-sm font-light ${paymentMethod ? "text-[var(--neutral-text-black)]" : "text-[var(--neutral-text-muted)]"}`}>
                  {paymentMethod || "Meio pagamento"}
                </span>
                <Icon icon={ArrowDown01Icon} size={20} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${paymentOpen ? "rotate-180" : ""}`} />
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
                      className="w-full px-4 py-2.5 text-left text-sm font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={recurrenceRef}>
              <button
                type="button"
                onClick={() => {
                  setPaymentOpen(false);
                  setRecurrenceOpen((o) => !o);
                }}
                className="w-full h-[var(--height-control)] bg-[var(--surface-input)] border border-[var(--neutral-100)] rounded-[var(--radius-md)] px-4 flex items-center gap-3 hover:border-[var(--neutral-stroke-muted)] transition-colors cursor-pointer text-left"
              >
                <Icon icon={Calendar01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
                <span className={`flex-1 text-sm font-light ${recurrence ? "text-[var(--neutral-text-black)]" : "text-[var(--neutral-text-muted)]"}`}>
                  {recurrence || "Recorrência"}
                </span>
                <Icon icon={ArrowDown01Icon} size={20} className={`shrink-0 text-[var(--neutral-icons-muted)] transition-transform ${recurrenceOpen ? "rotate-180" : ""}`} />
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
                      className="w-full px-4 py-2.5 text-left text-sm font-light text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
    </BottomSheet>
  );
}
