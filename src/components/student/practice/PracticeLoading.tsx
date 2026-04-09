"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function PracticeLoading() {
  return (
    <div className="flex flex-col gap-3 min-h-100 border border-border/40 rounded-2xl p-9 backdrop-blur-sm">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{
            animationDelay: `${idx * 40}ms`,
            animationFillMode: 'both'
          }}
        >
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 backdrop-blur-sm">

            {/* LEFT */}
            <div className="flex items-start gap-4 w-full">

              {/* ICON */}
              <Skeleton className="w-5 h-5 rounded-full mt-1" />

              {/* TEXT */}
              <div className="flex flex-col gap-2 w-full">

                {/* TITLE */}
                <Skeleton className="h-4 w-[60%]" />

                {/* TOPIC */}
                <Skeleton className="h-3 w-[30%]" />

                {/* META BADGES */}
                <div className="flex items-center gap-2 mt-1">

                  {/* LEVEL */}
                  <Skeleton className="h-5 w-12 rounded-2xl" />

                  {/* PLATFORM */}
                  <Skeleton className="h-5 w-20 rounded-2xl" />

                  {/* TYPE */}
                  <Skeleton className="h-5 w-16 rounded-2xl" />

                </div>

              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 ml-4">

              {/* BOOKMARK */}
              <Skeleton className="w-9 h-9 rounded-2xl" />

              {/* BUTTON */}
              <Skeleton className="h-9 w-20 rounded-2xl" />

            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
