"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, PenTool, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-start justify-center overflow-hidden hero-gradient pt-20 lg:pt-32">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[20%] w-[600px] h-[600px] bg-[var(--accent-primary)]/10 blur-[140px] rounded-full" />
        <div className="absolute right-[10%] bottom-[10%] w-[500px] h-[500px] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full" />
      </div>

      {/* 🧠 CONTENT WRAPPER */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* 📝 LEFT SIDE (TEXT) */}
        <div className="flex flex-col justify-center items-start text-left gap-3 max-w-2xl">

          {/* TAG */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            Your Coding Portal
          </div>

          {/* BRAND */}
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="text-foreground">Brute</span>
            <span className="text-[var(--accent-primary)] italic">Force</span>
          </h1>

          {/* 🔥 BIG TAGLINE (FIXED WRAPPING + SPACING) */}
          <h2 className="text-4xl md:text-6xl font-semibold leading-[1.15] tracking-tight">
            Solve Faster.<br />
            Rank Higher.<br />
            Stay Ahead.
          </h2>

          {/* SUBTEXT */}
          <p className="text-muted-foreground text-lg leading-relaxed">
            Master data structures, track your progress, and climb the leaderboard with precision.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-row gap-4 mt-3">

            <Button
              asChild
              size="lg"
              className="h-12 px-8 font-semibold bg-[var(--accent-primary)] text-black hover:brightness-110 transition-all"
            >
              <Link href="/topics">
                <Compass className="w-5 h-5 mr-2" />
                Explore Topics
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 font-semibold border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
            >
              <Link href="/practice">
                <PenTool className="w-5 h-5 mr-2" />
                Practice Now
              </Link>
            </Button>

          </div>
        </div>

        {/* 🎯 RIGHT SIDE */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-[400px] h-[400px] rounded-full bg-[var(--accent-primary)]/10 blur-[120px]" />
        </div>

      </div>
    </section>
  );
}