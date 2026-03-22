"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { getAdminLeaderboard } from '@/services/admin.service';
import { 
  Trophy, 
  Search, 
  MapPin,
  TrendingUp,
  Award,
  CalendarDays,
  Flame,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';

export default function AdminLeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity, selectedBatch, isLoadingContext } = useAdminStore();

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // URL States & Filters
  const [lSearch, setLSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  
  // POST body metrics
  const defaultYear = new Date().getFullYear();
  const [lType, setLType] = useState('all'); // alltime, monthly, weekly
  // We'll let the Admin toggle between "All Cities" or their active City context
  const [lCityMode, setLCityMode] = useState<'all' | 'context'>('all');

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (lSearch) params.set('search', lSearch);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/admin/leaderboard?${params.toString()}`);
  }, [lSearch, page, router]);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const query = { page, limit: 15, search: lSearch || undefined };
      
      const cityFilter = lCityMode === 'context' && selectedCity ? selectedCity.name : 'all';
      const yearFilter = lCityMode === 'context' && selectedBatch ? (selectedBatch as any).year || 'all' : 'all';

      const body = { city: cityFilter, type: lType, year: yearFilter };
      
      const res = await getAdminLeaderboard(query, body);
      setLeaderboard(res.leaderboard || []);
      setTotalPages(res.totalPages || 1);
      setTotalRecords(res.total || 0);
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLoading(false);
    }
  }, [lSearch, page, lType, lCityMode, selectedCity, selectedBatch, defaultYear]);

  useEffect(() => {
    updateUrl();
    if (!isLoadingContext) {
      fetchLeaderboard();
    }
  }, [updateUrl, fetchLeaderboard, isLoadingContext]);
  
  useEffect(() => {
    setPage(1); // Reset to page 1 when modifying primary body filters
  }, [lType, lCityMode, selectedCity?.id]);

  if (isLoadingContext) return <Skeletons />;

  return (
    <div className="flex flex-col space-y-6">
      
      <div className="flex items-end justify-between">
         <div>
           <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <Trophy className="w-6 h-6 text-primary" /> Administrator Leaderboard
           </h2>
           <p className="text-muted-foreground mt-1 text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
             Rankings across overarching structural bounds.
           </p>
         </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[600px]">
         <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-muted/20">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                 placeholder="Search student or username..." 
                 value={lSearch}
                 onChange={(e) => { setLSearch(e.target.value); setPage(1); }}
                 className="pl-9 h-9 bg-background focus-visible:ring-1"
              />
            </div>
            
            <Select 
               value={lType} 
               onChange={(v) => { setLType(v as string); }}
               options={[
                 {label: 'All-Time Ranks', value: 'all'},
                 {label: 'Monthly Standings', value: 'monthly'},
                 {label: 'Weekly Pulse', value: 'weekly'},
               ]}
               className="w-[180px] h-9 text-sm"
               icon={<TrendingUp className="w-3.5 h-3.5" />}
               placeholder="Timeframe"
            />
            
            <Select 
               value={lCityMode} 
               onChange={(v) => { setLCityMode(v as 'all' | 'context'); }}
               options={[
                 {label: 'Global Competition (All)', value: 'all'},
                 {label: `Local Pool (${selectedCity?.name || 'Loading...'})`, value: 'context'},
               ]}
               className="w-[220px] h-9 text-sm"
               icon={<MapPin className="w-3.5 h-3.5" />}
               placeholder="Scope"
               disabled={!selectedCity}
            />
         </div>
         
         <div className="overflow-x-auto flex-1">
            <Table>
               <TableHeader>
                 <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>Competitor Details</TableHead>
                    <TableHead>Location Bound</TableHead>
                    <TableHead className="text-center">Complexity Span</TableHead>
                    <TableHead className="text-center">Score Metric</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {loading ? (
                    <TableRow>
                       <TableCell colSpan={5} className="h-[400px] text-center text-muted-foreground">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Calculating hierarchy...
                       </TableCell>
                    </TableRow>
                 ) : leaderboard.length === 0 ? (
                    <TableRow>
                       <TableCell colSpan={5} className="h-[400px] text-center text-muted-foreground">
                          No leaderboard metrics were identified for the current configuration.
                       </TableCell>
                    </TableRow>
                 ) : (
                    leaderboard.map((entry) => {
                       const pos = entry.rank || '-';
                       let rankClass = "text-muted-foreground font-semibold";
                       if (pos === 1) rankClass = "text-yellow-500 font-bold drop-shadow-sm";
                       else if (pos === 2) rankClass = "text-slate-400 font-bold drop-shadow-sm";
                       else if (pos === 3) rankClass = "text-amber-700 font-bold drop-shadow-sm";

                       return (
                       <TableRow key={entry.student_id} className="group hover:bg-muted/30">
                          <TableCell className="text-center">
                             <div className="flex flex-col items-center justify-center">
                               {pos <= 3 ? <Medal className={`w-6 h-6 ${rankClass} mb-1`} /> : null}
                               <span className={`text-lg ${pos <= 3 ? rankClass : 'text-foreground font-medium'}`}>#{pos}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col">
                                <Link href={`/admin/students/${entry.username}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                                   {entry.name}
                                </Link>
                                <span className="text-xs text-muted-foreground font-mono">@{entry.username}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col gap-0.5 items-start">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded border border-border bg-muted/60">{entry.city_name}</span>
                                <span className="text-xs text-muted-foreground opacity-70 flex items-center gap-1 mt-1"><CalendarDays className="w-3 h-3"/> Batch {entry.batch_year}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-center">
                             <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                                <span className="bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded">{entry.easy_solved} E</span>
                                <span className="bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded">{entry.medium_solved} M</span>
                                <span className="bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">{entry.hard_solved} H</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-center">
                             <div className="flex flex-col items-center gap-1">
                                <span className="font-bold text-foreground text-base tracking-tight">{entry.total_solved}</span>
                                {entry.max_streak > 0 && <span className="text-xs font-medium text-orange-500 flex items-center gap-1"><Flame className="w-3 h-3"/> {entry.max_streak} streak</span>}
                             </div>
                          </TableCell>
                       </TableRow>
                       );
                    })
                 )}
               </TableBody>
            </Table>
         </div>

         {/* Pagination Footer */}
         <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30 mt-auto">
            <span className="text-sm text-muted-foreground font-medium">Total: {totalRecords} | Page {page} of {Math.max(1, totalPages)}</span>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || loading}>Previous</Button>
               <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading}>Next</Button>
            </div>
         </div>
      </div>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-6 animate-pulse mt-4">
       <div className="h-10 w-48 bg-muted rounded-md shrink-0"></div>
       <div className="h-[600px] w-full bg-card border border-border rounded-xl"></div>
    </div>
  );
}
