import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PodiumShimmer() {
  return (
    <div className="relative pt-12 pb-8 bg-gradient-to-b from-primary/5 via-card to-card border border-border rounded-xl shadow-sm overflow-hidden flex items-end justify-center gap-4 md:gap-12 min-h-[350px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {[1, 2, 3].map((rank) => (
        <div key={rank} className="flex flex-col items-center w-28 md:w-36">
          <div className="relative rounded-full p-1 bg-gradient-to-tr from-card to-muted mb-[-24px] z-20">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="w-full h-40 bg-card border-x border-t border-border rounded-t-2xl" />
        </div>
      ))}
    </div>
  );
}
