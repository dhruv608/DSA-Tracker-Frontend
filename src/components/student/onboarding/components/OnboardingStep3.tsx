"use client";
import React from 'react';
import { Button } from '../../../../app/(auth)/shared/components/Button';
import { AlertTriangle } from 'lucide-react';

export function OnboardingStep3({ data, setStep, confirmChecked, setConfirmChecked, submitOnboarding, loading }: any) {

  const handleEdit = () => {
    setStep(2);
  };

  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">
          Confirm Validation
        </h1>

        <p className="text-xs text-muted-foreground font-medium">
          Verify your profiles before final submission.
        </p>
      </div>

      <div className="space-y-6">

        {/* WARNING */}
        <div className="flex gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium p-4 rounded-xl">
          <AlertTriangle className="w-4 h-4 mt-[2px]" />
          <div>
            If your usernames are incorrect, evaluation will fail.  
            You <span className="font-semibold">cannot edit</span> tracking fields after submission.
          </div>
        </div>

        {/* PROFILE CARDS */}
        <div className="space-y-4">

          {/* LEETCODE */}
          <div className="p-4 bg-muted/40 rounded-xl border flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                LeetCode
              </p>
              <p className="font-medium text-sm truncate max-w-[160px]" title={data.leetcode_id}>
                {data.leetcode_id}
              </p>
            </div>

            <a
              href={`https://leetcode.com/u/${data.leetcode_id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:bg-primary/5 transition-all border border-primary/20 text-xs font-semibold px-3 py-1.5 bg-primary/10 rounded-md whitespace-nowrap"
            >
              View →
            </a>
          </div>

          {/* GFG */}
          <div className="p-4 bg-muted/40 rounded-xl border flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                GeeksForGeeks
              </p>
              <p className="font-medium text-sm truncate max-w-[160px]" title={data.gfg_id}>
                {data.gfg_id}
              </p>
            </div>

            <a
              href={`https://auth.geeksforgeeks.org/user/${data.gfg_id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:bg-primary/5 transition-all border border-primary/20 text-xs font-semibold px-3 py-1.5 bg-primary/10 rounded-md whitespace-nowrap"
            >
              View →
            </a>
          </div>
        </div>

        {/* CONFIRM */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="confirmData"
            checked={confirmChecked}
            onChange={e => setConfirmChecked(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary cursor-pointer border-border rounded"
          />

          <label
            htmlFor="confirmData"
            className="text-xs text-muted-foreground leading-tight cursor-pointer"
          >
            I confirm that the above profiles are correct and belong to me.
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">

          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={loading}
            className="w-1/3 h-11"
          >
            Edit
          </Button>

          <Button
            onClick={submitOnboarding}
            disabled={!confirmChecked || loading}
            className="w-2/3 h-11 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Saving securely..." : "Confirm & Continue"}
          </Button>

        </div>
      </div>
    </>
  );
}
