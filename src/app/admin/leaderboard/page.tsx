"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import {  getAdminCities } from '@/services/admin.service';
import { getAllBatches } from '@/services/batch.service';
import { Trophy, Clock } from 'lucide-react';
import PodiumShimmer from '@/components/shimmers/PodiumShimmer';
import StatsShimmer from '@/components/shimmers/StatsShimmer';
import TableShimmer from '@/components/shimmers/TableShimmer';
import { PodiumSection } from './components/PodiumSection';
import { StatsSection } from './components/StatsSection';
import { LeaderboardTable } from './components/LeaderboardTable';
import { FilterBar } from './components/FilterBar';
import { EvaluationModal } from './components/EvaluationModal';

// Hook for Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminLeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity, selectedBatch, isLoadingContext } = useAdminStore();
  const [isInit, setIsInit] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [allCities, setAllCities] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [cityYearMap, setCityYearMap] = useState<Record<string, Set<number>>>({});
  // Query & Filters
  const [lSearch, setLSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(lSearch, 400);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 5);

  const [lType, setLType] = useState('all');
  const [lCity, setLCity] = useState<string>('all');
  const [lYear, setLYear] = useState<number>(0);
  // 1. Initialize Default Filters
  useEffect(() => {
    if (!isLoadingContext && !isInit && selectedCity && selectedBatch) {
      const defaultCity = selectedCity.name;
      const batchYearRaw = (selectedBatch as any).year;
      const defaultYear = batchYearRaw ? Number(batchYearRaw) : Number(selectedBatch.name?.match(/\d{4}/)?.[0] || 2024);
      setLCity(defaultCity);
      setLYear(defaultYear);
      setLType('all');
      setIsInit(true);
    }
  }, [isLoadingContext, selectedCity, selectedBatch, isInit]);

  useEffect(() => {
    getAdminCities().then(res => {
      const cities = res.map((c: any) => c.city_name);
      setAllCities(cities);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    getAllBatches().then(res => {
      // Step 3 & 5: Build City -> Year Map and derive options from original data
      const map: Record<string, Set<number>> = {};
      const globalYears = new Set<number>();

      res.forEach((item: any) => {
        const city = item.city?.city_name?.toLowerCase();
        const year = item.year || item.batch_year;

        if (city && year) {
          if (!map[city]) {
            map[city] = new Set();
          }
          map[city].add(Number(year));
        }
        if (year) {
          globalYears.add(Number(year));
        }
      });

      setCityYearMap(map);
      setAllYears(Array.from(globalYears).sort((a, b) => b - a));
    }).catch(console.error);
  }, []);

  // Step 3: Implement Superadmin dropdown logic (IF CITY = "all" vs SPECIFIC CITY)
  const yearOptions = useMemo(() => {
    if (lCity === "all" || !lCity) {
      return allYears;
    }
    const cityKey = lCity.toLowerCase();
    const cityYears = cityYearMap[cityKey] ? Array.from(cityYearMap[cityKey]).sort((a, b) => b - a) : [];
    return cityYears;
  }, [lCity, allYears, cityYearMap]);

  // Step 4: Reset year on city change (handled deterministically now to avoid useEffect loops)
  const handleCityChange = useCallback((newCity: string) => {
    setLCity(newCity);

    // Preview the next yearOptions instantly
    const cityKey = newCity.toLowerCase();
    const cityYears = cityYearMap[cityKey] ? Array.from(cityYearMap[cityKey]).sort((a, b) => b - a) : [];
    const nextYearOptions = (newCity === "all" || !newCity) ? allYears : cityYears;

    // Reset year immediately if current year isn't valid for the new city
    if (nextYearOptions.length > 0 && !nextYearOptions.includes(lYear)) {
      setLYear(nextYearOptions[0]);
    } else if (nextYearOptions.length === 0) {
      setLYear(0); // Explicit fallback if the city truly has no batches
    }
  }, [allYears, cityYearMap, lYear]);

  const updateUrl = useCallback(() => {
  if (!isInit) return;
  const params = new URLSearchParams();
  if (debouncedSearch) params.set('search', debouncedSearch);
  if (page > 1) params.set('page', page.toString());
  if (limit !== 5) params.set('limit', limit.toString());
  
  // Use window.history instead of router.replace to avoid scroll to top
  const newUrl = `/admin/leaderboard?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}, [debouncedSearch, page, limit, isInit]);
  useEffect(() => { updateUrl(); }, [updateUrl]);

  // Step 1: Fix API trigger on filter change
  // Note: Components now handle their own fetching so we don't fetch globally.
  // We just ensure filters flow properly down to children.
  useEffect(() => {
    if (!isInit) return;

    // Step 7: Debugging
    console.log("Filters:", { lCity, lYear, lType });
    console.log("Request Body:", { city: lCity, year: lYear === 0 ? undefined : Number(lYear), type: lType });
  }, [lCity, lYear, lType, page, limit, debouncedSearch, isInit]);

  // Global loading overlay if everything is refreshing Context
  if (isLoadingContext || !isInit) {
    return (
      <div className="flex flex-col space-y-6">
        <PodiumShimmer />
        <StatsShimmer />
        <TableShimmer />
      </div>
    );
  }

  const cityOptionsObj = [{ label: 'All Cities', value: 'all' }, ...allCities.map(c => ({ label: c, value: c }))];
  const yearOptionsObj = yearOptions.map((y: number) => ({ label: y.toString(), value: y.toString() }));
  const typeOptionsObj = [
    { label: 'All-Time', value: 'all' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Weekly', value: 'weekly' },
  ];

  // Stats and Last Updated are now managed by StatsSection and children.
  // We can just omit global last updated or fetch it inside Stats.
  const lastUpdatedFormat = 'Live';

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              Admin Leaderboard
            </h2>
            <EvaluationModal />
          </div>
          <p className="text-muted-foreground text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border w-fit">
            Analytics driven precisely by backend mapping constraints.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 border border-border rounded-full shadow-sm">
          <Clock className="w-3.5 h-3.5" /> Last Updated: {lastUpdatedFormat}
        </div>
      </div>

      <PodiumSection
        lType={lType}
        lCity={lCity}
        lYear={lYear}
        debouncedSearch={debouncedSearch}
      />

      <StatsSection
        lType={lType}
        lCity={lCity}
        lYear={lYear}
        debouncedSearch={debouncedSearch}
      />

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        <FilterBar
          lSearch={lSearch} setLSearch={setLSearch}
          lType={lType} setLType={setLType} typeOptionsObj={typeOptionsObj}
          lCity={lCity} setLCity={handleCityChange} cityOptionsObj={cityOptionsObj} setLYear={setLYear}
          lYear={lYear} yearOptionsObj={yearOptionsObj} allYears={allYears}
        />

        <LeaderboardTable
          lCity={lCity}
          lType={lType}
          lYear={lYear}
          debouncedSearch={debouncedSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
