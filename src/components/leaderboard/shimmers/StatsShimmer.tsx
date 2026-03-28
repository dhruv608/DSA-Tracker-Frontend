import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatsShimmer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}