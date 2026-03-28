"use client";

import React from "react";
import { Clock } from "lucide-react";

interface TimerLeaderboardProps {
  lastUpdated?: string;
  refreshInterval?: number;
  onRefresh?: () => Promise<void>;
}

export const TimerLeaderboard: React.FC<TimerLeaderboardProps> = ({ lastUpdated, refreshInterval, onRefresh }) => {
  // Format last updated time
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return "Unknown";

    return new Date(lastUpdated).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {/* Last updated info */}
      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1.5 border border-border rounded-full shadow-sm">
        <Clock className="w-3.5 h-3.5" />
        <span className="flex items-center gap-1">
          <span>Last updated:</span>
          <span className="font-bold text-primary">
            {formatLastUpdated()}
          </span>
        </span>
      </div>
    </div>
  );
};