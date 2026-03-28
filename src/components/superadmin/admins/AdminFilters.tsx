"use client";

import { Search, Users, Filter, LayoutGrid, Table } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  onCreateAdmin: () => void;
  roles: string[];
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
}

export function AdminFilters({
  search,
  onSearchChange,
  filterRole,
  onRoleChange,
  onCreateAdmin,
  roles,
  viewMode = 'table',
  onViewModeChange
}: AdminFiltersProps) {
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

        {/* 🔍 LEFT SECTION */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">

          {/* Search */}

          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 w-4 h-4 z-10" />
            <Input
              placeholder="Search admins..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="!pl-10 w-full h-11 rounded-2xl bg-background/50 border-border focus-visible:ring-primary/40"
            />
          </div>


          {/* Filter */}
          <Select
            value={filterRole || "all"}
            onValueChange={onRoleChange}
          >
            <SelectTrigger className="
            w-full sm:max-w-[160px]
            bg-accent/40 backdrop-blur
            border border-border/30
            rounded-full
            hover:border-primary/40
            transition
          ">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Roles" />
              </div>
            </SelectTrigger>

            <SelectContent className="glass border-border/30">
              <SelectItem value="all">All Roles</SelectItem>
              {roles.filter(r => r !== 'SUPERADMIN').map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {(filterRole || search) && (
            <button
              onClick={() => {
                onRoleChange('');
                onSearchChange('');
              }}
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

        {/* 🔘 RIGHT SECTION */}
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
                    ? 'bg-primary/20 text-primary shadow-md border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                  }
              `}
              >
                <Table className="w-4 h-4" />
              </button>

              <button
                onClick={() => onViewModeChange('cards')}
                className={`
                p-2 rounded-lg transition-all
                ${viewMode === 'cards'
                    ? 'bg-primary/20 text-primary shadow-md border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                  }
              `}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Create Button */}
          <Button
            onClick={onCreateAdmin}
            className="
            w-full sm:w-auto shrink-0
            rounded-full
            bg-primary text-primary-foreground
            hover:bg-primary/90
            shadow-md hover:shadow-lg
            transition-all
          "
          >
            <Users className="w-4 h-4 mr-2" />
            Create Admin
          </Button>
        </div>
      </div>
    </div>
  );
}