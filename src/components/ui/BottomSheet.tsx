"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** Header customizado (ex: header escuro com ícone). Quando fornecido, ignora title/subtitle. */
  customHeader?: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  /** Se true, pede confirmação ao fechar (ex: "Descartar alterações?") */
  hasDirtyChanges?: boolean;
  /** Label do botão fechar no header (acessibilidade) */
  closeLabel?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  customHeader,
  children,
  footer,
  hasDirtyChanges = false,
  closeLabel = "Fechar",
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const [isClosing, setIsClosing] = useState(false);

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleClose = useCallback(() => {
    if (hasDirtyChanges && !showDiscardConfirm) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  }, [hasDirtyChanges, showDiscardConfirm, onClose]);

  const handleConfirmDiscard = useCallback(() => {
    setShowDiscardConfirm(false);
    onClose();
  }, [onClose]);

  const handleCancelDiscard = useCallback(() => {
    setShowDiscardConfirm(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      setShowDiscardConfirm(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = endY - startY.current;
    if (diff > 80) {
      setIsClosing(true);
      setTimeout(handleClose, 150);
    }
  };

  const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])";

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(focusableSelector);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        aria-hidden
        onClick={handleClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        <div
          ref={panelRef}
            className={`
            bg-[var(--surface-card)] w-full max-w-[480px] max-h-[var(--sheet-max-h)] sm:max-h-[var(--sheet-max-h-sm)]
            overflow-hidden border border-[var(--neutral-100)] shadow-[var(--shadow-modal)]
            relative font-['Lexend'] pointer-events-auto
            rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)]
            flex flex-col
            transition-transform duration-200 ease-out
            ${isClosing ? "translate-y-full" : "translate-y-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle - mobile only */}
          <div
            className="sm:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-hidden
          >
            <div
              className="w-10 h-1 rounded-full bg-[var(--neutral-300)]"
              style={{ minHeight: "4px" }}
            />
          </div>

          {/* Header */}
          {customHeader ? (
            customHeader
          ) : (
            <div className="flex flex-row items-center px-6 pt-6 pb-4 gap-2 shrink-0">
              <div className="flex-1 flex flex-col items-start min-w-0">
                <h2
                  id="bottom-sheet-title"
                  className="text-[var(--neutral-text-black)] text-xl font-medium leading-tight"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[var(--neutral-text-muted)] text-sm font-light mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-10 h-10 min-w-10 min-h-10 shrink-0 hover:bg-[var(--neutral-75)] rounded-[var(--radius-md)] transition-colors flex items-center justify-center"
                aria-label={closeLabel}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[var(--neutral-icons-strong)]"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Body - scrollable ou confirmar descarte */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-touch px-6">
            {showDiscardConfirm ? (
              <div className="py-6 flex flex-col gap-4">
                <p className="text-[var(--neutral-700)] text-sm font-light">
                  Descartar alterações?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelDiscard}
                    className="flex-1 h-[var(--height-control)] rounded-[var(--radius-md)] border border-[var(--neutral-100)] bg-[var(--surface-input)] text-[var(--neutral-700)] text-sm font-light hover:bg-[var(--neutral-75)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDiscard}
                    className="flex-1 h-[var(--height-control)] rounded-[var(--radius-md)] bg-[var(--feedback-error-base)] text-white text-sm font-normal hover:bg-[var(--feedback-error-dark)]"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            ) : (
              children
            )}
          </div>

          {!showDiscardConfirm && (
            <div className="shrink-0 border-t border-[var(--neutral-100)] bg-[var(--surface-input)] px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0))]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
