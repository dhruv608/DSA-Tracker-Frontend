"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ClassDetailFilterProps {
   search: string;
   onSearchChange: (value: string) => void;
   assignedTotalCount: number;
}

export default function ClassDetailFilter({ search, onSearchChange, assignedTotalCount }: ClassDetailFilterProps) {
   return (
      <div className=" glass backdrop-blur-2xl rounded-2xl mb-5 overflow-hidden   shadow-sm ">

         <div className="flex items-center justify-between  px-5 py-4  border-border/60  ">

            <div className="relative flex-1 max-w-sm group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground pointer-events-none transition group-focus-within:text-primary " />
               <Input
                  placeholder="Search classes..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-10! w-full pl-9! pr-9! rounded-2xl! dark:bg-transparent!   focus:ring-2 focus:ring-primary/20 focus:bg-accent/60   transition-all placeholder:text-white   "
               />
            </div>

            {/* COUNT BADGE */}
            <div className="  text-xs font-semibold tracking-wide  px-3 py-1.5 rounded-full   bg-primary/10 text-primary  border border-primary/20    shadow-[0_0_10px_var(--hover-glow)]   ">
               {assignedTotalCount} Assigned
            </div>

         </div>
      </div>
   );
}
