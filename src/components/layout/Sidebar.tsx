"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  DashboardSquare01Icon,
  Calendar01Icon,
  BarChartIcon,
  Target01Icon,
  CreditCardIcon,
  Invoice01Icon,
  Settings01Icon,
  CircleLock01Icon,
  CircleUnlock01Icon,
  Logout01Icon,
  LockedIcon,
} from "@/components/icons";
import { UserProfile } from "@/components/layout/UserProfile";
import { SidebarItem } from "@/components/layout/SidebarItem";
import type { SidebarItemVariant } from "@/components/layout/SidebarItem";
import { useSidebar } from "@/contexts/SidebarContext";

interface SidebarProps {
  variant?: "default" | "drawer";
}

const navItems: Array<{
  id: string;
  label: string;
  icon: typeof DashboardSquare01Icon;
  href: string;
  disabled?: boolean;
  locked?: boolean;
}> = [
  { id: "dashboard", label: "Dashboard", icon: DashboardSquare01Icon, href: "/" },
  { id: "transacoes", label: "Transações", icon: Calendar01Icon, href: "/transacoes" },
  {
    id: "orcamento",
    label: "Orçamento",
    icon: BarChartIcon,
    href: "/orcamento",
    locked: true,
    disabled: true,
  },
  {
    id: "metas",
    label: "Metas",
    icon: Target01Icon,
    href: "/metas",
    locked: true,
    disabled: true,
  },
  { id: "contas-fixas", label: "Contas Fixas", icon: CreditCardIcon, href: "/contas-fixas" },
  {
    id: "dividas",
    label: "Dívidas",
    icon: Invoice01Icon,
    href: "/dividas",
    locked: true,
    disabled: true,
  },
  {
    id: "config",
    label: "Config. & Autom...",
    icon: Settings01Icon,
    href: "/config",
    locked: true,
    disabled: true,
  },
];

const pathToId: Record<string, string> = {
  "/": "dashboard",
  "/transacoes": "transacoes",
  "/contas-fixas": "contas-fixas",
  "/orcamento": "orcamento",
  "/metas": "metas",
  "/dividas": "dividas",
  "/config": "config",
};

function SidebarContent({ isCollapsed, isLocked, setCollapsed, toggleLock, activeId, onNavigate }: {
  isCollapsed: boolean;
  isLocked: boolean;
  setCollapsed: (v: boolean) => void;
  toggleLock: () => void;
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div
        className={`flex items-center gap-3 min-h-10 ${
          isCollapsed ? "justify-center p-4" : "justify-between p-4"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 h-10">
          <Image
            src="/logo-symbol.svg"
            alt="finControl"
            width={40}
            height={40}
            className="shrink-0 h-10 w-10 object-contain"
          />
          {!isCollapsed && (
            <span className="font-semibold text-[var(--neutral-text-black)] truncate">
              FinControl<span className="text-[var(--brand-base)]">+</span>
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={toggleLock}
            className="shrink-0 relative min-w-10 max-w-10 min-h-10 max-h-10 rounded-[var(--radius-md)] p-2 bg-[var(--neutral-75)] flex items-center justify-center text-[var(--neutral-icons-muted)] shadow-none before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/8 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 before:pointer-events-none active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--neutral-stroke-strong)] transition-transform duration-150 ease-out"
            aria-label={isLocked ? "Destravar e recolher sidebar" : "Travar sidebar expandida"}
          >
            <Icon
              icon={isLocked ? CircleLock01Icon : CircleUnlock01Icon}
              size={18}
              className="relative z-10 shrink-0"
            />
          </button>
        )}
      </div>
      {!isCollapsed && (
        <UserProfile
          name="Melissa Fernanda"
          initials="MF"
        />
      )}
      <nav
        className={`flex-1 min-h-0 space-y-1 overflow-y-auto flex flex-col ${
          isCollapsed ? "items-center px-2" : "px-3"
        }`}
      >
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const variant: SidebarItemVariant = item.disabled
            ? "disabled"
            : isActive
              ? "selected"
              : "default";
          return (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              href={item.href}
              variant={variant}
              isCollapsed={isCollapsed}
              onClick={onNavigate}
              rightIcon={item.locked ? LockedIcon : undefined}
            />
          );
        })}
      </nav>
      <div className={isCollapsed ? "flex justify-center p-2" : "p-3"}>
        <button
          type="button"
          className={`relative flex items-center gap-3 h-10 rounded-[var(--radius-md)] bg-[var(--feedback-error-base)]/10 text-[var(--feedback-error-base)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/8 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 before:pointer-events-none active:scale-[0.98] transition-all duration-150 ease-out ${
            isCollapsed ? "justify-center px-0 w-10 min-w-10 max-w-10" : "w-full px-3"
          }`}
        >
          <Icon icon={Logout01Icon} size={20} className="relative z-10 shrink-0" />
          {!isCollapsed && <span className="relative z-10 text-sm font-medium">Sair</span>}
        </button>
      </div>
    </>
  );
}

export function Sidebar({ variant = "default" }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, isLocked, setCollapsed, toggleLock, isMobileDrawerOpen, setMobileDrawerOpen } = useSidebar();
  const activeId = pathToId[pathname] ?? "dashboard";

  if (variant === "drawer") {
    return (
      <>
        {/* Overlay - visible on mobile when drawer open */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
            isMobileDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden
          onClick={() => setMobileDrawerOpen(false)}
        />
        {/* Drawer - slides in from left on mobile */}
        <aside
          className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 max-w-[85vw] flex flex-col bg-[var(--neutral-25)] rounded-r-[20px] shadow-[var(--shadow-modal)] transition-transform duration-200 ease-out ${
            isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            isCollapsed={false}
            isLocked={false}
            setCollapsed={() => {}}
            toggleLock={() => {}}
            activeId={activeId}
            onNavigate={() => setMobileDrawerOpen(false)}
          />
        </aside>
      </>
    );
  }

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => !isLocked && setCollapsed(true)}
      className={`flex flex-col min-h-0 bg-[var(--neutral-25)] rounded-r-[20px] shrink-0 transition-all duration-200 h-full shadow-[var(--shadow-card)] ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <SidebarContent
        isCollapsed={isCollapsed}
        isLocked={isLocked}
        setCollapsed={setCollapsed}
        toggleLock={toggleLock}
        activeId={activeId}
      />
    </aside>
  );
}
