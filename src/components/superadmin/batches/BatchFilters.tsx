"use client";

import { Search, Layers, MapPin, Calendar, LayoutGrid, Table } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BatchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCity: string;
  onCityChange: (value: string) => void;
  filterYear: string;
  onYearChange: (value: string) => void;
  onCreateBatch: () => void;
  cities: { id: number; city_name: string }[];
  years: number[];
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
}

export function BatchFilters({ 
  search, 
  onSearchChange, 
  filterCity, 
  onCityChange, 
  filterYear, 
  onYearChange, 
  onCreateBatch, 
  cities,
  years,
  viewMode = 'table',
  onViewModeChange
}: BatchFiltersProps) {
  const hasFilters = search || filterCity || filterYear;

  const clearFilters = () => {
    onSearchChange('');
    onCityChange('');
    onYearChange('');
  };

  return (
  <div className="
    glass hover-glow
    rounded-2xl p-5 mb-6
    border border-border/30
    relative overflow-hidden
    group
  ">

    {/* ✨ Ambient Glow */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-chart-3/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-3/10 blur-3xl rounded-full"></div>
    </div>

    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between relative z-10">

      {/* 🔹 LEFT */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">

        {/* 🔍 Search */}
        <div className="relative flex-1 max-w-sm group">
          <Search className="
            absolute left-3 top-1/2 -translate-y-1/2 
            w-4 h-4 text-muted-foreground
            transition group-focus-within:text-primary z-10
          " />

          <Input
            placeholder="Search batches..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              h-10 !pl-9 !pr-9
              rounded-full
              bg-accent/40 backdrop-blur
              border border-border/30
              focus:ring-2 focus:ring-primary/30
              focus:bg-accent/60
              transition-all
            "
          />
        </div>

        {/* 🔸 Filters */}
        <div className="flex items-center gap-2">

          {/* City */}
          <Select value={filterCity || "all"} onValueChange={onCityChange}>
            <SelectTrigger className="
              h-10 px-3 rounded-full
              bg-accent/40 backdrop-blur
              border border-border/30
              hover:border-primary/40
              transition
            ">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Cities" />
              </div>
            </SelectTrigger>

            <SelectContent className="glass border-border/30">
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year */}
          <Select value={filterYear || "all"} onValueChange={onYearChange}>
            <SelectTrigger className="
              h-10 px-3 rounded-full
              bg-accent/40 backdrop-blur
              border border-border/30
              hover:border-primary/40
              transition
            ">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Years" />
              </div>
            </SelectTrigger>

            <SelectContent className="glass border-border/30">
              <SelectItem value="all">All Years</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="
              text-xs text-muted-foreground
              hover:text-primary
              underline underline-offset-4
              transition
            "
          >
            Clear
          </button>
        )}
      </div>

      {/* 🔹 RIGHT */}
      <div className="flex items-center gap-3 w-full lg:w-auto">

        {/* View Toggle */}
        {onViewModeChange && (
          <div className="
            flex items-center gap-1 p-1
            rounded-xl
            bg-accent/30 backdrop-blur
            border border-border/30
          ">
            <button
              onClick={() => onViewModeChange("table")}
              className={`
                p-2 rounded-lg transition-all
                ${viewMode === "table"
                  ? "bg-chart-3/20 text-chart-3 border border-chart-3/30"
                  : "text-muted-foreground hover:text-foreground"}
              `}
            >
              <Table className="w-4 h-4" />
            </button>

            <button
              onClick={() => onViewModeChange("cards")}
              className={`
                p-2 rounded-lg transition-all
                ${viewMode === "cards"
                  ? "bg-chart-3/20 text-chart-3 border border-chart-3/30"
                  : "text-muted-foreground hover:text-foreground"}
              `}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={onCreateBatch}
          className="
            w-full sm:w-auto shrink-0
            rounded-full
            bg-chart-3 text-background
            hover:bg-chart-3/90
            shadow-md hover:shadow-lg
            transition-all
          "
        >
          <Layers className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>
    </div>
  </div>
);
}
