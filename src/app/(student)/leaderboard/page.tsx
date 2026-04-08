"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentLeaderboardService } from "@/services/student/leaderboard.service";
import { studentAuthService } from "@/services/student/auth.service";
import { EvaluationModal } from "@/components/leaderboard/components/EvaluationModal";
import { FilterBar } from "@/components/leaderboard/components/FilterBar";
import { LeaderboardTable } from "@/components/leaderboard/components/LeaderboardTable";
import { TimerLeaderboard } from "@/components/leaderboard/components/TimerLeaderboard";
import { YourRank } from "@/components/leaderboard/components/YourRank";
import { isStudentToken, clearAuthTokens } from "@/lib/auth-utils";
import PodiumSection from "@/components/leaderboard/components/PodiumSection";

export default function StudentLeaderboardPage() {
  const [lCity, setLCity] = useState('All Cities');
  const [lYear, setLYear] = useState<number | null>(null);
  const [lSearch, setLSearch] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Get current student data to set default city and year
  const { data: studentData } = useQuery({
    queryKey: ['currentStudent'],
    queryFn: async () => {
      const response = await studentAuthService.getCurrentStudent();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false
  });

  // Extract available years from API response
  const { data: leaderboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['studentLeaderboard', lCity === 'all' ? 'all' : lCity, lYear, lSearch],
    queryFn: async () => {
      // Check if we have a student token before making the request
      if (!isStudentToken()) {
        clearAuthTokens(); // Clear invalid tokens
        const error = new Error('Access denied. Students only.');
        (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
        throw error;
      }

      // Don't make request if we don't have a valid year yet
      if (!lYear) {
        return null;
      }

      const filters = {
        city: lCity === 'All Cities' ? 'all' : lCity,
        year: lYear,
      };

      return await studentLeaderboardService.getLeaderboard(filters, lSearch);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!lYear, // Only run query when we have a valid year

    // 🔥 ADD THESE
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Compute year options similar to admin leaderboard
  const yearOptions = leaderboardData?.data?.available_cities ? (() => {
    if (lCity === 'all' || lCity === 'All Cities') {
      // Extract years from "All Cities" entry
      const allCitiesEntry = leaderboardData.data.available_cities.find((city: any) => city.city_name === "All Cities");
      return allCitiesEntry?.available_years || [];
    } else {
      // Find specific city and return its years
      const cityData = leaderboardData.data.available_cities.find((city: any) => city.city_name === lCity);
      return cityData?.available_years || [];
    }
  })() : [];

  // Set default city and year based on logged-in student
  useEffect(() => {
    if (studentData) {
      const student = studentData;
      const batchYear = student.batch?.year;
      setLCity(student.city?.city_name || 'all');
      setLYear(batchYear || null); // Use null instead of hardcoded fallback
      setIsInitialLoading(false); // Stop initial loading once year is set
    }
  }, [studentData]);

  // Reset year when city changes (similar to admin)
  useEffect(() => {
    if (yearOptions.length > 0 && !yearOptions.includes(lYear)) {
      setLYear(yearOptions[0]);
    }
  }, [lCity, yearOptions, lYear]);

  const data = leaderboardData?.data;
  const combinedLoading = isLoading || isInitialLoading;
  const handleRefresh = useCallback(() => {
    console.log("REFETCH CALLED");
    refetch();
  }, [refetch]);

  return (
    <>

      <YourRank yourRank={data?.yourRank} />
      <div className="max-w-325 xl:max-w-275 2xl:max-w-325  mx-auto px-8 py-2">

        <div className=" glass backdrop-blur-sm  rounded-2xl px-5 py-4 mb-6">
          <div className="flex items-center justify-between">

            {/* Left */}
            <div className="flex flex-col gap-1">

              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />

                <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                  Student 
                  <span className=" ms-2 text-primary">
                    Leaderboard
                  </span>
                </h2>

                <EvaluationModal />
              </div>
              <p className="text-xs text-muted-foreground bg-muted/40 px-2.5 py-0.5 
                    rounded-full border border-border/40 w-fit">
                Top 10 Students {lCity !== 'all' ? `in ${lCity}` : 'Globally'} {lYear ? `- ${lYear}` : ''}
              </p>

            </div>

            {/* Right */}
            <div className="flex items-center">
              <TimerLeaderboard lastUpdated={data?.last_calculated} />
            </div>

          </div>
        </div>


        <FilterBar
          lSearch={lSearch}
          setLSearch={setLSearch}
          lCity={lCity}
          setLCity={setLCity}
          cityOptionsObj={[
            ...(isLoading ? [
              { value: 'loading', label: 'Loading...' }
            ] : []),
            ...(data?.available_cities?.map((city: any) => ({
              value: city.city_name,
              label: city.city_name
            })) || [])
          ]}
          setLYear={setLYear}
          lYear={lYear}
          yearOptionsObj={[
            ...(isLoading ? [] : yearOptions.map((y: number) => ({
              value: y.toString(),
              label: y.toString()
            })))
          ]}
          allYears={isLoading ? [] : yearOptions}
          isLoading={combinedLoading}
          mode="student"
        />
        <PodiumSection
          top3={data?.top10?.slice(0, 3) || []}
          loading={combinedLoading}
          error={error?.message}
          selectedCity={lCity === 'All Cities' ? 'all' : lCity}
        />
        <div className="flex flex-col space-y-6">

          <LeaderboardTable
            data={{ leaderboard: data?.top10 || [], total: data?.top10?.length || 0 }}
            loading={combinedLoading}
            error={error?.message}
            selectedCity={lCity === 'All Cities' ? 'all' : lCity}
            page={1}
            limit={10}
            setPage={() => { }}
            setLimit={() => { }}
            mode="student"
          />
        </div>
      </div>
    </>
  );
}