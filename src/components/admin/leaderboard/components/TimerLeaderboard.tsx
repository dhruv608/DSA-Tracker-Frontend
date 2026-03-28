"use client";

import React, { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";

interface TimerLeaderboardProps {
  lastUpdated?: string;
  refreshInterval?: number; // in hours
  onRefresh?: () => void;
}

export const TimerLeaderboard: React.FC<TimerLeaderboardProps> = ({
  lastUpdated,
  refreshInterval = 4,
  onRefresh,
}) => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshIntervalMs = refreshInterval * 60 * 60 * 1000;

  // 🟢 Timer logic
  useEffect(() => {
    if (!lastUpdated) return;

    const calculateTimeRemaining = () => {
      const now = Date.now();
      const lastUpdateTime = new Date(lastUpdated).getTime();
      const nextRefreshTime = lastUpdateTime + refreshIntervalMs;

      const remaining = nextRefreshTime - now;
      return remaining > 0 ? remaining : 0;
    };

    setTimeUntilRefresh(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeUntilRefresh(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated, refreshIntervalMs]);

  // 🟢 Auto refresh when expired
  useEffect(() => {
    if (timeUntilRefresh !== 0 || !onRefresh) return;

    setIsRefreshing(true);
    onRefresh();

    const timeout = setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [timeUntilRefresh]);

  // 🟢 Format time
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // 🟢 Display text logic (YOUR FEATURE ✅)
  const getDisplayText = () => {
    if (isRefreshing) return "Refreshing...";
    if (timeUntilRefresh === 0) return "Waiting for update...";
    return formatTime(timeUntilRefresh);
  };

  // 🟢 Color logic
  const getStatusColor = (): string => {
    if (timeUntilRefresh === 0) return "text-orange-500";

    const totalSeconds = timeUntilRefresh / 1000;
    const intervalSeconds = refreshInterval * 3600;
    const percentage = (totalSeconds / intervalSeconds) * 100;

    if (percentage > 50) return "text-primary";
    if (percentage > 25) return "text-accent-primary";
    if (percentage > 10) return "text-orange-500";
    return "text-red-500";
  };

  // 🟢 Format last updated
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return "Unknown";

    return new Date(lastUpdated).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!lastUpdated) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {/* Timer */}
      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1.5 border border-border rounded-full shadow-sm">
        <Clock className={`w-3.5 h-3.5 ${getStatusColor()}`} />

        <span className="flex items-center gap-1">
          {isRefreshing ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin text-primary" />
              <span className="text-primary">Refreshing...</span>
            </>
          ) : (
            <>
              <span>Refresh in:</span>
              <span className={`font-bold ${getStatusColor()}`}>
                {getDisplayText()}
              </span>
            </>
          )}
        </span>
      </div>

      {/* Last updated */}
      <div className="text-muted-foreground/70 text-[10px]">
        Updated: {formatLastUpdated()}
      </div>

      {/* Progress circle */}
      <div className="relative w-4 h-4">
        <svg className="transform -rotate-90 w-4 h-4">
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-muted/30"
          />
          {timeUntilRefresh > 0 && (
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className={getStatusColor()}
              strokeDasharray={`${
                (timeUntilRefresh / refreshIntervalMs) * 37.7
              } 37.7`}
            />
          )}
        </svg>
      </div>
    </div>
  );
};