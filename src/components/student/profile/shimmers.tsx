// src/components/student/profile/shimmers.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePageShimmer() {
  return (
    <div className="w-full max-w-325 xl:max-w-275 2xl:max-w-325 mx-auto pb-16 mt-3">
      {/* Header Shimmer */}
      <div className="glass backdrop-blur-3xl border-0 p-8 mb-8 rounded-2xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Profile Image Shimmer */}
            <Skeleton className="w-20 h-20 rounded-full border-2 border-border/60 shadow-sm" />

            {/* Name and Metadata Shimmer */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* Actions Shimmer */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column Shimmer */}
        <div className="lg:col-span-1 space-y-8">
          {/* Overview Stats Shimmer */}
          <div className="glass backdrop-blur-3xl border-0 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <Skeleton className="h-6 w-24 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-muted/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Profile Info Shimmer */}
          <div className="glass backdrop-blur-3xl border-0 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-muted/20 rounded-xl">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl">
                  <Skeleton className="w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Shimmer */}
          <div className="glass backdrop-blur-3xl border-0 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <Skeleton className="h-6 w-28 mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl">
                  <Skeleton className="w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="w-5 h-5" />
                </div>
              ))}
            </div>
            <Skeleton className="h-9 w-full mt-6" />
          </div>
        </div>

        {/* Right Column Shimmer */}
        <div className="lg:col-span-3 space-y-8">
          {/* Problem Solving Stats Shimmer */}
          <div className="glass backdrop-blur-3xl border-0 p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-muted/20 rounded-xl text-center space-y-3">
                  <Skeleton className="h-4 w-12 mx-auto" />
                  <Skeleton className="h-10 w-16 mx-auto" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap Shimmer */}
          <div className="space-y-4 backdrop-blur-3xl glass animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
            <Skeleton className="h-6 w-48" />
            <div className="glass border-0 p-4 rounded-2xl">
              <Skeleton className="h-32" />
            </div>
          </div>

          {/* Recent Activity Shimmer */}
          <div className="glass backdrop-blur-3xl border-0 p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-muted/20 rounded-xl">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="w-10 h-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual component shimmers if you want to use them separately
export function ProfileHeaderShimmer() {
  return (
    <div className="glass borderless p-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

export function OverviewStatsShimmer() {
  return (
    <div className="glass p-6">
      <Skeleton className="h-6 w-24 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileInfoShimmer() {
  return (
    <div className="glass p-6">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded">
            <Skeleton className="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="w-5 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialLinksShimmer() {
  return (
    <div className="glass p-6">
      <Skeleton className="h-6 w-28 mb-6" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded">
            <Skeleton className="w-10 h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="w-5 h-5" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-full mt-6" />
    </div>
  );
}

export function ProblemSolvingStatsShimmer() {
  return (
    <div className="glass p-8">
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-muted/30 rounded text-center space-y-3">
            <Skeleton className="h-4 w-12 mx-auto" />
            <Skeleton className="h-10 w-16 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityHeatmapShimmer() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="glass p-4">
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export function RecentActivityShimmer() {
  return (
    <div className="glass p-8">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-muted/30 rounded">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-10 h-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
