"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TopicsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TopicsHeader({ searchQuery, setSearchQuery }: TopicsHeaderProps) {
  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif italic text-3xl font-bold text-foreground mb-3">
            Learning <span className="text-primary font-bold">Modules</span>
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-2xl">
            Track your progress across different data structure and algorithm topics. Complete classes and solve questions to master each module.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!pl-9 bg-background/60 border-border/60 w-full  focus:ring-2 focus:ring-primary/30 h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
