"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PodiumShimmer from '@/components/admin/leaderboard/shimmers/PodiumShimmer';
import StatsShimmer from '@/components/admin/leaderboard/shimmers/StatsShimmer';
import TableShimmer from '@/components/admin/leaderboard/shimmers/TableShimmer';
import { YourRankCard } from '@/components/student/leaderboard/YourRankCard';
import { Top10 } from './components/Top10';
import { YourRank } from './components/YourRank';
import { Filters } from './components/Filters';
import { LeaderboardTable } from '@/components/student/leaderboard/LeaderboardTable';
import { useLeaderboard, LeaderboardData } from '@/hooks/useLeaderboard';
import { studentAuthService } from '@/services/student/auth.service';

// Hook for Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface LeaderboardPageClientProps {
  initialData: LeaderboardData;
  initialSearch: string;
}

export function LeaderboardPageClient({ initialData, initialSearch }: LeaderboardPageClientProps) {
  console.log('🎯 LeaderboardPageClient rendering with:', { initialData, initialSearch });
  console.log('📊 InitialData structure:', JSON.stringify(initialData, null, 2));
  
  const [lSearch, setLSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(lSearch, 400);
  const [studentData, setStudentData] = useState<any>(null);

  // Fetch student data for default filters
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await studentAuthService.getCurrentStudent();
        setStudentData(data);
        console.log('👤 Student data fetched:', data);
      } catch (error) {
        console.error('❌ Failed to fetch student data:', error);
      }
    };
    fetchStudentData();
  }, []);

  // Filter state - start with defaults, will be updated when student data loads
  const [filters, setFilters] = useState(() => ({
    city: initialData?.filters?.city || 'all',
    year: initialData?.filters?.year || new Date().getFullYear(),
    type: initialData?.filters?.type || 'all'
  }));

  // Update filters when student data is loaded (only if no URL params exist)
  useEffect(() => {
    if (studentData?.data) {
      // Only update defaults if current filters are still the initial defaults
      // and no URL parameters are set
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlParams = urlParams.has('city') || urlParams.has('year');
      
      if (!hasUrlParams) {
        setFilters({
          city: studentData.data.city?.city_name || 'all',
          year: studentData.data.batch?.year || new Date().getFullYear(),
          type: 'all'
        });
      }
    }
  }, [studentData]);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (filters.city !== 'all') params.set('city', filters.city);
    if (filters.year !== 0) params.set('year', filters.year.toString());
    if (filters.type !== 'all') params.set('type', filters.type);
    
    // Use window.history instead of router.replace to avoid scroll to top
    const newUrl = `/leaderboard?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedSearch, filters]);

  useEffect(() => { 
    updateUrl(); 
  }, [updateUrl]);

  // Use the useLeaderboard hook with initialData for hydration
  const { data, isLoading, error } = useLeaderboard({
    filters: {
      city: filters.city === 'all' ? 'all' : filters.city,
      year: filters.year === 0 ? undefined : filters.year,
      type: filters.type
    },
    search: debouncedSearch,
    initialData: debouncedSearch === initialSearch && JSON.stringify(filters) === JSON.stringify(initialData?.filters || {}) ? initialData : undefined,
  });

  console.log('📊 useLeaderboard result:', { 
    data: data ? 'DATA_EXISTS' : 'NO_DATA', 
    dataLength: data?.top10?.length || 0,
    isLoading, 
    error: error ? error.message : 'NO_ERROR',
    hasYourRank: !!data?.yourRank,
    top10FirstItem: data?.top10?.[0] || 'NO_TOP10_DATA',
    currentFilters: filters
  });

  // Use data from query (will be initialData on first render if search hasn't changed)
  const leaderboardData = data || initialData;
  console.log('🏆 Final leaderboard data to render:', {
    hasData: !!leaderboardData,
    top10Length: leaderboardData?.top10?.length || 0,
    hasYourRank: !!leaderboardData?.yourRank,
    success: leaderboardData?.success,
    firstTop10Name: leaderboardData?.top10?.[0]?.name || 'NO_NAME'
  });

  if (isLoading && !initialData.yourRank) {
    return (
      <div className="flex flex-col space-y-6">
        <PodiumShimmer />
        <StatsShimmer />
        <TableShimmer />
      </div>
    );
  }

  if (error) {
    console.error('❌ Leaderboard error:', error);
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load leaderboard data.</p>
        <p className="text-xs text-muted-foreground mt-2">Check console for details.</p>
      </div>
    );
  }

  // Calculate completion percentage for stats
  const getCompletionPercentage = (entry: any) => {
    return ((entry.easy_completion + entry.medium_completion + entry.hard_completion) / 3).toFixed(1);
  };
  //  console.log("vergrtgrtgrt: ",studentData)
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Your Rank Section */}
      <YourRank yourRank={leaderboardData.yourRank} />

      {/* Top 10 Section */}
      <Top10 top10={leaderboardData.top10} filters={filters} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass hover-glow rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground font-medium mb-0.5">Total Participants</p>
            <p className="text-3xl font-black tracking-tight text-foreground drop-shadow-sm">{leaderboardData.top10.length}</p>
          </div>
        </div>

        <div className="glass hover-glow rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground font-medium mb-0.5">Avg Completion</p>
            <p className="text-3xl font-black tracking-tight text-foreground drop-shadow-sm">
              {leaderboardData.top10.length > 0 
                ? `${(leaderboardData.top10.reduce((acc: number, entry: any) => acc + parseFloat(getCompletionPercentage(entry)), 0) / leaderboardData.top10.length).toFixed(1)}%`
                : '0%'
              }
            </p>
          </div>
        </div>

        <div className="glass hover-glow rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground font-medium mb-0.5">Peak Completion</p>
            <p className="text-3xl font-black tracking-tight text-foreground drop-shadow-sm">
              {leaderboardData.top10.length > 0 
                ? `${Math.max(...leaderboardData.top10.map((entry: any) => parseFloat(getCompletionPercentage(entry)))).toFixed(1)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="glass hover-glow shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        <Filters 
          lSearch={lSearch} 
          setLSearch={setLSearch}
          filters={filters}
          onFiltersChange={setFilters}
          userCity={studentData?.data?.city.city_name}
          userYear={studentData?.data?.batch.year}
        />
        
        <LeaderboardTable entries={leaderboardData.top10} filters={filters} />
      </div>
    </div>
  );
}
