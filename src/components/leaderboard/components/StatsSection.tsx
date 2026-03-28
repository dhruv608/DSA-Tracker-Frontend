"use client";
import React, { useMemo } from 'react';
import { Users, BarChart, CheckCircle2 } from 'lucide-react';
import StatsShimmer from '@/components/leaderboard/shimmers/StatsShimmer';

const StatsCard = ({ icon, title, value }: any) => (
  <div
    className="relative bg-card/80 backdrop-blur-md border border-border/50 
               rounded-2xl px-4 py-3 flex items-center justify-between
               shadow-sm hover:shadow-lg
               transition-all duration-300 group overflow-hidden"
  >
    {/* glow */}
    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition duration-300" />

    {/* Content */}
    <div className="flex items-center justify-between w-full gap-3 z-10">

      {/* Left */}
      <div className="flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <p className="text-[22px] font-semibold text-foreground leading-tight">
          {value}
        </p>
      </div>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-lg bg-primary/10 text-primary 
                   flex items-center justify-center shrink-0
                   group-hover:scale-105 transition-transform duration-300"
      >
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>

    </div>
  </div>
);
export function StatsSection({ leaderboard, totalParticipants, loading }: any) {

  const calculatedStats = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) {
      return {
        avgCompletion: 0,
        highestCompletion: 0,
        totalRecords: totalParticipants || 0
      };
    }

    const completions = leaderboard.map((entry: any) => {
      const hardComp = Number(entry.hard_completion || 0);
      const medComp = Number(entry.medium_completion || 0);
      const easyComp = Number(entry.easy_completion || 0);
      return (hardComp + medComp + easyComp) / 3;
    });

    const avgCompletion =
      completions.length > 0
        ? completions.reduce((sum: number, comp: number) => sum + comp, 0) / completions.length
        : 0;

    const highestCompletion =
      completions.length > 0
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatsCard
        icon={<Users />}
        title="Participants"
        value={totalRecords.toString()}
      />

      <StatsCard
        icon={<BarChart />}
        title="Avg Completion"
        value={`${avgCompletion.toFixed(1)}%`}
      />

      <StatsCard
        icon={<CheckCircle2 />}
        title="Top Completion"
        value={`${highestCompletion.toFixed(1)}%`}
      />
    </div>
  );
}