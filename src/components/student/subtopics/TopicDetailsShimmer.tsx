"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SubtopicBackNav } from './SubtopicBackNav';

export function TopicDetailsShimmer() {
  return (
    <div className="flex flex-col mx-auto max-w-325 xl:max-w-275 w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Back Nav Button - Always Visible */}
      <SubtopicBackNav />

      {/* Topic Header Shimmer */}
      <div className="mb-10 rounded-2xl glass bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* LEFT VISUAL */}
          <div className="relative md:w-[32%] h-45 md:h-auto border border-border/60 overflow-hidden">
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
            {/* TOP */}
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* BOTTOM */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-5 border-t border-border/40">
              {/* STATS CARDS */}
              <div className="flex items-center gap-4">
                {/* Classes */}
                <div className="px-4 py-2 rounded-2xl bg-background/40 border border-border/40 space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-6 w-6" />
                </div>

                {/* Questions */}
                <div className="px-4 py-2 rounded-2xl bg-background/40 border border-border/40 space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-8" />
                </div>
              </div>

              {/* PROGRESS BLOCK */}
              <div className="flex-1 sm:ml-auto w-full sm:max-w-65 space-y-1">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="w-full h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLASSES SECTION */}
      <div className="mt-6 rounded-2xl border border-border/40 glass bg-background/40 backdrop-blur-xl p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3 mb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
            >
              <div className="group flex backdrop-blur-2xl border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 p-6">
                {/* Left side - Index and Icon */}
                <div className="flex items-center gap-4 mr-6">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-6 h-6" />
                </div>

                {/* Middle - Content */}
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="w-20 h-3" />
                    </div>
                  </div>

                  {/* Progress Bar Shimmer */}
                  <div className="w-full max-w-md">
                    <Skeleton className="w-full h-2" />
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex justify-center items-center gap-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-16 h-8" />
            <Skeleton className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
