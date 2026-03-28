"use client";
import React, { useMemo } from 'react';
import { Users, BarChart, CheckCircle2 } from 'lucide-react';
import StatsShimmer from '@/components/admin/leaderboard/shimmers/StatsShimmer';

const StatsCard = ({ icon, title, value, color, bg }: any) => (
  <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
     <div className={`w-14 h-14 rounded-xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
        {React.cloneElement(icon, { className: 'w-7 h-7' })}
     </div>
     <div className="flex flex-col">
        <p className="text-sm text-muted-foreground font-medium mb-0.5">{title}</p>
        <p className="text-3xl font-black tracking-tight text-foreground drop-shadow-sm">{value}</p>
     </div>
  </div>
);

export function StatsSection({ leaderboard, totalParticipants, loading, error, mode = 'admin' }: any) {
  
  // Calculate stats from leaderboard data
  const calculatedStats = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) {
      return {
        avgCompletion: 0,
        highestCompletion: 0,
        totalRecords: totalParticipants || 0
      };
    }

    // Calculate completion percentages for each student
    const completions = leaderboard.map((entry: any) => {
      const hardComp = Number(entry.hard_completion || 0);
      const medComp = Number(entry.medium_completion || 0);
      const easyComp = Number(entry.easy_completion || 0);
      return (hardComp + medComp + easyComp) / 3;
    });

    // Calculate average completion
    const avgCompletion = completions.length > 0 
      ? completions.reduce((sum: number, comp: number) => sum + comp, 0) / completions.length 
      : 0;

    // Calculate highest completion
    const highestCompletion = completions.length > 0 
      ? Math.max(...completions) 
      : 0;

    return {
      avgCompletion,
      highestCompletion,
      totalRecords: totalParticipants || leaderboard.length
    };
  }, [leaderboard, totalParticipants]);

  const { avgCompletion, highestCompletion, totalRecords } = calculatedStats;

  if (loading) return <StatsShimmer />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard icon={<Users />} title="Total Participants" value={totalRecords.toString()} color="text-blue-500" bg="bg-blue-500/10" />
      <StatsCard icon={<BarChart />} title="Avg Completion" value={`${avgCompletion.toFixed(2)}%`} color="text-indigo-500" bg="bg-indigo-500/10" />
      <StatsCard icon={<CheckCircle2 />} title="Peak Completion" value={`${highestCompletion.toFixed(2)}%`} color="text-emerald-500" bg="bg-emerald-500/10" />
    </div>
  );
}
