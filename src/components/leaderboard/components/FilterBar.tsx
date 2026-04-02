"use client";
import React from 'react';
import { Search, TrendingUp, MapPin, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';

export function FilterBar({ 
  lSearch, setLSearch, 
  lType, setLType, typeOptionsObj,
  lCity, setLCity, cityOptionsObj, setLYear,
  lYear, yearOptionsObj, allYears,
  mode = 'admin',
  isLoading = false
}: any) {
  return (
    <div className="flex items-center justify-between w-full mb-6">
      {/* LEFT SECTION - SEARCH */}


      
      <div className="relative !w-90 max-w-[420px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
            placeholder="Search by name and username..." 
            value={lSearch}
            onChange={(e) => { setLSearch(e.target.value); }}
            className="!pl-9 h-9 bg-background focus-visible:ring-1 transition-all hover:bg-muted/50"
        />
      </div>
      
      {/* CENTER SECTION - TIME TABS */}
      <div className="flex justify-center ">
        <div className="flex bg-muted/50 rounded-2xl p-1">
          {typeOptionsObj?.map((option: any) => (
            <button
              key={option.value}
              onClick={() => setLType(option.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                lType === option.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* RIGHT SECTION - DROPDOWNS */}
      <div className="flex items-center gap-3">
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
          value={lYear?.toString() || ''} 
          onChange={(v: any) => { setLYear(Number(v)); }}
          options={yearOptionsObj}
          className="w-[120px] h-9 text-sm"
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
