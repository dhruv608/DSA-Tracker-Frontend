"use client";

import React from 'react';

export function TopicDetailsShimmer() {
  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Back Navigation Shimmer */}
      <div className="mb-6">
        <div className="w-20 h-4 bg-muted/50 rounded animate-pulse"></div>
      </div>

      {/* Topic Header Shimmer */}
      <div className="bg-card border border-border/70 rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row">
        {/* Image Section Shimmer */}
        <div className="md:w-1/3 h-[160px] md:h-auto bg-muted/30 animate-pulse"></div>
        
        {/* Content Section Shimmer */}
        <div className="flex-1 p-6">
          <div className="h-8 w-3/4 bg-muted/50 rounded-lg mb-4 animate-pulse"></div>
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-muted/30 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse"></div>
          </div>
          
          {/* Progress Bar Shimmer */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted/40 rounded animate-pulse"></div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-muted/50 animate-pulse" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section Header Shimmer */}
      <div className="mb-5">
        <div className="h-4 w-32 bg-muted/50 rounded animate-pulse"></div>
      </div>

      {/* Class Cards Shimmer */}
      <div className="flex flex-col gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
          >
            <div className="group flex bg-card border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 p-6">
              {/* Left side - Index and Icon */}
              <div className="flex items-center gap-4 mr-6">
                <div className="w-8 h-8 bg-muted/40 rounded-full animate-pulse"></div>
                <div className="w-6 h-6 bg-muted/30 rounded animate-pulse"></div>
              </div>
              
              {/* Middle - Content */}
              <div className="flex-1">
                <div className="h-6 w-1/3 bg-muted/50 rounded-lg mb-3 animate-pulse"></div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-muted/20 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
                    <div className="w-20 h-3 bg-muted/20 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Progress Bar Shimmer */}
                <div className="w-full max-w-md">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-muted/40 animate-pulse" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Actions */}
              <div className="flex items-center gap-3">
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
