"use client";

import React, { useRef } from "react";
import { MapPin, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { YourRankData } from "@/hooks/useLeaderboard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

interface YourRankProps {
  yourRank: YourRankData | null;
}

export function YourRank({ yourRank }: YourRankProps) {
  const constraintsRef = useRef(null);

  if (!yourRank) return null;

  // Check for empty state
  const hasNoData =
    (yourRank.easy_solved || 0) === 0 &&
    (yourRank.medium_solved || 0) === 0 &&
    (yourRank.hard_solved || 0) === 0 &&
    !yourRank.total_assigned;

  if (hasNoData) {
    return (
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-100">
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          dragMomentum={false}
          className="pointer-events-auto absolute"
          initial={{ x: 20, y: 120 }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1.5 rounded-lg  bg-primary text-black text-sm font-semibold shadow hover:scale-105 transition">
                Rank #{yourRank.rank}
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="center"
              className="w-[280px] p-0 border-none bg-transparent shadow-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="bg-background/95 backdrop-blur-xl   rounded-2xl p-5 shadow-lg"
              >
                <div className="text-center space-y-3 rounded-2xl">
                  <div className="w-12 h-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{yourRank.rank}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      {yourRank.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You're not ranked in this batch yet.
                      <br />
                      This leaderboard is for the 2025 batch.
                      <br />
                      Complete assigned questions to appear here.
                    </p>
                  </div>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    );
  }

  const totalSolved = Number(yourRank.total_solved) || 0;
  const totalAssigned = yourRank.total_assigned || 1;
  const progress = totalSolved / totalAssigned;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const easy = yourRank.easy_solved || 0;
  const medium = yourRank.medium_solved || 0;
  const hard = yourRank.hard_solved || 0;
  const total = easy + medium + hard || 1;

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        className="pointer-events-auto absolute"
        initial={{ x: 20, y: 120 }}
      >
        <Popover >
          <PopoverTrigger asChild>
            <button className="px-3 py-1.5 rounded-lg  bg-primary text-black text-sm font-semibold shadow hover:scale-105 transition">
            Your Rank #{yourRank.rank}
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="center"
            className="w-[280px]  rounded-2xl  bg-transparent -p-2 shadow-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="bg-background/95 backdrop-blur-xl   rounded-2xl p-3 shadow-lg"
            >
              {/* Profile Section */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">

                  {yourRank.profile_image_url ?

                    <img
                      src={yourRank.profile_image_url || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                    />
                    :
                    <ProfileAvatar username={yourRank.username}  />
                }

                  <div className="absolute -bottom-1 -right-1 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    #{yourRank.rank}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{yourRank.name}</h3>
                  <span className="text-xs text-muted-foreground block truncate">
                    @{yourRank.username}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted/50 rounded-full flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {yourRank.city_name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted/50 rounded-full flex items-center gap-0.5">
                      <GraduationCap className="w-2.5 h-2.5" />
                      {yourRank.batch_year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Circle - Main Focus */}
              <div className="flex justify-center mb-4">
                <div className="relative w-[100px] h-[100px]">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted/20"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="text-primary"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-foreground">
                      {totalSolved}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {totalAssigned}
                    </span>
                  </div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="space-y-2 mb-3">
                {[
                  { label: "Easy", value: easy, color: "bg-green-500" },
                  { label: "Medium", value: medium, color: "bg-yellow-500" },
                  { label: "Hard", value: hard, color: "bg-red-500" },
                ].map((item) => {
                  const percent = (item.value / total) * 100;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`${item.color} h-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-primary/10 rounded-2xl p-2.5 text-center border border-primary/20">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="font-bold text-sm text-primary">
                    {yourRank.score}
                  </div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-2.5 text-center border border-border/50">
                  <div className="text-xs text-muted-foreground">Max Streak</div>
                  <div className="font-bold text-sm">
                    {yourRank.max_streak}
                  </div>
                </div>
              </div>
            </motion.div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  );
}