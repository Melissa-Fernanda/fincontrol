"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarMobileTrigger } from "@/components/layout/SidebarMobileTrigger";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <FinanceProvider>
      <div className="flex min-h-0 overflow-hidden bg-[var(--background)] font-sans h-[var(--app-height)] min-h-[var(--app-height)]">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden lg:block h-full py-4 pr-1 min-h-0 box-border bg-[var(--surface-input)] shrink-0">
          <Sidebar />
        </div>

        {/* Mobile: sidebar as drawer + overlay */}
        <Sidebar variant="drawer" />

        {/* Main content */}
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-auto scroll-touch p-4 pt-14 lg:pt-4 bg-[var(--surface-input)] flex flex-col relative">
          {/* Mobile menu trigger - visible only on mobile */}
          <SidebarMobileTrigger />
          {children}
        </main>
      </div>
      </FinanceProvider>
    </SidebarProvider>
  );
}
