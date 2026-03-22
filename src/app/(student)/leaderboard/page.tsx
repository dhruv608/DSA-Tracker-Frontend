"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { studentLeaderboardService } from '@/services/student/leaderboard.service';
import { LeaderboardPodium } from '@/components/student/leaderboard/LeaderboardPodium';
import { LeaderboardTable } from '@/components/student/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
  const [filters, setFilters] = useState({
    city: 'All',
    year: 'All',
    type: 'weekly'
  });

  const [top10, setTop10] = useState<any[]>([]);
  const [yourRank, setYourRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      // Clean filters (turn 'All' into undefined for the API if logic expects it)
      const apiFilters = {
        city: filters.city !== 'All' ? filters.city : undefined,
        year: filters.year !== 'All' ? Number(filters.year) : undefined,
        type: filters.type
      };
      
      const data = await studentLeaderboardService.getLeaderboard(apiFilters);
      setTop10(data.top10 || []);
      setYourRank(data.yourRank || null);
    } catch (e) {
      console.error("Leaderboard fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Safe split 
  const podiumData = top10.slice(0, 3);
  const tableData = top10.slice(3, 10);

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-serif italic text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span>🏆</span> <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">Leaderboard</span>
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-lg">
            Compete with peers across batches. Rankings are based on questions solved and consistency.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select 
            value={filters.city} 
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="bg-card border border-border rounded-xl px-3.5 py-2 text-[13px] font-medium outline-none text-foreground shadow-sm focus:border-primary/50"
          >
            <option value="All">All Cities</option>
            {/* Ideally populated dynamically from an endpoint or config. Hardcoded MVP values: */}
            <option value="Bangalore">Bangalore</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          
          <select 
            value={filters.type} 
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-card border border-border rounded-xl px-3.5 py-2 text-[13px] font-medium outline-none text-foreground shadow-sm focus:border-primary/50"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          
          {/* Your Rank Banner */}
          {yourRank && (
            <div className="bg-gradient-to-r from-primary/10 via-amber-600/5 to-transparent border border-primary/20 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl shadow-lg shrink-0">
                #
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase mb-0.5">Your Position</div>
                <div className="font-semibold text-lg">Rank #{yourRank.rank}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[13.5px] font-medium">Score: {Math.round(parseFloat(yourRank.total_solved || '0'))}%</div>
                <div className="text-[11px] text-muted-foreground">Top {Math.floor((yourRank.rank / 100) * 100) || 1}% overall</div>
              </div>
            </div>
          )}

          {/* Podium (Top 3) */}
          {podiumData.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-5 uppercase tracking-widest text-[10.5px] font-mono text-muted-foreground after:flex-1 after:h-[1px] after:bg-border">
                Top Performers
              </div>
              
              {/* Podium Layout - Center 1st, 2nd left, 3rd right */}
              <div className="flex flex-col md:flex-row justify-center items-end gap-5 max-w-4xl mx-auto">
                {/* Rank 2 */}
                {podiumData[1] && (
                  <div className="w-full md:w-1/3 md:pb-6">
                    <LeaderboardPodium 
                      rank={2}
                      name={podiumData[1].name}
                      username={podiumData[1].username}
                      score={Math.round(parseFloat(podiumData[1].total_solved || '0'))}
                      streak={podiumData[1].max_streak || 0}
                      solved={0} // Actual count not provided by simplified backend currently
                      isCurrentUser={podiumData[1].isCurrentUser}
                    />
                  </div>
                )}
                
                {/* Rank 1 */}
                {podiumData[0] && (
                  <div className="w-full md:w-1/3 z-10">
                    <LeaderboardPodium 
                      rank={1}
                      name={podiumData[0].name}
                      username={podiumData[0].username}
                      score={Math.round(parseFloat(podiumData[0].total_solved || '0'))}
                      streak={podiumData[0].max_streak || 0}
                      solved={0} // Actual count not provided
                      isCurrentUser={podiumData[0].isCurrentUser}
                    />
                  </div>
                )}

                {/* Rank 3 */}
                {podiumData[2] && (
                  <div className="w-full md:w-1/3 md:pb-10">
                    <LeaderboardPodium 
                      rank={3}
                      name={podiumData[2].name}
                      username={podiumData[2].username}
                      score={Math.round(parseFloat(podiumData[2].total_solved || '0'))}
                      streak={podiumData[2].max_streak || 0}
                      solved={0} // Actual count not provided
                      isCurrentUser={podiumData[2].isCurrentUser}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
              <div className="text-4xl mb-3">👻</div>
              <p>No leaderboard data available for these filters yet.</p>
            </div>
          )}

          {/* Table (Ranks 4-10) */}
          {tableData.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5 uppercase tracking-widest text-[10.5px] font-mono text-muted-foreground after:flex-1 after:h-[1px] after:bg-border">
                The Chasers
              </div>
              <LeaderboardTable 
                entries={tableData.map((e) => ({
                  rank: e.rank,
                  name: e.name,
                  username: e.username,
                  city: e.city_name || 'Unknown',
                  year: e.batch_year || new Date().getFullYear(),
                  completion: Math.round(parseFloat(e.total_solved || '0')),
                  hard: Math.round(parseFloat(e.hard_solved || '0')),
                  medium: Math.round(parseFloat(e.medium_solved || '0')),
                  easy: Math.round(parseFloat(e.easy_solved || '0')),
                  streak: e.max_streak || 0,
                  solved: 0, // Backend currently omitting raw solved counts
                  isCurrentUser: e.isCurrentUser
                }))}
              />
            </div>
          )}

        </div>
      )}

    </div>
  );
}
