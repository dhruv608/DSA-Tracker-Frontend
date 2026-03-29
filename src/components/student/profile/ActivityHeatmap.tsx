// src/components/student/profile/ActivityHeatmap.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import { HeatmapData } from '@/types/student';

interface ActivityHeatmapProps {
  heatmap?: HeatmapData[];
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  return (
    <div>
      <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
        <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
        Activity Heatmap (Full Year)
      </h3>
      {heatmap && heatmap.length > 0 ? (
        <div className="glass p-4 rounded-[var(--radius-lg)]">
          {/* GitHub-style horizontal layout */}
          <div className="flex flex-col gap-2">
            {/* Month labels */}
            <div className="flex items-start gap-2">
              <div className="w-10 h-3 flex items-center justify-end text-[var(--text-xs)] text-[var(--text-secondary)]">
                {/* Empty space for day labels */}
              </div>
              <div className="flex-1 flex justify-between text-[var(--text-xs)] text-[var(--text-secondary)]">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

            {/* Heatmap grid */}
            <div className="flex items-start gap-2">
              {/* Day labels */}
              <div className="flex flex-col gap-0.5 w-10 text-[var(--text-xs)] text-[var(--text-secondary)]">
                <div className="h-3 flex items-center justify-end">Mon</div>
                <div className="h-3"></div>
                <div className="h-3"></div>
                <div className="h-3 flex items-center justify-end">Wed</div>
                <div className="h-3"></div>
                <div className="h-3"></div>
                <div className="h-3 flex items-center justify-end">Fri</div>
                <div className="h-3"></div>
              </div>

              {/* Heatmap cells - Horizontal layout */}
              <div className="flex-1 flex gap-0.5">
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      // Calculate the date for this cell (full year = 364 days)
                      const dayOffset = (weekIndex * 7) + dayIndex;
                      const date = new Date(today);
                      date.setDate(date.getDate() - (364 - dayOffset));

                      // Skip if date is in the future
                      if (date > today) {
                        return <div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                      }

                      const dateStr = date.toISOString().split('T')[0];
                      const dayData = heatmap.find((h: HeatmapData) => new Date(h.date).toISOString().split('T')[0] === dateStr);

                      const count = dayData ? dayData.count : 0;
                      let bgClass = "bg-secondary/30 border border-border/50";
                      if (count === 0) bgClass = "bg-secondary/30 border border-border/50";
                      else if (count === 1) bgClass = "bg-primary/20 border border-primary/30";
                      else if (count === 2) bgClass = "bg-primary/40 border border-primary/50";
                      else if (count === 3) bgClass = "bg-primary/60 border border-primary/70";
                      else if (count >= 4) bgClass = "bg-primary border border-primary";

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 ${bgClass} transition-all hover:scale-110 hover:z-10 cursor-pointer`}
                          title={`${count} submissions on ${date.toLocaleDateString()}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend and stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-3 text-[var(--text-xs)] text-[var(--text-secondary)]">
              <span>Less</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 bg-[var(--muted)] border border-[var(--border)]"></div>
                <div className="w-3 h-3 border border-[var(--border)]" style={{backgroundColor: 'var(--primary)', opacity: 0.2}}></div>
                <div className="w-3 h-3 border border-[var(--border)]" style={{backgroundColor: 'var(--primary)', opacity: 0.4}}></div>
                <div className="w-3 h-3 border border-[var(--border)]" style={{backgroundColor: 'var(--primary)', opacity: 0.6}}></div>
                <div className="w-3 h-3 border border-[var(--border)]" style={{backgroundColor: 'var(--primary)'}}></div>
              </div>
              <span>More</span>
            </div>

            {/* Stats summary */}
            <div className="flex items-center gap-4 text-[var(--text-xs)] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border border-[var(--border)]" style={{backgroundColor: 'var(--primary)', opacity: 0.2}}></div>
                {heatmap.reduce((sum: number, h: HeatmapData) => sum + (h.count > 0 ? 1 : 0), 0)} active days
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {heatmap.reduce((sum: number, h: HeatmapData) => sum + h.count, 0)} total submissions
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="p-8 flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)]"
          style={{
            height: 'var(--spacing-2xl)',
            backgroundColor: 'var(--card)'
          }}
        >
          <div className="text-center">
            <Activity className="w-6 h-6 mx-auto mb-2 text-[var(--text-secondary)]" />
            <div className="text-[var(--text-sm)] text-[var(--text-secondary)]">No activity data available yet. Start solving!</div>
          </div>
        </div>
      )}
    </div>
  );
}
