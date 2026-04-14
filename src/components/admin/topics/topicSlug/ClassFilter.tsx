"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ClassFilterProps {
   search: string;
   onSearchChange: (value: string) => void;
   totalRecords: number;
}

export default function ClassFilter({ search, onSearchChange, totalRecords }: ClassFilterProps) {
   return (
      <div className=" glass backdrop-blur-2xl mb-5 rounded-2xl overflow-hidden shadow-md">

         <div className="flex items-center justify-between  px-5 py-4  ">

            {/* SEARCH */}
            <div className="relative flex-1 max-w-sm ">

               <Search className=" absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4  text-foreground  pointer-events-none  transition group-focus-within:text-primary " />

               <Input
                  placeholder="Search classes..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className=" h-10! pl-9! pr-9! rounded-2xl! focus:ring-2 dark:bg-transparent! placeholder:text-white focus:ring-primary/20  focus:bg-accent/60   transition-all   "
               />
            </div>
            {/* COUNT BADGE */}
            <div className="  text-xs font-semibold tracking-wide  px-3 py-1.5 rounded-full  bg-primary/10 text-primary  border border-primary/20  shadow-[0_0_10px_var(--hover-glow)]   ">
               {totalRecords} Classes
            </div>

         </div>
      </div>
   );
}
