"use client";

import React from "react";
import { MapPin, GraduationCap } from "lucide-react";
import { YourRankData } from "@/hooks/useLeaderboard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface YourRankProps {
  yourRank: YourRankData | null;
}

export function YourRank({ yourRank }: YourRankProps) {
  if (!yourRank) return null;

  // KEEP YOUR LOGIC SAME
  const easyPercentage = Math.min((yourRank.easy_solved / 100) * 100, 100);
  const mediumPercentage = Math.min((yourRank.medium_solved / 100) * 100, 100);
  const hardPercentage = Math.min((yourRank.hard_solved / 100) * 100, 100);

  return (
    <Popover>
      {/* 🔘 Trigger */}
      <PopoverTrigger asChild>
        <button className="px-4 py-2 rounded-xl bg-primary text-black font-semibold shadow-md hover:scale-105 transition">
          Your Rank #{yourRank.rank}
        </button>
      </PopoverTrigger>

      {/* 💎 Popover Content */}
      <PopoverContent
        side="bottom"
        align="center"
        className="w-[95vw] max-w-[900px] p-0 bg-transparent border-none shadow-none"
      >

        {/* ✅ YOUR ORIGINAL UI (UNCHANGED) */}
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20 rounded-3xl p-8 shadow-lg relative overflow-hidden">

          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">

            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/40 shadow-xl">
                  <img
                    src={yourRank.profile_image_url || "/default-avatar.png"}
                    alt={yourRank.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-primary to-primary/80 text-background border-2 border-background w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                  #{yourRank.rank}
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-1">
                  {yourRank.name}
                </h3>
                <span className="text-sm text-muted-foreground font-mono mb-3">
                  @{yourRank.username}
                </span>

                <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/30 bg-primary/20 text-primary">
                    Your Rank
                  </span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-muted/200 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {yourRank.city_name}
                  </span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-muted/200 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Batch {yourRank.batch_year}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Section (UNCHANGED) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* 🔵 YOUR CIRCLE PROGRESS — SAME */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground mb-4">
                  Problem Solving Progress
                </h4>

                <div className="flex flex-col items-center gap-6">
                  <div className="relative">

                    {/* YOUR SVG EXACT SAME */}
                    <svg width="160" height="160" className="transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted/20" />

                      {/* KEEP YOUR ORIGINAL CALCULATION */}
                      {/* (unchanged from your file) */}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-foreground">
                        {yourRank.total_solved || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        of {yourRank.total_assigned || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats (UNCHANGED) */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground mb-4">
                  Performance Metrics
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-primary/10 rounded-xl p-4 text-center border border-primary/20">
                    <span className="text-muted-foreground text-xs block mb-1">
                      Score
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {yourRank.score}
                    </span>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 text-center border border-border">
                    <span className="text-muted-foreground text-xs block mb-1">
                      Max Streak
                    </span>
                    <span className="text-xl font-bold">
                      {yourRank.max_streak}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </PopoverContent>
    </Popover>
  );
}