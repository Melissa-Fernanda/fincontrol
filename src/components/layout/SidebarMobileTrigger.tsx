"use client";

import { Icon } from "@/components/ui/Icon";
import { Menu01Icon } from "@/components/icons";
import { useSidebar } from "@/contexts/SidebarContext";

export function SidebarMobileTrigger() {
  const { toggleMobileDrawer } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleMobileDrawer}
      className="lg:hidden absolute top-4 left-4 z-20 flex items-center justify-center w-10 h-10 min-w-10 min-h-10 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--neutral-100)] shadow-[var(--shadow-card)] text-[var(--neutral-icons-strong)] hover:bg-[var(--neutral-75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] transition-colors"
      aria-label="Abrir menu"
    >
      <Icon icon={Menu01Icon} size={24} />
    </button>
  );
}
