"use client";

import React from "react";
import { PodiumCard } from "./PodiumCard";


export default function PodiumSection({ top3 }: any) {
  if (!top3) return null;

  return (
    <div className="relative flex justify-center items-center gap-6 md:gap-12 py-20">

      {/* 🌌 Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full top-[-30%]" />

      {/* 🏆 Podium Layout */}
      <div className="flex items-center gap-6 md:gap-12">

        {/* Rank 2 */}
        <PodiumCard student={top3?.[1]} rank={2} />

        {/* Rank 1 (Center Hero) */}
        <PodiumCard student={top3?.[0]} rank={1} isCenter />

        {/* Rank 3 */}
        <PodiumCard student={top3?.[2]} rank={3} />

      </div>
    </div>
  );
}