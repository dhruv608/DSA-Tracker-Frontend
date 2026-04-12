"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClassFilterBarProps {
  filter: string;
  onFilterChange: (newFilter: string) => void;
  totalQuestions: number;
}

export function ClassFilterBar({ filter, onFilterChange, totalQuestions }: ClassFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 rounded-2xl glass bg-background/40 backdrop-blur-xl">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-9 rounded-2xl bg-muted border border-border px-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Questions</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RIGHT */}
      <div className="text-primary flex items-center gap-1">
        <span className="text-xs">
          Showing
        </span>
        <span className="text-xs font-medium">
          {totalQuestions}
        </span>
        <span className="text-xs">
          questions
        </span>
      </div>
    </div>
  );
}
