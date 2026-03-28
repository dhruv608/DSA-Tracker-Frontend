"use client";

import { Search, Building2, LayoutGrid, Table } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CityFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateCity: () => void;
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
}
export function CityFilters({ 
  search, 
  onSearchChange, 
  onCreateCity,
  totalCities, 
  viewMode = 'table',
  onViewModeChange
}: CityFiltersProps & { totalCities?: number }) {

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
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
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
              placeholder="Search cities..."
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

          {/* 🔸 TOTAL BADGE */}
          {totalCities !== undefined && (
            <div className="
              text-xs font-semibold tracking-wide
              px-3 py-1.5 rounded-full
              bg-primary/10 text-primary
              border border-primary/20
              shadow-[0_0_10px_var(--hover-glow)]
            ">
              {totalCities} Cities
            </div>
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
                onClick={() => onViewModeChange('table')}
                className={`
                  p-2 rounded-lg transition-all
                  ${viewMode === 'table'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <Table className="w-4 h-4" />
              </button>

              <button
                onClick={() => onViewModeChange('cards')}
                className={`
                  p-2 rounded-lg transition-all
                  ${viewMode === 'cards'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Create Button */}
          <Button
            onClick={onCreateCity}
            className="
              w-full sm:w-auto shrink-0
              rounded-full
              bg-primary text-primary-foreground
              hover:bg-primary/90
              shadow-md hover:shadow-lg
              transition-all
            "
          >
            <Building2 className="w-4 h-4 mr-2" />
            Create City
          </Button>
        </div>
      </div>
    </div>
  );
}