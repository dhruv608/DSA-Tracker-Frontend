"use client";
import React from 'react';
import Link from 'next/link';
import { CalendarDays, ExternalLink, Flame } from 'lucide-react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useRouter } from 'next/navigation';

interface LeaderboardTableRowProps {
  entry: any;
  selectedCity: string;
}

export const LeaderboardTableRow: React.FC<LeaderboardTableRowProps> = ({ entry, selectedCity }) => {
  // Determine rank value and label based on city selection
  const isGlobalView = selectedCity === 'all';
  const rankValue = isGlobalView ? (entry.global_rank || 0) : (entry.city_rank || 0);
  const rankLabel = isGlobalView ? 'Global Rank' : 'City Rank';

  const router = useRouter();

  return (
    <TableRow className={`group scrollbar-none hover:bg-muted/40 transition-all duration-200 hover:scale-[1.002] cursor-default  bg-primary/2 hover:bg-primary/12 rounded-xl`}>

      <TableCell>
        <div className="flex flex-row items-center gap-3">
          <div className={`w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm group-hover:border-primary/50 transition-colors`}>
            {entry.profile_image_url ?
              <img src={entry.profile_image_url} alt={entry.name} className="w-full h-full object-cover" />
              : <ProfileAvatar username={entry.username} size={40} />}

          </div>
          <div className="flex flex-col">
            {entry.name}
            <Link href={`/profile/${entry.username}`}>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground font-mono cursor-pointer  transition-transform">@{entry.username}</span>
                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </TableCell>


      <TableCell className="text-center">
        <span className={`text-base font-bold ${Number(rankValue) === 1 ? 'text-[color:var(--chart-1)]' : Number(rankValue) === 2 ? 'text-[color:var(--chart-2)]' : Number(rankValue) === 3 ? 'text-[color:var(--chart-5)]' : 'text-foreground'}`}>
          {rankValue}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5 items-start">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-border bg-muted/60 text-foreground/80">{entry.city_name}- {entry.batch_year}</span>
        </div>
      </TableCell>

      <TableCell className="text-center">
        <span className="font-black text-primary text-xl tracking-tight ">{entry.score}</span>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex justify-center">
          {entry.max_streak > 0 ? (
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all duration-300 group-hover:scale-110 ${entry.max_streak >= 5 ? 'bg-red-500/15 text-red-500 border border-red-500/30' : 'bg-orange-500/15 text-orange-500 border border-orange-500/30'}`}>
              <Flame className={`w-3.5 h-3.5 ${entry.max_streak >= 5 ? 'animate-bounce text-red-500' : 'text-orange-500'}`} />
              {entry.max_streak}
            </div>
          ) : (
            <span className="text-muted-foreground/50 text-xs font-medium">-</span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-foreground text-sm tracking-tight">{entry.total_solved}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
};
