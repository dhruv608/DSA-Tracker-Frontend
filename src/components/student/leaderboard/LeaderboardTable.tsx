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
  // Same rank logic as admin podium and table
  const getRank = (entry: LeaderboardEntry) => {
    return filters?.city === "all" ? entry.global_rank : entry.city_rank;
  };

  const getCompletionPercentage = (entry: LeaderboardEntry) => {
    return ((entry.easy_completion + entry.medium_completion + entry.hard_completion) / 3).toFixed(1);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse" style={{minWidth: '800px'}}>
        <thead>
          <tr 
            className="border-b" 
            style={{borderColor: 'var(--border)', backgroundColor: 'var(--muted)'}}
          >
            <th 
              className="p-4 font-semibold w-16 text-center" 
              style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase'}}
            >
              Rank
            </th>
            <th className="p-4 font-semibold" style={{fontSize: 'var(--text-xs)'}}>
              Student
            </th>
            <th className="p-4 font-semibold text-center hidden md:table-cell" style={{fontSize: 'var(--text-xs)'}}>
              City / Year
            </th>
            <th className="p-4 font-semibold text-center" style={{fontSize: 'var(--text-xs)'}}>
              Score
            </th>
            <th className="p-4 font-semibold text-center hidden lg:table-cell" style={{fontSize: 'var(--text-xs)'}}>
              Difficulty
            </th>
            <th className="p-4 font-semibold text-center" style={{fontSize: 'var(--text-xs)'}}>
              Streak
            </th>
            <th className="p-4 font-semibold text-right" style={{fontSize: 'var(--text-xs)'}}>
              Solved
            </th>
          </tr>
        </thead>
        <tbody style={{borderColor: 'var(--border)'}}>
          {entries.map((entry) => {
            const rankValue = getRank(entry);
            const completion = getCompletionPercentage(entry);
            
            return (
              <tr 
                key={entry.username} 
                className="transition-all duration-200 hover-glow"
                style={{
                  backgroundColor: entry.isCurrentUser ? 'var(--accent-primary)' : 
                                   Number(rankValue) <= 3 ? 'var(--accent-primary)' : 'transparent',
                  opacity: entry.isCurrentUser ? 0.1 : Number(rankValue) <= 3 ? 0.1 : 0
                }}
              >
                {/* Rank */}
                <td className="p-4 text-center">
                  <span 
                    className="inline-flex items-center justify-center rounded-full font-bold font-mono transition-all duration-200 hover:scale-110" 
                    style={{
                      width: 'var(--spacing-lg)',
                      height: 'var(--spacing-lg)',
                      fontSize: 'var(--text-sm)',
                      backgroundColor: entry.isCurrentUser ? 'var(--accent-primary)' : 
                                       Number(rankValue) === 1 ? 'var(--accent-primary)' :
                                       Number(rankValue) === 2 ? 'var(--accent-secondary)' :
                                       Number(rankValue) === 3 ? 'var(--muted)' : 'var(--accent-secondary)',
                      color: entry.isCurrentUser ? 'var(--primary-foreground)' : 
                             Number(rankValue) === 1 ? 'var(--primary-foreground)' :
                             Number(rankValue) === 2 ? 'var(--secondary-foreground)' :
                             Number(rankValue) === 3 ? 'var(--text-secondary)' : 'var(--secondary-foreground)',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: Number(rankValue) === 1 ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    {rankValue}
                  </span>
                </td>

                {/* Student Info */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="rounded-full overflow-hidden transition-all duration-200 hover:scale-105" 
                      style={{
                        width: 'var(--spacing-lg)',
                        height: 'var(--spacing-lg)',
                        border: `2px solid ${entry.isCurrentUser ? 'var(--accent-primary)' : 
                                       Number(rankValue) === 1 ? 'var(--accent-primary)' :
                                       Number(rankValue) === 2 ? 'var(--accent-secondary)' :
                                       Number(rankValue) === 3 ? 'var(--muted)' : 'var(--border)'}`,
                        backgroundColor: entry.isCurrentUser ? 'var(--accent-primary)' : 'var(--card)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      <img 
                        src={entry.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}&backgroundColor=1e293b&textColor=f8fafc`} 
                        alt={entry.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <div 
                        className="font-semibold flex items-center gap-2" 
                        style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
                      >
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span 
                            className="uppercase tracking-wider px-1.5 py-0.5 rounded font-bold" 
                            style={{
                              fontSize: 'var(--text-xs)',
                              backgroundColor: 'var(--accent-primary)',
                              color: 'var(--primary-foreground)',
                              borderRadius: 'var(--radius-sm)',
                              padding: 'var(--spacing-xs) var(--spacing-xs)'
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div 
                        className="font-mono mt-0.5" 
                        style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}
                      >
                        @{entry.username}
                      </div>
                    </div>
                  </div>
                </td>

                {/* City / Year */}
                <td className="p-4 text-center hidden md:table-cell">
                  <div style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>
                    {entry.city_name}
                  </div>
                  <div 
                    className="font-mono mt-0.5" 
                    style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                  >
                    Batch {entry.batch_year}
                  </div>
                </td>

                {/* Score */}
                <td className="p-4 text-center">
                  <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1 font-bold transition-all duration-200 hover:scale-105" 
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--accent-secondary)',
                      border: `1px solid var(--border)`,
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <ChevronUp className="w-3.5 h-3.5" style={{color: 'var(--accent-primary)'}} />
                    {completion}%
                  </div>
                </td>

                {/* Difficulty Breakdown */}
                <td className="p-4 hidden lg:table-cell">
                  <div 
                    className="flex items-center justify-center gap-3 font-mono" 
                    style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}
                  >
                    <div className="flex flex-col items-center" title="Easy">
                      <span style={{color: 'var(--accent-primary)', fontWeight: 'bold'}}>{entry.easy_completion.toFixed(1)}</span>
                      <span 
                        className="uppercase" 
                        style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                      >
                        E
                      </span>
                    </div>
                    <div 
                      className="w-[1px]" 
                      style={{height: 'var(--spacing-sm)', backgroundColor: 'var(--border)'}}
                    />
                    <div className="flex flex-col items-center" title="Medium">
                      <span style={{color: 'var(--accent-primary)', fontWeight: 'bold'}}>{entry.medium_completion.toFixed(1)}</span>
                      <span 
                        className="uppercase" 
                        style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                      >
                        M
                      </span>
                    </div>
                    <div 
                      className="w-[1px]" 
                      style={{height: 'var(--spacing-sm)', backgroundColor: 'var(--border)'}}
                    />
                    <div className="flex flex-col items-center" title="Hard">
                      <span style={{color: 'var(--accent-primary)', fontWeight: 'bold'}}>{entry.hard_completion.toFixed(1)}</span>
                      <span 
                        className="uppercase" 
                        style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                      >
                        H
                      </span>
                    </div>
                  </div>
                </td>

                {/* Streak */}
                <td className="p-4 text-center">
                  <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all duration-200 hover:scale-105" 
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      border: `1px solid var(--border)`,
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    <Flame className="w-4 h-4" style={{color: 'var(--accent-primary)'}} />
                    {entry.max_streak}
                  </div>
                </td>

                {/* Total Solved */}
                <td className="p-4 text-right">
                  <div 
                    className="inline-flex items-center gap-2 font-bold transition-all duration-200 hover:scale-105" 
                    style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
                  >
                    {entry.total_solved}
                    <CheckCircle2 className="w-4 h-4" style={{color: 'var(--accent-primary)'}} />
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
