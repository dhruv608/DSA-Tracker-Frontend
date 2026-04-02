"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { getAdminLeaderboard } from '@/services/admin.service';
import { Trophy, Clock } from 'lucide-react';
import PodiumShimmer from '@/components/leaderboard/shimmers/PodiumShimmer';
import TableShimmer from '@/components/leaderboard/shimmers/TableShimmer';
import { LeaderboardTable } from '@/components/leaderboard/components/LeaderboardTable';
import { FilterBar } from '@/components/leaderboard/components/FilterBar';
import { EvaluationModal } from '@/components/leaderboard/components/EvaluationModal';
import { TimerLeaderboard } from '@/components/leaderboard/components/TimerLeaderboard';
import PodiumSection from '@/components/leaderboard/components/PodiumSection';
import { handleToastError } from "@/utils/toast-system";

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

  const [lType, setLType] = useState('all');
  const [lCity, setLCity] = useState<string>('All Cities');
  const [lYear, setLYear] = useState<number>(new Date().getFullYear());

  // Leaderboard data state (shared across components)
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);


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
  const handleRefresh = async () => {
    if (!isInit) return;
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const body = {
        city: lCity === "All Cities" ? "all" : lCity,
        type: lType,
        year: lYear === 0 ? undefined : Number(lYear)
      };

      // Fetch all needed data in one call
      const query = {
        page,
        limit,
        search: debouncedSearch || undefined
      };

      const response = await getAdminLeaderboard(query, body);
      console.log("AdminLeaderboardPage - API Response (Refresh):", response);
      setLeaderboardData(response);
    } catch (err: any) {
      handleToastError(err);
      console.error('Failed to refresh leaderboard data:', err);
      setLeaderboardError(err.message || 'Failed to refresh leaderboard data');
      setLeaderboardData(null);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Shared leaderboard data fetching
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!isInit) return;

      setLeaderboardLoading(true);
      setLeaderboardError(null);

      try {
        const body = {
          city: lCity === "All Cities" ? "all" : lCity,
          type: lType,
          year: lYear === 0 ? undefined : Number(lYear)
        };

        // Fetch all needed data in one call
        const query = {
          page,
          limit,
          search: debouncedSearch || undefined
        };

        const response = await getAdminLeaderboard(query, body);

        // 🆕 Extract cities and years from the single API response
        if (response?.data) {
          setAllCities(response.data.available_cities || []);

          // Extract years from "All Cities" entry
          const allCitiesEntry = response.data.available_cities?.find((city: any) => city.city_name === "All Cities");
          setAllYears(allCitiesEntry?.available_years || []);

          // Build cityYearMap for compatibility with existing logic
          const map: Record<string, Set<number>> = {};
          response.data.available_cities?.forEach((city: any) => {
            if (city.city_name !== "All Cities") {
              map[city.city_name.toLowerCase()] = new Set(city.available_years);
            }
          });
          setCityYearMap(map);
        }

        setLeaderboardData(response);
      } catch (err: any) {
        handleToastError(err);
        console.error('Failed to fetch leaderboard data:', err);
        setLeaderboardError(err.message || 'Failed to fetch leaderboard data');
        setLeaderboardData(null);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [page, limit, lCity, lType, lYear, debouncedSearch, isInit]);


 

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
  }, [lCity, lYear, lType, page, limit, debouncedSearch, isInit]);

  // Global loading overlay if everything is refreshing Context
  if (isLoadingContext || !isInit) {
    return (
      <div className="flex flex-col space-y-6">
        <PodiumShimmer />
        <TableShimmer />
      </div>
    );
  }

  const cityOptionsObj = allCities.map(c => ({ label: c.city_name, value: c.city_name }));
  const yearOptionsObj = yearOptions.map((y: number) => ({ label: y.toString(), value: y.toString() }));
  const typeOptionsObj = [
    { label: 'All-Time', value: 'all' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Weekly', value: 'weekly' },
  ];

  // TimerLeaderboard will handle the countdown display

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
        <TimerLeaderboard
          lastUpdated={leaderboardData?.data?.last_calculated}
          refreshInterval={4}
          onRefresh={handleRefresh}
        />
      </div>

      <FilterBar
        lSearch={lSearch}
        setLSearch={setLSearch}
        lType={lType}
        setLType={setLType}
        typeOptionsObj={typeOptionsObj}
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
        top3={leaderboardData?.data?.leaderboard?.slice(0, 3) || []}
        loading={leaderboardLoading}
        error={leaderboardError}
        selectedCity={lCity === 'All Cities' ? 'all' : lCity}
      />


      <LeaderboardTable
        data={leaderboardData?.data}
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
