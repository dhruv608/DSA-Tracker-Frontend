import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ShimmerEffectProps {
  className?: string;
}

export default function ShimmerEffect({ className = '' }: ShimmerEffectProps) {
  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header Shimmer */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Filters Shimmer */}
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Podium Shimmer */}
      <div className="relative pt-12 pb-8 bg-gradient-to-b from-primary/5 via-card to-card border border-border rounded-xl shadow-sm overflow-hidden flex items-end justify-center gap-4 md:gap-12 min-h-[350px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Podium Items Shimmer */}
        <div className="flex flex-col items-center w-28 md:w-36">
          <div className="relative rounded-full p-1 bg-gradient-to-tr from-card to-muted mb-[-24px] z-20">
            <Skeleton className="w-20 h-20 md:w-32 md:h-32 rounded-full" />
            <Skeleton className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>
          <Skeleton className="w-full h-40 md:h-52 bg-card border-x border-t border-border rounded-t-2xl" />
        </div>
        
        <div className="flex flex-col items-center w-28 md:w-36">
          <div className="relative rounded-full p-1 bg-gradient-to-tr from-card to-muted mb-[-24px] z-20">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
            <Skeleton className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>
          <Skeleton className="w-full h-32 md:h-40 bg-card border-x border-t border-border rounded-t-2xl" />
        </div>
        
        <div className="flex flex-col items-center w-28 md:w-36">
          <div className="relative rounded-full p-1 bg-gradient-to-tr from-card to-muted mb-[-24px] z-20">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
            <Skeleton className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>
          <Skeleton className="w-full h-28 md:h-36 bg-card border-x border-t border-border rounded-t-2xl" />
        </div>
      </div>

      {/* Stats Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Table Shimmer */}
      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/20">
              <tr>
                <th className="p-4 text-left"><Skeleton className="h-4 w-8" /></th>
                <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
                <th className="p-4 text-left"><Skeleton className="h-4 w-12" /></th>
                <th className="p-4 text-left"><Skeleton className="h-4 w-8" /></th>
                <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
                <th className="p-4 text-left"><Skeleton className="h-4 w-8" /></th>
                <th className="p-4 text-left"><Skeleton className="h-4 w-12" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-4"><Skeleton className="h-8 w-8" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-8" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Shimmer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
