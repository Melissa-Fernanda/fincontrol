"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { Calendar01Icon, ArrowDown01Icon } from "@/components/icons";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function formatToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatToDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function parseDDMMYYYY(str: string): Date | null {
  const trimmed = str.trim().replace(/\D/g, "");
  if (trimmed.length !== 8) return null;
  const d = parseInt(trimmed.slice(0, 2), 10);
  const m = parseInt(trimmed.slice(2, 4), 10) - 1;
  const y = parseInt(trimmed.slice(4, 8), 10);
  const date = new Date(y, m, d);
  if (isNaN(date.getTime()) || date.getDate() !== d || date.getMonth() !== m) return null;
  return date;
}

function parseYYYYMMDD(str: string): Date | null {
  if (!str || str.length < 10) return null;
  const [y, m, d] = str.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function getCalendarDays(viewDate: Date): { date: Date; isCurrentMonth: boolean }[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = first.getDay();
  const daysInMonth = last.getDate();
  const result: { date: Date; isCurrentMonth: boolean }[] = [];

  const prevMonth = new Date(year, month, 0);
  const prevDays = prevMonth.getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    result.push({
      date: new Date(year, month - 1, prevDays - i),
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    result.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  const remaining = 42 - result.length;
  for (let d = 1; d <= remaining; d++) {
    result.push({
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    });
  }

  return result;
}

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  id,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseYYYYMMDD(value);
    return parsed || new Date();
  });
  const [inputText, setInputText] = useState(() => {
    const parsed = parseYYYYMMDD(value);
    return parsed ? formatToDDMMYYYY(parsed) : "";
  });
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseYYYYMMDD(value);

  useEffect(() => {
    const parsed = parseYYYYMMDD(value);
    setInputText(parsed ? formatToDDMMYYYY(parsed) : "");
    if (parsed) setViewDate(parsed);
  }, [value]);

  useLayoutEffect(() => {
    if (!open || !containerRef.current) {
      if (!open) setDropdownPosition(null);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const dropdownWidth = 280;
    const dropdownHeight = 380;
    const gap = 4;
    let top = rect.bottom + gap;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;
    if (left < 8) left = 8;
    if (top + dropdownHeight > window.innerHeight - 8) {
      top = rect.top - dropdownHeight - gap;
    }
    if (top < 8) top = 8;
    setDropdownPosition({ top, left });
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputText(v);
    const parsed = parseDDMMYYYY(v);
    if (parsed) onChange(formatToYYYYMMDD(parsed));
  };

  const handleInputBlur = () => {
    if (!inputText.trim()) {
      onChange("");
      return;
    }
    const parsed = parseDDMMYYYY(inputText);
    if (parsed) {
      onChange(formatToYYYYMMDD(parsed));
      setInputText(formatToDDMMYYYY(parsed));
    }
  };

  const handleSelectDay = (date: Date) => {
    onChange(formatToYYYYMMDD(date));
    setInputText(formatToDDMMYYYY(date));
    setViewDate(date);
  };

  const goPrevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  };

  const goNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));
  };

  const handleHoje = () => {
    const today = new Date();
    onChange(formatToYYYYMMDD(today));
    setInputText(formatToDDMMYYYY(today));
    setViewDate(today);
  };

  const handleLimpar = () => {
    onChange("");
    setInputText("");
  };

  const calendarDays = getCalendarDays(viewDate);
  const monthLabel = `${MONTHS[viewDate.getMonth()]} de ${viewDate.getFullYear()}`;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`flex h-[var(--height-control)] w-full items-center gap-2 rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-input)] px-4 transition-colors focus-within:border-[var(--neutral-stroke-muted)] ${disabled ? "opacity-60" : "cursor-pointer"}`}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <Icon icon={Calendar01Icon} size={20} className="shrink-0 text-[var(--neutral-icons-muted)]" />
        <input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent text-[14px] font-light text-[var(--neutral-700)] placeholder:text-[var(--neutral-text-muted)] outline-none"
        />
      </div>

      {open &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] w-[280px] rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-card)] p-4 font-['Lexend'] shadow-[var(--shadow-dropdown)]"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          >
            {/* Header: mês/ano + setas */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[14px] font-normal text-[var(--neutral-700)]">{monthLabel}</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                  aria-label="Mês anterior"
                >
                  <Icon icon={ArrowDown01Icon} size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={goNextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--neutral-700)] hover:bg-[var(--neutral-75)]"
                  aria-label="Próximo mês"
                >
                  <Icon icon={ArrowDown01Icon} size={16} />
                </button>
              </div>
            </div>

            {/* Dias da semana */}
            <div className="mb-1 grid grid-cols-7 gap-0.5 text-center">
              {WEEKDAYS.map((w) => (
                <span key={w} className="text-[12px] font-normal text-[var(--neutral-text-muted)]">
                  {w}
                </span>
              ))}
            </div>

            {/* Grade de dias */}
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map(({ date, isCurrentMonth }) => {
                const isSelected =
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear();
                return (
                  <button
                    key={date.getTime()}
                    type="button"
                    onClick={() => handleSelectDay(date)}
                    className={`flex h-9 w-9 items-center justify-center rounded-[8px] text-[14px] font-normal transition-colors ${
                      !isCurrentMonth ? "text-[var(--neutral-text-muted)]" : "text-[var(--neutral-700)]"
                    } ${isSelected ? "bg-[var(--brand-base)] text-white hover:opacity-90" : "hover:bg-[var(--neutral-75)]"}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Rodapé: Limpar | Hoje */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--neutral-100)] pt-3">
              <button
                type="button"
                onClick={handleLimpar}
                className="text-[12px] font-light text-[var(--brand-base)] hover:underline"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={handleHoje}
                className="text-[12px] font-light text-[var(--brand-base)] hover:underline"
              >
                Hoje
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
