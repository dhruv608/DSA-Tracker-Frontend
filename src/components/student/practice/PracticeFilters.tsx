"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { PracticeFilters as FilterType } from "@/services/student/practice.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfiniteScrollDropdown } from "@/components/ui/InfiniteScrollDropdown";

interface FilterOptions {
  topics?: any[];
  levels: string[];
  platforms: string[];
  types: string[];
}

interface PracticeFiltersProps {
  filters: FilterType;
  filterOptions: FilterOptions;
  hasActiveFilters: boolean;
  handleFilterChange: (key: keyof FilterType, value: any) => void;
  clearFilters: () => void;
}

export function PracticeFilters({
  filters,
  filterOptions,
  hasActiveFilters,
  handleFilterChange,
  clearFilters,
}: PracticeFiltersProps) {
  return (
    <div className="glass bg-card border border-border/60 p-5 rounded-2xl mb-6">

      {/* 🔍 SEARCH */}
      <div className="relative mb-5 border border-border rounded-2xl">
        <Search className=" absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />

        <input
          type="text"
          placeholder="Search questions..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/40 border border-border/50 
          text-sm outline-none 
          focus:border-primary/40 focus:ring-2 focus:ring-primary/20 
          transition-all"
        />
      </div>

      {/* ⚙️ FILTER ROW */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Topic - New Infinite Scroll Dropdown */}
        <InfiniteScrollDropdown
          value={filters.topic || ""}
          onValueChange={(val) => handleFilterChange("topic", val)}
          placeholder="Topics"
          searchPlaceholder="Search topics..."
          className="min-w-[200px]"
        />

        {/* Level */}
        <Select
          value={filters.level || "ALL"}
          onValueChange={(val) =>
            handleFilterChange("level", val === "ALL" ? "" : val)
          }
        >
          <SelectTrigger className="h-11 px-4 text-xs rounded-lg bg-muted/40 border-border/50">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger className="h-11 px-4 text-xs rounded-xl bg-muted/40 border-border/50">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger className="h-11 px-4 text-xs rounded-xl bg-muted/40 border-border/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger className="h-11 px-4 text-sm rounded-xl bg-muted/40 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="true">Solved</SelectItem>
            <SelectItem value="false">Unsolved</SelectItem>
          </SelectContent>
        </Select>

        {/* 🔥 CLEAR FILTER (FIXED) */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs px-3 py-2 rounded-lg 
            bg-muted/40 border border-border/50 
            hover:bg-muted transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
