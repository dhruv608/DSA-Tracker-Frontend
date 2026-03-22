"use client";
import React from 'react';
import { Filter, Search, TrendingUp, MapPin, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';

export function FilterBar({ 
  lSearch, setLSearch, 
  lType, setLType, typeOptionsObj,
  lCity, setLCity, cityOptionsObj, setLYear,
  lYear, yearOptionsObj, allYears 
}: any) {
  return (
    <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-card/60 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-1.5 text-foreground font-semibold px-2 border-r border-border mr-2 opacity-80">
          <Filter className="w-4 h-4"/> Filter
      </div>
      
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
            placeholder="Search by username..." 
            value={lSearch}
            onChange={(e) => { setLSearch(e.target.value); }}
            className="pl-9 h-9 bg-background focus-visible:ring-1 transition-all hover:bg-muted/50"
        />
      </div>
      
      <Select 
          value={lType} 
          onChange={(v: any) => { setLType(v); }}
          options={typeOptionsObj}
          className="w-[140px] h-9 text-sm"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          placeholder="Timeframe"
      />
      
      <Select 
          value={lCity} 
          onChange={(v: any) => { 
            setLCity(v); 
          }}
          options={cityOptionsObj}
          className="w-[150px] h-9 text-sm"
          icon={<MapPin className="w-3.5 h-3.5" />}
          placeholder="City"
      />

      <Select 
          value={lYear.toString()} 
          onChange={(v: any) => { setLYear(Number(v)); }}
          options={yearOptionsObj}
          className="w-[130px] h-9 text-sm"
          icon={<CalendarDays className="w-3.5 h-3.5" />}
          placeholder="Year"
          disabled={allYears.length === 0}
      />
      {allYears.length === 0 && (
        <span className="text-xs text-muted-foreground ml-2">No years available</span>
      )}
    </div>
  );
}
