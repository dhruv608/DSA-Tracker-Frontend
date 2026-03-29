"use client";

import { Users } from 'lucide-react';

interface AdminHeaderProps {
  totalAdmins?: number;
}
export function AdminHeader({ totalAdmins }: AdminHeaderProps) {
return (
  <div className="
    glass hover-glow
    rounded-2xl p-5 mb-8
    border border-border/30
    relative overflow-hidden
    group
  ">

    {/* ✨ Ambient Glow */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
    </div>

    <div className="flex items-center justify-between relative z-10">
      
      {/* 🔹 LEFT */}
      <div className="flex items-center gap-4">

        {/* Icon */}
        <div className="
          p-3 rounded-xl
          bg-primary/10
          border border-primary/30
          shadow-sm group-hover:shadow-md
          transition
        ">
          <Users className="h-5 w-5 text-primary" />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Admin Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create and manage administrators, assign cities and batches.
          </p>
        </div>
      </div>

      {/* 🔸 RIGHT (UPGRADED BADGE) */}
      {totalAdmins !== undefined && (
        <div className="
          inline-flex items-center gap-1.5
          text-xs font-semibold tracking-wide
          px-3 py-1.5 rounded-full
          bg-primary/10 text-primary
          border border-primary/20
          shadow-[0_0_10px_var(--hover-glow)]
        ">
          <Users className="w-3 h-3" />
          {totalAdmins} Admin{totalAdmins !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  </div>
);
}
