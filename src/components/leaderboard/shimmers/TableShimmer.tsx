import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TableShimmer() {
  return (
    <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
      <div className="p-4 border-border">
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
              <tr key={i} className="border-border">
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
    </div>
  );
}