"use client";

import React from 'react';

export function ClassDetailsShimmer() {
  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Back Navigation Shimmer */}
      <div className="mb-6">
        <div className="w-20 h-4 bg-muted/50 rounded animate-pulse"></div>
      </div>

      {/* Class Header Shimmer */}
      <div className="mb-8">
        {/* Meta Info Shimmer */}
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <div className="h-6 w-32 bg-muted/40 rounded-full animate-pulse"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-muted/20 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-muted/20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Title Shimmer */}
        <div className="h-10 w-3/4 bg-muted/50 rounded-lg mb-4 animate-pulse"></div>
        
        {/* Description Shimmer */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-muted/30 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse"></div>
        </div>

        {/* Progress Section Shimmer */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-muted/40 rounded animate-pulse"></div>
            <div className="h-5 w-24 bg-muted/40 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-muted/50 animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Filter Controls Shimmer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-4 bg-muted/40 rounded animate-pulse"></div>
          <div className="w-[150px] h-9 bg-muted/30 rounded-md animate-pulse"></div>
        </div>
        <div className="w-32 h-4 bg-muted/20 rounded animate-pulse"></div>
      </div>

      {/* Question Rows Shimmer */}
      <div className="flex flex-col gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
          >
            <div className="group flex bg-card border border-border/70 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 rounded-xl overflow-hidden transition-all duration-300 p-4">
              {/* Left side - Status and Index */}
              <div className="flex items-center gap-4 mr-6">
                <div className="w-5 h-5 bg-muted/40 rounded-full animate-pulse"></div>
                <div className="w-6 h-6 bg-muted/30 rounded animate-pulse"></div>
              </div>
              
              {/* Middle - Question Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="h-5 w-4/5 bg-muted/50 rounded-lg mb-2 animate-pulse"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-5 bg-muted/30 rounded animate-pulse"></div>
                      <div className="w-12 h-5 bg-muted/30 rounded animate-pulse"></div>
                      <div className="w-14 h-5 bg-muted/30 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Shimmer */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/50 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
        <div className="w-16 h-8 bg-muted/30 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
