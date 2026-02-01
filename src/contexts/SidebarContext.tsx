"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  isLocked: boolean;
  isMobileDrawerOpen: boolean;
  setCollapsed: (value: boolean) => void;
  setLocked: (value: boolean) => void;
  toggleLock: () => void;
  setMobileDrawerOpen: (value: boolean) => void;
  toggleMobileDrawer: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setCollapsed] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const setLocked = useCallback((value: boolean) => {
    setIsLocked(value);
    if (!value) setCollapsed(true);
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => {
      if (prev) {
        setCollapsed(true);
        return false;
      }
      return true;
    });
  }, []);

  const toggleMobileDrawer = useCallback(() => {
    setMobileDrawerOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isLocked,
        isMobileDrawerOpen,
        setCollapsed,
        setLocked,
        toggleLock,
        setMobileDrawerOpen,
        toggleMobileDrawer,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
