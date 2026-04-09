"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function TopicsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
        >
          <div className="glass backdrop-blur-sm relative hover-glow overflow-hidden cursor-pointer rounded-2xl transition-all duration-300">

            {/* Image Section Shimmer */}
            <Skeleton className="h-[140px] w-full rounded-none" />

            {/* Content Shimmer */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-16 h-3" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-12 h-3" />
                </div>
              </div>

              {/* Progress Bar Shimmer */}
              <div className="space-y-1">
                <Skeleton className="w-full h-1.5" />
                <div className="flex justify-end">
                  <Skeleton className="w-8 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
