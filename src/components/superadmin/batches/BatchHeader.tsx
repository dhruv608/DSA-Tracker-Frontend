"use client";

import { Layers } from 'lucide-react';

interface BatchHeaderProps {
  totalBatches?: number;
}

export function BatchHeader({ totalBatches }: BatchHeaderProps) {
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
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-chart-3/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-3/10 blur-3xl rounded-full"></div>
      </div>

      <div className="flex items-center justify-between relative z-10">

        {/* 🔹 LEFT */}
        <div className="flex items-center gap-4">

          {/* Icon */}
          <div className="
            p-3 rounded-xl
            bg-chart-3/10
            border border-chart-3/30
            shadow-sm
          ">
            <Layers className="h-5 w-5 text-chart-3" />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Batch Management
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Organize class batches across cities and academic years.
            </p>
          </div>
        </div>

        {/* 🔸 RIGHT (COUNT BADGE) */}
        {totalBatches !== undefined && (
          <div className="
    inline-flex items-center gap-1.5
    text-xs font-semibold tracking-wide
    px-3 py-1.5 rounded-full
    bg-chart-3/10 text-chart-3
    border border-chart-3/20
    shadow-[0_0_10px_var(--hover-glow)]
  ">
            <Layers className="w-3 h-3" />
            {totalBatches} Batches
          </div>
        )}
      </div>
    </div>
  );
}
