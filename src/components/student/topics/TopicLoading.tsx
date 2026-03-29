"use client";

import React from 'react';

export function TopicsLoading() {
  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Header Shimmer */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="h-10 w-48 bg-muted/50 rounded-lg mb-3 animate-pulse"></div>
            <div className="h-4 w-64 bg-muted/30 rounded mb-3"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-secondary/30 border border-border rounded-2xl p-1 overflow-hidden">
              <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div 
            key={idx} 
            className="animate-in fade-in slide-in-from-bottom-2" 
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="group relative glass hover-glow overflow-hidden cursor-pointer rounded-2xl transition-all duration-300">
              
              {/* Image Section Shimmer */}
              <div className="h-[140px] relative bg-muted/30 animate-pulse"></div>
              
              {/* Content Shimmer */}
              <div className="p-4">
                <div className="h-6 w-3/4 bg-muted/50 rounded-lg mb-2 animate-pulse"></div>
                
                <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-muted/30 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                    <div className="w-12 h-3 bg-muted/30 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Progress Bar Shimmer */}
                <div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-muted/50 animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <div className="mt-1 text-right text-xs text-muted-foreground">
                    <div className="w-8 h-3 bg-muted/30 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
