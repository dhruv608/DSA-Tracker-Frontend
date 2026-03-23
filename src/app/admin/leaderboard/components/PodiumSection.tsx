"use client";
import React, { useMemo, useEffect, useState } from 'react';
import PodiumShimmer from '@/components/shimmers/PodiumShimmer';
import { getAdminLeaderboard } from '@/services/admin.service';

const PodiumItem = ({ student, rank, color, glow, height, isCenter, borderCol }: any) => {

  
  return (
    <div className="flex flex-col items-center group cursor-pointer transition-transform duration-500 hover:-translate-y-6 z-10 w-28 md:w-36">
      {/* Crown for rank 1 */}
      {isCenter && <span className="text-5xl animate-bounce mb-3 drop-shadow-md">👑</span>}
      
      {/* Profile Photo */}
      <div className={`relative rounded-full p-1 bg-gradient-to-tr from-card to-muted ${glow} transition-all duration-500 group-hover:scale-110 mb-[-24px] z-20`} >
        <div className={`w-20 h-20 ${isCenter ? 'md:w-32 md:h-32' : 'md:w-24 md:h-24'} rounded-full overflow-hidden border-4 border-background ${borderCol} shadow-inner`}>
          <img src={student.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${student.username}&backgroundColor=1e293b&textColor=f8fafc`} alt={student.name} className="w-full h-full object-cover" />
          
        </div>
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base ${color} border-2 border-background shadow-md`}>
          {rank}
        </div>
      </div>
      
      {/* Base */}
      <div className={`w-full ${height} bg-card border-x border-t border-border rounded-t-2xl flex flex-col items-center justify-start pt-10 pb-4 relative overflow-hidden shadow-xl`}>
        <div className={`absolute inset-0 bg-gradient-to-t ${isCenter ? 'from-yellow-500/10' : rank === 2 ? 'from-slate-500/10' : 'from-amber-600/10'} to-transparent pointer-events-none`} />
        
        <span className="font-bold text-sm md:text-base text-center px-2 truncate w-full group-hover:text-primary transition-colors">{student.name}</span>
        <span className="text-[11px] md:text-xs text-muted-foreground truncate w-full text-center px-1 font-mono">@{student.username}</span>
        
        <div className="mt-auto flex flex-col items-center pt-2">
            <span className="text-lg md:text-2xl font-black text-primary drop-shadow-sm">{student.score}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{student.total_solved} SOLVED</span>
        </div>
      </div>
    </div>
  );
};

export function PodiumSection({ lType, lCity, lYear, debouncedSearch }: any) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodium = async () => {
      setLoading(true);
      try {
        const query = { page: 1, limit: 3, search: debouncedSearch || undefined };
        const body = { city: lCity, type: lType, year: lYear === 0 ? undefined : Number(lYear) }; 
        const res = await getAdminLeaderboard(query, body);
        setLeaderboard(res.leaderboard || []);
      } catch (err) {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPodium();
  }, [lCity, lType, lYear, debouncedSearch]);

  // Dynamic Rank logic mapping
const getRank = (entry: any) => {
  // The backend already returns the correct rank based on type
  return lCity === "all" ? entry.global_rank : entry.city_rank;
};

  const top3 = useMemo(() => {
    if (!leaderboard) return [];

    const sorted = [...leaderboard]
      .map(entry => ({
        ...entry,
        computedRank: getRank(entry)
      }))
      .filter(entry => entry.computedRank != null && entry.computedRank > 0)
      .sort((a, b) => a.computedRank - b.computedRank);

    return sorted.slice(0, 3);
  }, [leaderboard, lType, lCity]);

  if (loading) return <PodiumShimmer />;

  return (
    <div className="relative pt-12 pb-8 bg-gradient-to-b from-primary/5 via-card to-card border border-border rounded-xl shadow-sm overflow-hidden flex items-end justify-center gap-4 md:gap-12 min-h-[350px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Map over ranks in order 2, 1, 3 for Left-Center-Right placing */}
      {[2, 1, 3].map((rankPosition) => {
        const student = top3.find((s: any) => s.computedRank === rankPosition);
        
        const rankConfig = {
          1: { color: 'bg-yellow-400 text-yellow-900', glow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]', borderCol: 'border-yellow-400', height: 'h-40 md:h-52', isCenter: true },
          2: { color: 'bg-slate-300 text-slate-800', glow: 'shadow-[0_0_25px_rgba(148,163,184,0.6)]', borderCol: 'border-slate-300', height: 'h-32 md:h-40', isCenter: false },
          3: { color: 'bg-amber-600 text-orange-50', glow: 'shadow-[0_0_25px_rgba(217,119,6,0.6)]', borderCol: 'border-amber-600', height: 'h-28 md:h-36', isCenter: false }
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
            className={`flex flex-col items-center opacity-30 w-28 md:w-36 podium-card animate-float`}
            style={{ animationDelay: `${rankPosition * 0.2}s` }}
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
  );
}
