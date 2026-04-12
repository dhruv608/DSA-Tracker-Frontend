"use client";

import { EvaluationModal } from './EvaluationModal';
import { TimerLeaderboard } from './TimerLeaderboard';

interface AdminLeaderboardHeaderProps {
  lastCalculated?: string | null;
  onRefresh: () => Promise<void>;
}

export function AdminLeaderboardHeader({ lastCalculated, onRefresh }: AdminLeaderboardHeaderProps) {
  return (
    <div className="glass backdrop-blur-2xl mb-5 px-6 py-4 rounded-2xl flex items-center justify-between">
      {/* LEFT */}
      <div className="flex flex-col gap-2">
        {/* TITLE ROW */}
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Admin <span className="text-primary">Leaderboard</span>
          </h2>

          {/* Modal aligned properly */}
          <div className="shrink-0">
            <EvaluationModal />
          </div>
        </div>

        {/* SUBTEXT */}
        <p className="text-muted-foreground text-sm  inline-flex items-center p-0 m-0 rounded-md w-fit">
          Analytics driven precisely by backend mapping constraints.
        </p>
      </div>

      {/* RIGHT */}
      <div className="shrink-0">
        <TimerLeaderboard
          lastUpdated={lastCalculated ?? undefined}
          refreshInterval={4}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}
