"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";

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
  const confirmClasses =
    variant === "danger"
      ? "bg-[var(--feedback-error-base)] hover:bg-[var(--feedback-error-dark)] text-white"
      : "bg-[var(--brand-base)] hover:opacity-90 text-white";

  return (
    <BottomSheet
      open={open}
      onClose={onCancel}
      title={title}
      subtitle={message}
      hasDirtyChanges={false}
      footer={
        <div className="flex gap-2 items-center justify-end">
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
      }
    >
      <div />
    </BottomSheet>
  );
}
