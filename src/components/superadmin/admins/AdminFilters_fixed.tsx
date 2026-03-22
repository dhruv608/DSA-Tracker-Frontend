"use client";

import { Search, Users, Filter } from 'lucide-react';
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
}

export function AdminFilters({ 
  search, 
  onSearchChange, 
  filterRole, 
  onRoleChange, 
  onCreateAdmin, 
  roles 
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative w-full sm:max-w-xs group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <Input
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => { onSearchChange(e.target.value); }}
            className="w-full pl-9"
          />
        </div>
        <Select
          value={filterRole || "all"}
          onValueChange={onRoleChange}
        >
          <SelectTrigger className="w-full sm:max-w-[150px] bg-background">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder="All Roles" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.filter(r => r !== 'SUPERADMIN').map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filterRole || search) && (
          <button onClick={() => { onRoleChange(''); onSearchChange(''); }} className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-4">Clear</button>
        )}
      </div>
      <Button onClick={onCreateAdmin} className="w-full sm:w-auto shrink-0">
        <Users className="w-4 h-4 mr-2" />
        Create Admin
      </Button>
    </div>
  );
}
