"use client";
import React from 'react';
import { Input } from '../../../../app/(auth)/shared/components/Input';
import { Button } from '../../../../app/(auth)/shared/components/Button';

export function OnboardingStep2({ data, setData, setStep }: { data: any, setData: any, setStep: any }) {
  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">
          Coding Profiles
        </h1>

        <p className="text-xs text-muted-foreground font-medium">
          Connect your coding profiles for automated evaluation tracking.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (data.leetcode_id && data.gfg_id) setStep(3);
        }}
        className="space-y-6"
      >

        {/* LEETCODE */}
        <div className="space-y-2 p-4 rounded-xl border bg-muted/30">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-orange-400 tracking-wide">
              LeetCode Username
            </label>

            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
              Required
            </span>
          </div>

          <Input
            type="text"
            value={data.leetcode_id}
            onChange={e => setData({ ...data, leetcode_id: e.target.value })}
            className="h-11 rounded-lg bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
            placeholder="LeetCode Handle"
            required
          />

          <p className="text-[11px] text-muted-foreground">
            Used to track your problem-solving progress automatically.
          </p>
        </div>

        {/* GFG */}
        <div className="space-y-2 p-4 rounded-xl border bg-muted/30">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-green-400 tracking-wide">
              GFG Username
            </label>

            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
              Required
            </span>
          </div>

          <Input
            type="text"
            value={data.gfg_id}
            onChange={e => setData({ ...data, gfg_id: e.target.value })}
            className="h-11 rounded-lg bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
            placeholder="GeeksForGeeks Handle"
            required
          />

          <p className="text-[11px] text-muted-foreground">
            Helps evaluate your coding performance across topics.
          </p>
        </div>

        {/* CTA */}
        <Button
          type="submit"
          disabled={!data.leetcode_id || !data.gfg_id}
          className="w-full h-11 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue →
        </Button>
      </form>
    </>
  );
}
