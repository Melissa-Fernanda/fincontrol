"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { IconSvgElement } from "@hugeicons/react";

export type SidebarItemVariant = "selected" | "default" | "disabled";

export interface SidebarItemProps {
  /** Texto exibido ao lado do ícone (oculto quando sidebar está recolhida) */
  label: string;
  /** Ícone do item (Hugeicons) */
  icon: IconSvgElement;
  /** URL de navegação (ignorado quando variant é "disabled") */
  href: string;
  /** Estado visual do item */
  variant: SidebarItemVariant;
  /** Se true, mostra apenas o ícone (sidebar recolhida) */
  isCollapsed?: boolean;
  /** Chamado ao clicar no item (apenas quando não disabled) */
  onClick?: () => void;
  /** Ícone exibido à direita do item (ex: cadeado para itens bloqueados) */
  rightIcon?: IconSvgElement;
}

const variantStyles: Record<
  SidebarItemVariant,
  string
> = {
  selected:
    "bg-[var(--neutral-static-black)] text-[var(--neutral-static-white)] [&_svg]:text-[var(--neutral-static-white)]",
  default:
    "relative bg-[var(--neutral-50)] text-[var(--neutral-text-muted)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/8 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 before:pointer-events-none [&_svg]:text-[var(--neutral-icons-strong)]",
  disabled:
    "text-[var(--neutral-text-muted)] opacity-50 cursor-not-allowed pointer-events-none [&_svg]:text-[var(--neutral-text-muted)] active:scale-100",
};

const baseStyles =
  "flex items-center gap-3 h-10 px-3 rounded-[var(--radius-md)] w-full transition-all duration-150 ease-out shrink-0 active:scale-[0.98]";

export function SidebarItem({
  label,
  icon,
  href,
  variant,
  isCollapsed = false,
  onClick,
  rightIcon,
}: SidebarItemProps) {
  const styleClass = `${baseStyles} ${variantStyles[variant]} ${
    isCollapsed ? "justify-center px-0 w-10 min-w-10 max-w-10" : ""
  }`;

  const rightIconElement =
    rightIcon && !isCollapsed ? (
      <Icon icon={rightIcon} size={16} className="shrink-0 ml-auto opacity-60" />
    ) : null;

  if (variant === "disabled") {
    return (
      <span
        className={styleClass}
        aria-disabled="true"
        aria-current={undefined}
        role="link"
      >
        <Icon icon={icon} size={20} className="shrink-0" />
        {!isCollapsed && (
          <span className="truncate text-sm font-medium flex-1 min-w-0">
            {label}
          </span>
        )}
        {rightIconElement}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={styleClass}
      aria-current={variant === "selected" ? "page" : undefined}
    >
      <Icon icon={icon} size={20} className="relative z-10 shrink-0" />
      {!isCollapsed && (
        <span className="relative z-10 truncate text-sm font-medium flex-1 min-w-0">
          {label}
        </span>
      )}
      {rightIconElement && <span className="relative z-10 ml-auto">{rightIconElement}</span>}
    </Link>
  );
}
