"use client";

import React from 'react';
import { Search } from 'lucide-react';

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
            Learning <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">Modules</span>
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-2xl">
            Track your progress across different data structure and algorithm topics. Complete classes and solve questions to master each module.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary/30 border border-border rounded-xl p-1 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all items-center">
            <Search className="w-4 h-4 text-muted-foreground ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="w-[180px] bg-transparent border-none text-[13.5px] outline-none px-2 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}