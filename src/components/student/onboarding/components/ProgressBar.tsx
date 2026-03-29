import React from 'react';

export function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10 mt-3">

      {/* STEP 1 */}
      <div className="flex flex-col items-center gap-1.5 w-16">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            step >= 1
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          1
        </div>

        <span
          className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
            step >= 1 ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          Username
        </span>
      </div>

      {/* LINE */}
      <div
        className={`h-[3px] w-12 rounded-full transition-all duration-300 ${
          step >= 2 ? 'bg-primary shadow-sm shadow-primary/40' : 'bg-muted/80'
        }`}
      />

      {/* STEP 2 */}
      <div className="flex flex-col items-center gap-1.5 w-16">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            step >= 2
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          2
        </div>

        <span
          className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
            step >= 2 ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          Profiles
        </span>
      </div>

      {/* LINE */}
      <div
        className={`h-[3px] w-12 rounded-full transition-all duration-300 ${
          step === 3 ? 'bg-primary shadow-sm shadow-primary/40' : 'bg-muted/80'
        }`}
      />

      {/* STEP 3 */}
      <div className="flex flex-col items-center gap-1.5 w-16">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            step === 3
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          3
        </div>

        <span
          className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
            step === 3 ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          Confirm
        </span>
      </div>
    </div>
  );
}
