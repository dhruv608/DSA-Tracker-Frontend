import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PodiumShimmer() {
  return (
    <div className="relative pt-12 pb-8 bg-gradient-to-b from-primary/5 via-card to-card border border-border rounded-xl shadow-sm overflow-hidden flex items-end justify-center gap-4 md:gap-12 min-h-[350px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {[1, 2, 3].map((rank) => (
        <div key={rank} className="flex flex-col items-center w-28 md:w-36">
          <div className="relative rounded-full p-1 bg-gradient-to-tr from-card to-muted mb-[-24px] z-20">
            <Skeleton className={`w-20 h-20 ${rank === 1 ? 'md:w-32 md:h-32' : rank === 2 ? 'md:w-24 md:h-40' : 'md:w-24 md:h-36'} rounded-full`} />
            <Skeleton className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>
          <Skeleton className={`w-full ${rank === 1 ? 'h-40 md:h-52' : rank === 2 ? 'h-32 md:h-40' : 'h-28 md:h-36'} bg-card border-x border-t border-border rounded-t-2xl`} />
        </div>
      ))}
    </div>
  );
}