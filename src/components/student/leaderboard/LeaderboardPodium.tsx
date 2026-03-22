import React from 'react';
import { Flame, Trophy, Medal } from 'lucide-react';

interface LeaderboardPodiumProps {
  rank: number;
  name: string;
  username: string;
  score: number;
  streak: number;
  solved: number;
  isCurrentUser?: boolean;
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({
  rank,
  name,
  username,
  score,
  streak,
  solved,
  isCurrentUser
}) => {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const styles = {
    1: {
      gradient: 'from-amber-500/10 to-transparent dark:from-amber-500/20 border-amber-500/50',
      iconUrl: Trophy,
      iconColor: 'text-amber-500',
      avatarBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
      height: 'h-[280px]',
      badgeBg: 'bg-amber-500 text-white'
    },
    2: {
      gradient: 'from-zinc-300/20 to-transparent dark:from-zinc-400/10 border-zinc-400/50',
      iconUrl: Medal,
      iconColor: 'text-zinc-500 dark:text-zinc-400',
      avatarBg: 'bg-gradient-to-br from-zinc-300 to-zinc-500 text-white',
      height: 'h-[240px]',
      badgeBg: 'bg-zinc-500 text-white'
    },
    3: {
      gradient: 'from-orange-400/10 to-transparent dark:from-orange-600/20 border-orange-500/50',
      iconUrl: Medal,
      iconColor: 'text-orange-600 dark:text-orange-500',
      avatarBg: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
      height: 'h-[220px]',
      badgeBg: 'bg-orange-500 text-white'
    }
  };

  const style = styles[rank as 1 | 2 | 3] || styles[3];
  const Icon = style.iconUrl;

  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'ME';

  return (
    <div className={`relative bg-card border rounded-3xl p-6 text-center shadow-sm overflow-hidden bg-gradient-to-b ${style.gradient} ${isCurrentUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} hover:-translate-y-2 transition-transform duration-500 flex flex-col justify-end ${style.height}`}>
      
      {isCurrentUser && (
        <span className="absolute top-4 right-4 text-[10px] bg-primary/20 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
          You
        </span>
      )}

      <div className="flex flex-col items-center z-10">
        <div className="relative mb-5">
          {/* Rank Badge */}
          <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${style.badgeBg} flex items-center justify-center font-bold text-[13px] shadow-lg border-2 border-background z-20`}>
            {rank}
          </div>
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-serif font-black shadow-xl border-4 border-background relative z-10 ${style.avatarBg}`}>
            {initials}
          </div>
          
          <Icon className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 ${style.iconColor} drop-shadow-md z-20 bg-background rounded-full p-1`} />
        </div>

        <h3 className="font-bold text-foreground text-[17px] mb-0.5 truncate w-full px-2" title={name}>
          {name}
        </h3>
        <p className="text-[12px] text-muted-foreground font-mono mb-4 truncate w-full px-2">
          @{username}
        </p>

        <div className="flex items-center justify-center gap-4 w-full pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest mb-0.5">Score</div>
            <div className={`font-bold text-lg ${style.iconColor}`}>{score}</div>
          </div>
          
          <div className="w-[1px] h-8 bg-border/50" />
          
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest mb-0.5">Streak</div>
            <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              {streak} <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
