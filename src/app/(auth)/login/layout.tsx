import React from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Absolute Header for Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/5 dark:bg-amber-900/10 blur-3xl pointer-events-none" />

      <div className="bg-card w-full max-w-[440px] p-10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-border/80 z-10 animate-in fade-in zoom-in-95 duration-500 relative">
        {children}
      </div>
    </div>
  );
}
