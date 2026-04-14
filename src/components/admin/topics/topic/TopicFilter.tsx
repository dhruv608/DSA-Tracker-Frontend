"use client";

import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface TopicFilterProps {
   search: string;
   onSearchChange: (value: string) => void;
   sortBy: string;
   onSortChange: (value: string) => void;
   onCreateClick: () => void;
}

export default function TopicFilter({ search, onSearchChange, sortBy, onSortChange, onCreateClick }: TopicFilterProps) {
   return (
      <div className="glass backdrop-blur-2xl mb-5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4  justify-between items-center">

         {/* SEARCH */}
         <div className="relative w-full sm:max-w-md ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground w-4 h-4" />
            <Input
               placeholder="Search topics..."
               value={search}
               onChange={(e) => onSearchChange(e.target.value)}
               className="pl-9! w-full h-11! rounded-2xl dark:bg-transparent! placeholder:text-white border! border-border/60! focus-visible:ring-primary/40"
            />
         </div>

         {/* ACTIONS */}
         <div className="flex items-center gap-3">

            <Select value={sortBy} onValueChange={onSortChange}>
               <SelectTrigger className="h-11 rounded-2xl glass backdrop-blur-2xl border border-border/40 px-6">
                  <SelectValue placeholder="Sort" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="classes">Most Classes</SelectItem>
                  <SelectItem value="questions">Most Questions</SelectItem>
               </SelectContent>
            </Select>

            <Button
               onClick={onCreateClick}
               className="h-11 px-5 rounded-xl bg-primary text-black font-semibold hover:opacity-90"
            >
               <Plus className="w-4 h-4 mr-2" />
               Create Topic
            </Button>

         </div>

      </div>
   );
}
