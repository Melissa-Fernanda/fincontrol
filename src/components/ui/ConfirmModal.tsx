"use client";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "neutral";
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-[var(--feedback-error-base)] hover:bg-[var(--feedback-error-dark)] text-white"
      : "bg-[var(--brand-base)] hover:opacity-90 text-white";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        aria-hidden
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div
          className="bg-[var(--surface-card)] w-full max-w-[400px] max-h-[90vh] overflow-y-auto overflow-x-hidden border border-[var(--neutral-100)] shadow-[var(--shadow-modal)] relative font-['Lexend'] pointer-events-auto rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] sm:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col gap-4">
            <h3 className="text-[var(--neutral-text-black)] text-[18px] font-medium">{title}</h3>
            <p className="text-[var(--neutral-700)] text-[14px] font-light">{message}</p>
          </div>
          <div className="w-full bg-[var(--surface-input)] p-4 flex gap-2 items-center justify-end border-t border-[var(--neutral-100)]">
            <button
              type="button"
              onClick={onCancel}
              className="h-[var(--height-control)] px-5 flex items-center justify-center text-[var(--neutral-text-muted)] text-[14px] font-light rounded-[var(--radius-md)] hover:bg-[var(--neutral-100)] transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`h-[var(--height-control)] px-5 flex items-center justify-center text-[14px] font-normal rounded-[var(--radius-md)] transition-colors ${confirmClasses}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
