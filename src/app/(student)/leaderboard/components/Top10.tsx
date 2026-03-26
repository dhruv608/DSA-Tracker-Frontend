"use client";

import React, { useMemo } from 'react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface Top10Props {
  top10: LeaderboardEntry[];
  filters?: {
    city: string;
    year: number;
    type: string;
  };
}

const PodiumItem = ({ student, rank, color, glow, height, isCenter, borderCol }: any) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-2 z-10 w-28 md:w-36">
      {/* Crown for rank 1 with enhanced animation */}
      {isCenter && (
        <span className="text-4xl mb-3 drop-shadow-md animate-pulse" style={{ 
          textShadow: '0 0 20px rgba(250, 204, 21, 0.6)',
          animation: 'crown-float 3s ease-in-out infinite'
        }}>👑</span>
      )}
      
      {/* Profile Photo with enhanced hover */}
      <div className={`relative rounded-full p-1 glass ${glow} transition-all duration-300 group-hover:scale-105 mb-[-24px] z-20`} >
        <div className={`w-20 h-20 ${isCenter ? 'md:w-32 md:h-32' : 'md:w-24 md:h-24'} rounded-full overflow-hidden border-4 border-background ${borderCol} shadow-inner`}>
          <img src={student.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${student.username}&backgroundColor=1e293b&textColor=f8fafc`} alt={student.name} className="w-full h-full object-cover" />
        </div>
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base ${color} border-2 border-background shadow-md transition-all duration-300 group-hover:scale-110`}>
          {rank}
        </div>
      </div>
      
      {/* Base with enhanced gradient and depth */}
      <div className={`w-full ${height} glass border-x border-t border-border rounded-t-2xl flex flex-col items-center justify-start pt-10 pb-4 relative overflow-hidden shadow-xl transition-all duration-300 group-hover:shadow-2xl`}>
        {/* Enhanced gradient glow */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isCenter ? 'from-yellow-500/20 via-yellow-500/10' : rank === 2 ? 'from-slate-500/15 via-slate-500/8' : 'from-amber-600/15 via-amber-600/8'} to-transparent pointer-events-none transition-opacity duration-500`} />
        
        <span className="font-bold text-sm md:text-base text-center px-2 truncate w-full group-hover:text-primary transition-colors duration-300">{student.name}</span>
        <span className="text-[11px] md:text-xs text-muted-foreground truncate w-full text-center px-1 font-mono">@{student.username}</span>
        
        <div className="mt-auto flex flex-col items-center pt-2">
          <span className="text-lg md:text-2xl font-black text-primary drop-shadow-sm transition-all duration-300 group-hover:scale-105">{student.score}</span>
          <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{student.total_solved} SOLVED</span>
        </div>
      </div>
    </div>
  );
};

export function Top10({ top10, filters }: Top10Props) {
  console.log('🏆 Top10 component rendering:', {
    totalTop10: top10.length,
    filters,
    firstStudent: top10[0]?.name || 'NO_FIRST',
    firstStudentRanks: top10[0] ? { global_rank: top10[0].global_rank, city_rank: top10[0].city_rank } : 'NO_RANKS'
  });

  // Dynamic Rank logic mapping - same as admin podium
  const getRank = (entry: any) => {
    // The backend already returns correct rank based on type
    return filters?.city === "all" ? entry.global_rank : entry.city_rank;
  };

  const top3 = useMemo(() => {
    if (!top10 || top10.length === 0) return [];

    const sorted = [...top10]
      .map(entry => ({
        ...entry,
        computedRank: getRank(entry)
      }))
      .filter(entry => entry.computedRank != null && entry.computedRank > 0)
      .sort((a, b) => a.computedRank - b.computedRank);

    console.log('🏆 Computed top3:', sorted.slice(0, 3).map(s => ({ 
      name: s.name, 
      computedRank: s.computedRank,
      global_rank: s.global_rank,
      city_rank: s.city_rank 
    })));

    return sorted.slice(0, 3);
  }, [top10, filters]);

  return (
    <div className="glass rounded-2xl p-8 relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-500/6 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="relative z-10 flex items-end justify-center gap-6 md:gap-12 min-h-[350px]">
        {/* Map over ranks in order 2, 1, 3 for Left-Center-Right placing */}
        {[2, 1, 3].map((rankPosition) => {
          const student = top3.find((s: any) => s.computedRank === rankPosition);
          
          const rankConfig = {
            1: { color: 'bg-yellow-400 text-yellow-900', glow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]', borderCol: 'border-yellow-400', height: 'h-44 md:h-56', isCenter: true },
            2: { color: 'bg-slate-300 text-slate-800', glow: 'shadow-[0_0_25px_rgba(148,163,184,0.6)]', borderCol: 'border-slate-300', height: 'h-36 md:h-44', isCenter: false },
            3: { color: 'bg-amber-600 text-orange-50', glow: 'shadow-[0_0_25px_rgba(217,119,6,0.6)]', borderCol: 'border-amber-600', height: 'h-32 md:h-40', isCenter: false }
          };
          
          const config = rankConfig[rankPosition as keyof typeof rankConfig];
          
          return student ? (
            <PodiumItem 
              key={rankPosition}
              student={student} 
              rank={rankPosition} 
              color={config.color} 
              glow={config.glow} 
              borderCol={config.borderCol} 
              height={config.height} 
              isCenter={config.isCenter} 
            />
          ) : (
            <div 
              key={rankPosition}
              className={`flex flex-col items-center opacity-20 w-28 md:w-36`}
            >
              <div className={`relative rounded-full p-1 bg-gradient-to-tr from-card to-muted mb-[-24px] z-20`}>
                <div className={`w-20 h-20 ${config.isCenter ? 'md:w-32 md:h-32' : 'md:w-24 md:h-24'} rounded-full overflow-hidden border-4 border-background shadow-inner bg-muted/50`} />
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base border-2 border-background shadow-md`} style={{backgroundColor: config.color.includes('yellow') ? '#facc15' : config.color.includes('slate') ? '#cbd5e1' : '#d97706'}}>
                  {rankPosition}
                </div>
              </div>
              <div className={`w-full ${config.height} bg-card border-x border-t border-border rounded-t-2xl flex flex-col items-center justify-start pt-10 pb-4 relative overflow-hidden shadow-xl`}>
                <div className={`absolute inset-0 bg-gradient-to-t ${config.isCenter ? 'from-yellow-500/10' : rankPosition === 2 ? 'from-slate-500/10' : 'from-amber-600/10'} to-transparent pointer-events-none`} />
                <span className="font-bold text-sm md:text-base text-center px-2 truncate w-full text-muted-foreground">-</span>
                <span className="text-[11px] md:text-xs text-muted-foreground truncate w-full text-center px-1 font-mono">-</span>
                <div className="mt-auto flex flex-col items-center pt-2">
                  <span className="text-lg md:text-2xl font-black text-muted-foreground">-</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">-</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
