"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { PracticeFilters as FilterType } from '@/services/student/practice.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOptions {
  topics: any[];
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
  clearFilters 
}: PracticeFiltersProps) {
  return (
    <div className="bg-gradient-to-br from-card to-card/80 border border-border/60 p-6 rounded-2xl mb-6 shadow-lg backdrop-blur-sm">
      
      {/* Search */}
      <div className="relative mb-4">
        <div className="flex bg-background/80 border border-border/60 rounded-xl p-1 overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground/70 ml-4 mr-3 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search questions by name or topic..." 
            className="flex-1 bg-transparent border-none text-[14px] outline-none px-2 py-3 placeholder:text-muted-foreground/50"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Topic Filter */}
        <Select 
          value={filters.topic || "ALL"} 
          onValueChange={(val) => handleFilterChange('topic', val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Topics</SelectItem>
            {filterOptions.topics.map((topic: any) => (
              <SelectItem key={topic.id} value={topic.slug}>
                {topic.topic_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select 
          value={filters.level || "ALL"} 
          onValueChange={(val) => handleFilterChange('level', val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            {filterOptions.levels.map((level: string) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Platform Filter */}
        <Select 
          value={filters.platform || "ALL"} 
          onValueChange={(val) => handleFilterChange('platform', val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Platforms</SelectItem>
            {filterOptions.platforms.map((platform: string) => (
              <SelectItem key={platform} value={platform}>
                {platform.charAt(0) + platform.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select 
          value={filters.type || "ALL"} 
          onValueChange={(val) => handleFilterChange('type', val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {filterOptions.types.map((type: string) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Solved Status Filter */}
        <Select 
          value={filters.solved || "ALL"} 
          onValueChange={(val) => handleFilterChange('solved', val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="true">Solved ✓</SelectItem>
            <SelectItem value="false">Unsolved</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-500/30 hover:border-red-500/50 text-red-600 dark:text-red-400 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}