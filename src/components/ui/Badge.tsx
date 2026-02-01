import { type ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "brand";

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: {
    bg: "bg-[var(--feedback-success-base)]/10",
    text: "text-[var(--feedback-success-base)]",
  },
  warning: {
    bg: "bg-[var(--feedback-warning-base)]/10",
    text: "text-[var(--feedback-warning-base)]",
  },
  error: {
    bg: "bg-[var(--feedback-error-base)]/10",
    text: "text-[var(--feedback-error-base)]",
  },
  info: {
    bg: "bg-[var(--feedback-info-base)]/10",
    text: "text-[var(--feedback-info-base)]",
  },
  neutral: {
    bg: "bg-[var(--neutral-500)]/10",
    text: "text-[var(--neutral-700)]",
  },
  brand: {
    bg: "bg-[var(--brand-base)]/10",
    text: "text-[var(--brand-base)]",
  },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  leftIcon,
  rightIcon,
  className = "",
}: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-2 py-1.5 w-fit
        text-sm font-light
        ${styles.bg} ${styles.text}
        ${className}
      `}
    >
      {leftIcon && (
        <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{rightIcon}</span>
      )}
    </div>
  );
}
