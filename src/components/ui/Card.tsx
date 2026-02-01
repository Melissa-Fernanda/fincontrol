import { type ReactNode } from "react";

type CardVariant = "primary" | "secondary";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

const variantStyles: Record<
  CardVariant,
  { bg: string; text: string; border: string; shadow: string }
> = {
  primary: {
    bg: "bg-[var(--brand-base)]",
    text: "text-[var(--neutral-text-white)]",
    border: "border-transparent",
    shadow: "shadow-[var(--shadow-card)]",
  },
  secondary: {
    bg: "bg-[var(--neutral-static-white)]",
    text: "text-[var(--neutral-text-black)]",
    border: "border-[var(--neutral-stroke-soft)]",
    shadow: "shadow-[var(--shadow-card)]",
  },
};

export function Card({
  children,
  variant = "secondary",
  className = "",
}: CardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        rounded-[var(--radius-md)]
        p-4
        border
        ${styles.bg} ${styles.text} ${styles.border} ${styles.shadow}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3
      className={`text-base font-semibold leading-tight ${className}`}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className = "",
}: CardDescriptionProps) {
  return (
    <p
      className={`text-sm opacity-90 mt-1 ${className}`}
    >
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return <div className={`mt-4 pt-3 border-t border-current/10 ${className}`}>{children}</div>;
}
