"use client";
import React from 'react';
import { Search, TrendingUp, MapPin, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';
import { FilterBarProps } from '@/types/student/index.types';

export function FilterBar({ 
  lSearch, setLSearch, 
  lCity, setLCity, cityOptionsObj, setLYear,
  lYear, yearOptionsObj, allYears,
  mode = 'admin',
  isLoading = false
}: FilterBarProps) {
  return (
    <div className="flex   rounded-2xl p-5 items-center justify-between w-full ">
      {/* LEFT SECTION - SEARCH */}
      <div className="flex-1">
        <div className="relative !w-90 max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground w-4 h-4" />
          <Input 
              placeholder="Search by name and username..." 
              value={lSearch}
              onChange={(e) => { setLSearch(e.target.value); }}
              className="pl-9! w-full h-9! border! border-border/40! glass! group! focus-visible:ring-1! transition-all  placeholder:text-white"
          />
        </div>
      </div>
      
      {/* RIGHT SECTION - CITY AND YEAR FILTERS */}
      <div className="flex items-center gap-3">
        <Select 
          value={lCity} 
          onChange={(v: string | number) => { 
            setLCity(String(v)); 
          }}
          options={cityOptionsObj}
          className="w-[150px] h-9 text-sm group border border-border/40"
          icon={<MapPin className="w-3.5 h-3.5" />}
          placeholder="City"
        />

        <Select 
          value={lYear?.toString() || ''} 
          onChange={(v: string | number) => { setLYear(Number(v)); }}
          options={yearOptionsObj}
          className="w-[120px] h-9 text-sm group border border-border/40"
          icon={<CalendarDays className="w-3.5 h-3.5" />}
          placeholder="Year"
          disabled={!allYears || allYears.length === 0}
        />
        {!isLoading && (!allYears || allYears.length === 0) && (
          <span className="text-xs text-muted-foreground">No years available</span>
        )}
      </div>
    </div>
  );
}
