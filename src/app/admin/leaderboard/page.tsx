"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { Admin } from '@/types/common/api.types';
import { getAdminLeaderboard } from '@/services/admin.service';
import { LeaderboardTable } from '@/components/leaderboard/components/LeaderboardTable';
import { FilterBar } from '@/components/leaderboard/components/FilterBar';
import { EvaluationModal } from '@/components/leaderboard/components/EvaluationModal';
import { TimerLeaderboard } from '@/components/leaderboard/components/TimerLeaderboard';
import PodiumSection from '@/components/leaderboard/components/PodiumSection';
import { LeaderboardData, ApiError, BatchSelection } from '@/types/admin/index.types';

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
  
  const searchParams = useSearchParams();
  const { selectedCity, selectedBatch, isLoadingContext } = useAdminStore();
  const [isInit, setIsInit] = useState(false);
  
  const [allCities, setAllCities] = useState<Array<{ city_name: string, available_years: number[] }>>([]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [cityYearMap, setCityYearMap] = useState<Record<string, Set<number>>>({});
  // Query & Filters
  const [lSearch, setLSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(lSearch, 400);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 5);

  const [lCity, setLCity] = useState('All Cities');
  const [lYear, setLYear] = useState<number | undefined>(undefined);

  // Leaderboard data state (shared across components)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  
  // Refs for preventing double API calls
  const isFetchingLeaderboard = useRef(false);
  const lastFetchLeaderboardParams = useRef<{ city: string; year: number | undefined; page: number; limit: number; search: string }>({
    city: 'all',
    year: undefined,
    page: 1,
    limit: 5,
    search: ''
  });


  // 1. Initialize Default Filters
  useEffect(() => {
    if (!isLoadingContext && !isInit && selectedCity && selectedBatch) {
      const defaultCity = selectedCity.name;
      const batchYearRaw = (selectedBatch as BatchSelection).year;
      const defaultYear = batchYearRaw ? Number(batchYearRaw) : Number(selectedBatch.name?.match(/\d{4}/)?.[0] || 2024);
      setLCity(defaultCity);
      setLYear(defaultYear);
      setIsInit(true);
    }
  }, [isLoadingContext, selectedCity, selectedBatch, isInit]);



  // Step 3: Implement Superadmin dropdown logic (IF CITY = "All Cities" vs SPECIFIC CITY)
  const yearOptions = useMemo(() => {
    if (lCity === "All Cities" || !lCity) {
      return allYears.length > 0 ? allYears : [new Date().getFullYear()];
    }
    // Find the city in the new data structure
    const cityData = allCities.find(city => city.city_name === lCity);
    const cityYears = cityData ? cityData.available_years : [];
    return cityYears.length > 0 ? cityYears : [new Date().getFullYear()];
  }, [lCity, allCities, lYear]);

  // Manual refresh function
  const handleRefresh = async (force = false) => {
    if (!isInit) return;

    // Skip if already fetching
    if (isFetchingLeaderboard.current) {
      console.log("Already refreshing leaderboard, skipping duplicate call");
      return;
    }

    const city = lCity === "All Cities" ? "all" : lCity;
    const year = lYear === 0 ? undefined : Number(lYear);
    const search = debouncedSearch || '';

    // Check if same params were already used (skip if not forced)
    const currentParams: { city: string; year: number | undefined; page: number; limit: number; search: string } = { city, year, page, limit, search };
    const sameParams =
      lastFetchLeaderboardParams.current.city === city &&
      lastFetchLeaderboardParams.current.year === year &&
      lastFetchLeaderboardParams.current.page === page &&
      lastFetchLeaderboardParams.current.limit === limit &&
      lastFetchLeaderboardParams.current.search === search;

    if (!force && sameParams) {
      console.log("Same leaderboard params already fetched, skipping refresh");
      return;
    }

    isFetchingLeaderboard.current = true;
    lastFetchLeaderboardParams.current = currentParams;
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const body = {
        city,
        year
      };

      // Fetch all needed data in one call
      const query = {
        page,
        limit,
        search
      };

      const response = await getAdminLeaderboard(query, body);
      console.log("AdminLeaderboardPage - API Response (Refresh):", response);
      setLeaderboardData(response.data);
    } catch (err: unknown) {
      // Error is handled by API client interceptor
      console.error('Failed to refresh leaderboard data:', err);
      const error = err as ApiError;
      setLeaderboardError(error.message || 'Failed to refresh leaderboard data');
      setLeaderboardData(null);
    } finally {
      setLeaderboardLoading(false);
      isFetchingLeaderboard.current = false;
    }
  };

  // Shared leaderboard data fetching
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!isInit) return;

      // Skip if already fetching
      if (isFetchingLeaderboard.current) {
        console.log("Already fetching leaderboard data, skipping duplicate call");
        return;
      }

      const city = lCity === "All Cities" ? "all" : lCity;
      const year = lYear === 0 ? undefined : Number(lYear);
      const search = debouncedSearch || '';

      // Check if same params were already used
      const currentParams: { city: string; year: number | undefined; page: number; limit: number; search: string } = { city, year, page, limit, search };
      const sameParams = 
        lastFetchLeaderboardParams.current.city === city &&
        lastFetchLeaderboardParams.current.year === year &&
        lastFetchLeaderboardParams.current.page === page &&
        lastFetchLeaderboardParams.current.limit === limit &&
        lastFetchLeaderboardParams.current.search === search;

      if (sameParams) {
        console.log("Same leaderboard params already fetched, skipping");
        return;
      }

      isFetchingLeaderboard.current = true;
      lastFetchLeaderboardParams.current = currentParams;
      setLeaderboardLoading(true);
      setLeaderboardError(null);

      try {
        const body = {
          city,
          year
        };

        // Fetch all needed data in one call
        const query = {
          page,
          limit,
          search
        };

        const response = await getAdminLeaderboard(query, body);

        // Extract cities and years from the single API response
        if (response?.data) {
          setAllCities(response.data.available_cities || []);

          // Extract years from "All Cities" entry
          const allCitiesEntry = response.data.available_cities?.find((city: { city_name: string; available_years: number[] }) => city.city_name === "All Cities");
          setAllYears(allCitiesEntry?.available_years || []);

          // Build cityYearMap for compatibility with existing logic
          const map: Record<string, Set<number>> = {};
          response.data.available_cities?.forEach((city: { city_name: string; available_years: number[] }) => {
            if (city.city_name !== "All Cities") {
              map[city.city_name.toLowerCase()] = new Set(city.available_years);
            }
          });
          setCityYearMap(map);
        }

        setLeaderboardData(response.data);
      } catch (err: unknown) {
        // Error is handled by API client interceptor
        console.log('Failed to fetch leaderboard data:', err);
        const error = err as ApiError;
        setLeaderboardError(error.message || 'Failed to fetch leaderboard data');
        setLeaderboardData(null);
      } finally {
        setLeaderboardLoading(false);
        isFetchingLeaderboard.current = false;
      }
    };

    fetchLeaderboardData();
  }, [page, limit, lCity, lYear, debouncedSearch, isInit]);


 

  const updateUrl = useCallback(() => {
    if (!isInit) return;
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 5) params.set('limit', limit.toString());

    const newUrl = `/admin/leaderboard?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedSearch, page, limit, isInit]);
  useEffect(() => { updateUrl(); }, [updateUrl]);

  useEffect(() => {
    if (!isInit) return;
  }, [lCity, lYear, page, limit, debouncedSearch, isInit]);


  const cityOptionsObj = allCities.map(c => ({ label: c.city_name, value: c.city_name }));
  const yearOptionsObj = yearOptions.map((y: number) => ({ label: y.toString(), value: y.toString() }));

  // TimerLeaderboard will handle the countdown display

  return (
     <div className="flex flex-col mx-auto  w-full pb-12  -m-3">
      {/* header  */}
      <div className="glass backdrop-blur-2xl mb-5 px-6 py-4 rounded-2xl flex items-center justify-between">

        {/* LEFT */}
        <div className="flex flex-col gap-2">

          {/* TITLE ROW */}
          <div className="flex items-center gap-3 flex-wrap">

            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Admin <span className="text-primary">Leaderboard</span>
            </h2>

            {/* Modal aligned properly */}
            <div className="shrink-0">
              <EvaluationModal />
            </div>

          </div>

          {/* SUBTEXT */}
          <p className="text-muted-foreground text-sm  inline-flex items-center p-0 m-0 rounded-md w-fit">
            Analytics driven precisely by backend mapping constraints.
          </p>

        </div>

        {/* RIGHT */}
        <div className="shrink-0">
          <TimerLeaderboard
            lastUpdated={leaderboardData?.last_calculated}
            refreshInterval={4}
            onRefresh={() => handleRefresh(true)}
          />
        </div>

      </div>

       {/* Filter  */}
      <FilterBar
        lSearch={lSearch}
        setLSearch={setLSearch}
        lCity={lCity}
        setLCity={setLCity}
        cityOptionsObj={cityOptionsObj}
        lYear={lYear}
        setLYear={setLYear}
        yearOptionsObj={yearOptionsObj}
        allYears={allYears}
        mode="admin"
      />
      <PodiumSection
        top3={leaderboardData?.leaderboard?.slice(0, 3) || []}
        loading={leaderboardLoading}
        error={leaderboardError}
        selectedCity={lCity === 'All Cities' ? 'all' : lCity}
      />


      <LeaderboardTable
        data={leaderboardData}
        loading={leaderboardLoading}
        error={leaderboardError}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        // selectedCity={lCity}
        selectedCity={lCity === 'All Cities' ? 'all' : lCity}
      />
    </div>
  );
}
