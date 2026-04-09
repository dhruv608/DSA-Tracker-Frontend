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

  const [lCity, setLCity] = useState('All Cities');
  const [lYear, setLYear] = useState<number | null>(null);

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
            lastUpdated={leaderboardData?.data?.last_calculated}
            refreshInterval={4}
            onRefresh={handleRefresh}
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
