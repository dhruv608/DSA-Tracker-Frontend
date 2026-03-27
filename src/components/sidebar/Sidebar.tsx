"use client";

import React from "react";
import { LogOut, LucideIcon, ChevronRight } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export interface SidebarNavItems {
  href: string;
  label: string;
  icon: LucideIcon;
  showDivider?: boolean;
  dividerLabel?: string;
}

interface SidebarProps {
  role: "admin" | "superadmin";
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; role: string; email?: string } | null;
  navItems: SidebarNavItems[];
  onLogout: () => void;
  portalLabel?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  user,
  navItems,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          ${isCollapsed ? "w-[72px]" : "w-[260px]"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0 fixed lg:relative top-0 left-0 h-[100vh]
          flex z-40 lg:z-20

          overflow-hidden

          transition-all duration-300 ease-in-out

          ${isCollapsed ? "p-2" : "p-3"}
        `}
      >
        {/* GLASS CONTAINER */}
        <div className="relative h-full w-full flex flex-col rounded-2xl glass overflow-hidden">

          {/* HEADER */}
        <div
  className={`
    p-4 flex items-center

    ${isCollapsed ? "justify-center" : "justify-between"}
  `}
>

  {/* LOGO */}
  <h1
    className={`
      font-serif italic text-2xl font-bold text-logo tracking-tight
      transition-all duration-300 whitespace-nowrap

      ${isCollapsed
        ? "opacity-0 w-0 overflow-hidden"
        : "opacity-100"}
    `}
  >
    BruteForce
  </h1>

  {/* TOGGLE BUTTON */}
  <button
    onClick={onToggleCollapse}
    className="
      flex items-center justify-center

      h-9 w-9 rounded-full

      bg-[var(--glass-bg)]
      backdrop-blur-md
      border border-[var(--glass-border)]

      text-muted-foreground

      transition-all duration-300

      hover:text-foreground
      hover:shadow-[0_0_12px_var(--hover-glow)]
      hover:scale-105

      active:scale-95

      shrink-0
    "
  >
    <ChevronRight
      className={`
        w-4 h-4 transition-transform duration-300
        ${isCollapsed ? "rotate-0" : "rotate-180"}
      `}
    />
  </button>
</div>

          {/* NAV */}
          <nav
            className={`
              flex-1 space-y-1 overflow-y-auto custom-scrollbar
              ${isCollapsed ? "py-4" : "px-2 py-4"}
            `}
          >
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={false}
                showDivider={item.showDivider}
                dividerLabel={item.dividerLabel}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* USER SECTION (ANIMATED) */}
          <div
            className={`
              border-t border-border transition-all duration-300

              ${isCollapsed
                ? "opacity-0 h-0 overflow-hidden pointer-events-none"
                : "opacity-100 p-3 pt-4"}
            `}
          >
            {user && (
              <button
                onClick={onLogout}
                className="
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg

                  text-muted-foreground hover:text-foreground

                  hover:bg-[rgba(204,255,0,0.05)]
                  hover:shadow-[0_0_12px_var(--hover-glow)]

                  transition-all duration-200
                "
              >
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center font-bold text-sm uppercase">
                  {user.name?.charAt(0) || "A"}
                </div>

                <div className="text-left flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-foreground">
                    {user.name || "Admin"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Logout Session
                  </div>
                </div>

                <LogOut className="w-5 h-5 opacity-70" />
              </button>
            )}
          </div>

          {/* COLLAPSED USER ICON */}
          {isCollapsed && user && (
            <div className="p-3 pt-4 border-t border-border flex justify-center">
              <button
                onClick={onLogout}
                className="
                  w-10 h-10 rounded-lg bg-muted flex items-center justify-center
                  hover:bg-[rgba(204,255,0,0.1)]
                  transition-all duration-200
                "
              >
                {user.name?.charAt(0) || "A"}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}