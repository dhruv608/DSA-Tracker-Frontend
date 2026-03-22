import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ progress, className = '', showLabel = false }: ProgressBarProps) => {
  // Ensure progress is bounded between 0 and 100
  const validProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden border border-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-in-out"
          style={{ width: `${validProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium text-primary min-w-[36px] text-right">
          {Math.round(validProgress)}%
        </span>
      )}
    </div>
  );
};
