"use client";
import React, { useEffect, useState } from 'react';
import { Users, BarChart, CheckCircle2 } from 'lucide-react';
import StatsShimmer from '@/components/shimmers/StatsShimmer';
import { getAdminLeaderboard } from '@/services/admin.service';

const StatsCard = ({ icon, title, value, color, bg }: any) => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
     <div className={`w-14 h-14 rounded-xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
        {React.cloneElement(icon, { className: 'w-7 h-7' })}
     </div>
     <div className="flex flex-col">
        <p className="text-sm text-muted-foreground font-medium mb-0.5">{title}</p>
        <p className="text-3xl font-black tracking-tight text-foreground drop-shadow-sm">{value}</p>
     </div>
  </div>
);

export function StatsSection({ lCity, lType, lYear, debouncedSearch }: any) {
  const [totalRecords, setTotalRecords] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState(0);
  const [highestCompletion, setHighestCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const query = { page: 1, limit: 5, search: debouncedSearch || undefined };
        const body = { city: lCity, type: lType, year: lYear === 0 ? undefined : Number(lYear) }; 
        const res = await getAdminLeaderboard(query, body);
        setTotalRecords(res.total || 0);

        const leaderboard = res.leaderboard || [];
        let avgC = 0;
        let highestC = 0;
        if (leaderboard.length > 0) {
          let totalC = 0;
          leaderboard.forEach((s: any) => {
            const hc = Number(s.hard_completion || 0);
            const mc = Number(s.medium_completion || 0);
            const ec = Number(s.easy_completion || 0);
            const comp = (hc + mc + ec) / 3;
            totalC += comp;
            if (comp > highestC) highestC = comp;
          });
          avgC = totalC / leaderboard.length;
        }
        setAvgCompletion(avgC);
        setHighestCompletion(highestC);
      } catch (err) {
        setTotalRecords(0);
        setAvgCompletion(0);
        setHighestCompletion(0);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [lCity, lType, lYear, debouncedSearch]);

  if (loading) return <StatsShimmer />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard icon={<Users />} title="Total Participants" value={totalRecords.toString()} color="text-blue-500" bg="bg-blue-500/10" />
      <StatsCard icon={<BarChart />} title="Avg Completion" value={`${avgCompletion.toFixed(1)}%`} color="text-indigo-500" bg="bg-indigo-500/10" />
      <StatsCard icon={<CheckCircle2 />} title="Peak Completion" value={`${highestCompletion.toFixed(1)}%`} color="text-emerald-500" bg="bg-emerald-500/10" />
    </div>
  );
}
