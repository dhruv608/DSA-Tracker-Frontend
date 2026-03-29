// src/components/student/profile/shimmers.tsx
import React from 'react';

export function ProfilePageShimmer() {
  return (
    <div className="w-full max-w-[1200px] mx-auto pb-16 animate-pulse">
      {/* Header Shimmer */}
      <div className="glass borderless p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Profile Image Shimmer */}
            <div className="w-20 h-20 rounded-full bg-muted" />
            
            {/* Name and Metadata Shimmer */}
            <div className="space-y-3">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded-full" />
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-6 w-24 bg-muted rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Actions Shimmer */}
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded" />
            <div className="h-9 w-9 bg-muted rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column Shimmer */}
        <div className="lg:col-span-1 space-y-8">
          {/* Overview Stats Shimmer */}
          <div className="glass p-6">
            <div className="h-6 w-24 bg-muted rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded" />
                    <div className="h-4 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-12 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Profile Info Shimmer */}
          <div className="glass p-6">
            <div className="h-6 w-32 bg-muted rounded mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              ))}
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded">
                  <div className="w-10 h-10 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                  <div className="w-5 h-5 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Shimmer */}
          <div className="glass p-6">
            <div className="h-6 w-28 bg-muted rounded mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded">
                  <div className="w-10 h-10 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                  <div className="w-5 h-5 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="h-9 w-full bg-muted rounded mt-6" />
          </div>
        </div>

        {/* Right Column Shimmer */}
        <div className="lg:col-span-3 space-y-8">
          {/* Problem Solving Stats Shimmer */}
          <div className="glass p-8">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <div className="h-10 w-64 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
              <div className="text-right space-y-1">
                <div className="h-12 w-16 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-muted/30 rounded text-center space-y-3">
                  <div className="h-4 w-12 bg-muted rounded mx-auto" />
                  <div className="h-10 w-16 bg-muted rounded mx-auto" />
                  <div className="h-3 w-20 bg-muted rounded mx-auto" />
                  <div className="h-2 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap Shimmer */}
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="glass p-4">
              <div className="h-32 bg-muted/20 rounded" />
            </div>
          </div>

          {/* Recent Activity Shimmer */}
          <div className="glass p-8">
            <div className="h-6 w-32 bg-muted rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-muted/30 rounded">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-muted rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-40 bg-muted rounded" />
                      <div className="flex justify-between">
                        <div className="h-3 w-20 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="h-6 w-12 bg-muted rounded" />
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
    <div className="glass borderless p-8 mb-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-muted" />
          <div className="space-y-3">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-24 bg-muted rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded" />
          <div className="h-9 w-9 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function OverviewStatsShimmer() {
  return (
    <div className="glass p-6 animate-pulse">
      <div className="h-6 w-24 bg-muted rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileInfoShimmer() {
  return (
    <div className="glass p-6 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded mb-6" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        ))}
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded">
            <div className="w-10 h-10 bg-muted rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="w-5 h-5 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialLinksShimmer() {
  return (
    <div className="glass p-6 animate-pulse">
      <div className="h-6 w-28 bg-muted rounded mb-6" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded">
            <div className="w-10 h-10 bg-muted rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="w-5 h-5 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="h-9 w-full bg-muted rounded mt-6" />
    </div>
  );
}

export function ProblemSolvingStatsShimmer() {
  return (
    <div className="glass p-8 animate-pulse">
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
        <div className="text-right space-y-1">
          <div className="h-12 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-muted/30 rounded text-center space-y-3">
            <div className="h-4 w-12 bg-muted rounded mx-auto" />
            <div className="h-10 w-16 bg-muted rounded mx-auto" />
            <div className="h-3 w-20 bg-muted rounded mx-auto" />
            <div className="h-2 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityHeatmapShimmer() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-muted rounded" />
      <div className="glass p-4">
        <div className="h-32 bg-muted/20 rounded" />
      </div>
    </div>
  );
}

export function RecentActivityShimmer() {
  return (
    <div className="glass p-8 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-muted/30 rounded">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-muted rounded" />
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
