import React from 'react';
import { Flame, CheckCircle2, ChevronUp } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  filters?: {
    city: string;
    year: number;
    type: string;
  };
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, filters }) => {

  const getRank = (entry: LeaderboardEntry) => {
    return filters?.city === "all" ? entry.global_rank : entry.city_rank;
  };

  const getCompletionPercentage = (entry: LeaderboardEntry) => {
    return (
      (entry.easy_completion +
        entry.medium_completion +
        entry.hard_completion) /
      3
    ).toFixed(1);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse" style={{ minWidth: '800px' }}>
        
        {/* HEADER */}
        <thead>
          <tr
            className="border-b"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--muted)',
            }}
          >
            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider">Rank</th>
            <th className="p-4 text-xs font-semibold uppercase tracking-wider">Student</th>
            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider hidden md:table-cell">City / Year</th>
            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider">Score</th>
            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Difficulty</th>
            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider">Streak</th>
            <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider">Solved</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {entries.map((entry) => {
            const rankValue = getRank(entry);
            const completion = getCompletionPercentage(entry);

            const isTop = Number(rankValue) <= 3;
            const isYou = entry.isCurrentUser;

            return (
              <tr
                key={entry.username}
                className="transition-all duration-200 hover:bg-muted/40"
                style={{
                  backgroundColor: isYou
                    ? 'rgba(132, 204, 22, 0.12)'
                    : Number(rankValue) === 1
                    ? 'rgba(132, 204, 22, 0.08)'
                    : Number(rankValue) === 2
                    ? 'rgba(132, 204, 22, 0.06)'
                    : Number(rankValue) === 3
                    ? 'rgba(132, 204, 22, 0.04)'
                    : 'transparent',
                }}
              >

                {/* RANK */}
                <td className="p-4 text-center">
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold"
                    style={{
                      width: '36px',
                      height: '36px',
                      fontSize: '14px',
                      backgroundColor: isYou
                        ? 'var(--primary)'
                        : Number(rankValue) === 1
                        ? 'gold'
                        : Number(rankValue) === 2
                        ? 'silver'
                        : Number(rankValue) === 3
                        ? '#cd7f32'
                        : 'var(--muted)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {rankValue}
                  </span>
                </td>

                {/* STUDENT */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        entry.profile_image_url ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}`
                      }
                      className="w-9 h-9 rounded-full object-cover border"
                    />

                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {entry.name}
                        {isYou && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{entry.username}
                      </div>
                    </div>
                  </div>
                </td>

                {/* CITY */}
                <td className="p-4 text-center hidden md:table-cell">
                  <div>{entry.city_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Batch {entry.batch_year}
                  </div>
                </td>

                {/* SCORE */}
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-muted  text-sm">
                    <ChevronUp className="w-4 h-4 text-primary" />
                    {completion}%
                  </div>
                </td>

                {/* DIFFICULTY */}
                <td className="p-4 hidden lg:table-cell">
                  <div className="flex justify-center gap-3 text-sm">
                    <span className="text-green-400 font-semibold">
                      {entry.easy_completion.toFixed(1)}E
                    </span>
                    <span className="text-yellow-400 font-semibold">
                      {entry.medium_completion.toFixed(1)}M
                    </span>
                    <span className="text-red-400 font-semibold">
                      {entry.hard_completion.toFixed(1)}H
                    </span>
                  </div>
                </td>

                {/* STREAK */}
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                    <Flame className="w-4 h-4 text-orange-400" />
                    {entry.max_streak}
                  </div>
                </td>

                {/* SOLVED */}
                <td className="p-4 text-right font-semibold">
                  <div className="inline-flex items-center gap-2">
                    {entry.total_solved}
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};