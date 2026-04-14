"use client";

import React from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfiniteScrollDropdown } from "@/components/ui/InfiniteScrollDropdown";
import { PracticeFiltersComponentProps, PracticeFilterOptions } from '@/types/student/index.types';
import type { PracticeFilters } from '@/types/student/index.types';

export function PracticeFilters({
  filters,
  filterOptions,
  hasActiveFilters,
  handleFilterChange,
  clearFilters,
}: PracticeFiltersComponentProps & { filterOptions: PracticeFilterOptions }) {
  return (
   <div className="relative z-10 mb-6">

  {/* 🔥 GLASS / BLUR BACKGROUND LAYER */}
  <div className="absolute inset-0 rounded-2xl glass backdrop-blur-xs pointer-events-none" />

  {/* ✅ ACTUAL CONTENT */}
  <div className="relative p-3 rounded-2xl">

    {/* 🔍 SEARCH */}
    <div className="relative mb-5 rounded-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />

      <input
        type="text"
        placeholder="Search questions..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="w-full pl-10! pr-4! py-3! rounded-2xl dark:bg-transparent! border border-border/40 
        text-sm outline-none placeholder:text-white
        focus:border-primary/40 focus:ring-2 focus:ring-primary/20 
        transition-all"
      />
    </div>

    {/* ⚙️ FILTER ROW */}
    <div className="flex flex-wrap items-center gap-3">

      {/* Topic */}
      <InfiniteScrollDropdown
        value={filters.topic || ""}
        onValueChange={(val) => handleFilterChange("topic", val)}
        placeholder="Topics"
        searchPlaceholder="Search topics..."
        className="min-w-[200px] bg-transparent rounded-2xl border border-border/30"
      />

      {/* Level */}
      <Select
        value={filters.level || "ALL"}
        onValueChange={(val) =>
          handleFilterChange("level", val === "ALL" ? "" : val)
        }
      >
        <SelectTrigger className="h-11 px-4 bg-transparent text-xs rounded-2xl border border-border/40">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          <SelectItem value="ALL">All Levels</SelectItem>
          {filterOptions.levels.map((level: string) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Platform */}
      <Select
        value={filters.platform || "ALL"}
        onValueChange={(val) =>
          handleFilterChange("platform", val === "ALL" ? "" : val)
        }
      >
        <SelectTrigger className="h-11 px-4 bg-transparent text-xs rounded-2xl border border-border/50">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          <SelectItem value="ALL">All Platforms</SelectItem>
          {filterOptions.platforms.map((platform: string) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type */}
      <Select
        value={filters.type || "ALL"}
        onValueChange={(val) =>
          handleFilterChange("type", val === "ALL" ? "" : val)
        }
      >
        <SelectTrigger className="h-11 px-4 bg-transparent text-xs rounded-2xl border border-border/50">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          <SelectItem value="ALL">All Types</SelectItem>
          {filterOptions.types.map((type: string) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.solved || "ALL"}
        onValueChange={(val) =>
          handleFilterChange("solved", val === "ALL" ? "" : val)
        }
      >
        <SelectTrigger className="h-11 bg-transparent px-4 text-sm rounded-2xl border border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="true">Solved</SelectItem>
          <SelectItem value="false">Unsolved</SelectItem>
        </SelectContent>
      </Select>

      {/* CLEAR FILTER */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="ml-auto flex items-center gap-1 text-xs px-3 py-2 rounded-lg 
          border border-border/50 hover:bg-muted transition-all"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  </div>
</div>
  );
}
