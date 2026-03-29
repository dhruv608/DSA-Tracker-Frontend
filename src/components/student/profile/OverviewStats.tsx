// src/components/student/profile/OverviewStats.tsx
import React from 'react';
import { Award, Trophy, Target, Flame } from 'lucide-react';

interface OverviewStatsProps {
  leaderboard?: { globalRank?: number; cityRank?: number };
  streak?: { maxStreak?: number; currentStreak?: number; count?: number; hasQuestion?: boolean };
}

export function OverviewStats({ leaderboard, streak }: OverviewStatsProps) {
  return (
    <div className="glass p-6 rounded-[var(--radius-lg)]">
      <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
        <Award className="w-5 h-5 text-[var(--accent-primary)]" />
        Overview
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200 bg-[var(--accent-secondary)] rounded-[var(--radius-lg)]">
          <span className="font-medium flex items-center gap-2 text-[var(--text-sm)] text-[var(--text-secondary)]">
            <Trophy className="w-4 h-4 text-[var(--accent-primary)]" />
            Global Rank
          </span>
          <span className="font-bold font-mono text-[var(--text-xl)] text-[var(--foreground)]">
            #{leaderboard?.globalRank || '-'}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200 bg-[var(--accent-secondary)] rounded-[var(--radius-lg)]">
          <span className="font-medium flex items-center gap-2 text-[var(--text-sm)] text-[var(--text-secondary)]">
            <Target className="w-4 h-4 text-[var(--accent-primary)]" />
            City Rank
          </span>
          <span className="font-bold font-mono text-[var(--text-xl)] text-[var(--foreground)]">
            #{leaderboard?.cityRank || '-'}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200 bg-[var(--accent-secondary)] rounded-[var(--radius-lg)]">
          <span className="font-medium flex items-center gap-2 text-[var(--text-sm)] text-[var(--text-secondary)]">
            <Flame className="w-4 h-4 text-[var(--accent-primary)]" />
            Max Streak
          </span>
          <span className="font-bold font-mono text-[var(--text-xl)] text-[var(--foreground)]">
            {streak?.maxStreak || 0}
          </span>
        </div>

        {/* Current Streak with new logic */}
        <div 
          className="flex justify-between items-center p-4 hover-glow transition-all duration-200 rounded-[var(--radius-lg)]"
          style={{
            backgroundColor: (streak?.count === 0 && streak?.hasQuestion === false) 
              ? 'var(--muted)' 
              : 'var(--accent-secondary)'
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium flex items-center gap-2 text-[var(--text-sm)] text-[var(--text-secondary)]">
              <Flame className="w-4 h-4 text-[var(--accent-primary)]" />
              Current Streak
              {(streak?.count === 0 && streak?.hasQuestion === false) && (
                <span className="text-[var(--text-xs)] text-[var(--text-secondary)]">
                  (Frozen)
                </span>
              )}
            </span>
            {(streak?.count === 0 && streak?.hasQuestion === false) && (
              <span className="text-[var(--text-xs)] text-[var(--text-secondary)]">
                No question uploaded today
              </span>
            )}
          </div>
          <div className="text-right">
            <span 
              className="font-bold font-mono text-[var(--text-xl)]"
              style={{
                color: (streak?.count === 0 && streak?.hasQuestion === false)
                  ? 'var(--text-secondary)'
                  : 'var(--foreground)'
              }}
            >
              {streak?.currentStreak || 0}
            </span>
            {streak && streak.count && streak.count > 0 && (
              <div className="text-[var(--text-xs)] text-[var(--text-secondary)]">
                {streak.count} submission{streak.count !== 1 ? 's' : ''} today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
