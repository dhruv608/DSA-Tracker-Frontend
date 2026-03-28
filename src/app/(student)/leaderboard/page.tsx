"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentLeaderboardService } from "@/services/student/leaderboard.service";
import { studentAuthService } from "@/services/student/auth.service";
import { EvaluationModal } from "@/components/leaderboard/components/EvaluationModal";
import { FilterBar } from "@/components/leaderboard/components/FilterBar";
import { StatsSection } from "@/components/leaderboard/components/StatsSection";
import { LeaderboardTable } from "@/components/leaderboard/components/LeaderboardTable";
import { TimerLeaderboard } from "@/components/leaderboard/components/TimerLeaderboard";
import { YourRank } from "@/components/leaderboard/components/YourRank";
import PodiumSection from "@/components/leaderboard/components/PodiumSection";

export default function StudentLeaderboardPage() {
  const [lType, setLType] = useState('all');
  const [lCity, setLCity] = useState('all');
  const [lYear, setLYear] = useState(2025);
  const [lSearch, setLSearch] = useState('');

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

  // Set default city and year based on logged-in student
  useEffect(() => {
    if (studentData) {
      const student = studentData;
      setLCity(student.city?.city_name || 'all');
      setLYear(student.batch?.year || 2025);
    }
  }, [studentData]);



  const { data: leaderboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['studentLeaderboard', lCity === 'all' ? 'all' : lCity, lYear, lType, lSearch],
    queryFn: async () => {
      return await studentLeaderboardService.getLeaderboard(
        {
          city: lCity === 'All Cities' ? 'all' : lCity,
          year: lYear,
          type: lType,
        },
        lSearch
      );
    },
    staleTime: 5 * 60 * 1000,

    // 🔥 ADD THESE
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });



  const data = leaderboardData?.data;
  const handleRefresh = useCallback(() => {
    console.log("REFETCH CALLED");
    refetch();
  }, [refetch]);

  return (
    <>

      <YourRank yourRank={data?.yourRank} />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  Student Leaderboard
                  <EvaluationModal />
                </h2>
              </div>
              <p className="text-muted-foreground text-sm bg-muted/50 inline-block px-3 py-1 rounded-2xl border border-border/50 w-fit">
                Top 10 Students {lCity !== 'all' ? `in ${lCity}` : 'Globally'} {lYear ? `- ${lYear}` : ''}
              </p>
            </div>
            <div className="flex justify-end">
              <TimerLeaderboard
                lastUpdated={data?.last_calculated}
              />
            </div>
          </div>
        </div>

        <FilterBar
          lSearch={lSearch}
          setLSearch={setLSearch}
          lType={lType}
          setLType={setLType}
          typeOptionsObj={[
            { value: 'all', label: 'All Time' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' }
          ]}
          lCity={lCity}
          setLCity={setLCity}
          cityOptionsObj={[
            ...(data?.available_cities?.map((city: any) => ({
              value: city.city_name,
              label: city.city_name
            })) || [])
          ]}
          setLYear={setLYear}
          lYear={lYear}
          yearOptionsObj={[
            { value: 'all', label: 'All Years' },
            ...(data?.available_cities?.[0]?.available_years?.map((year: number) => ({
              value: year.toString(),
              label: year.toString()
            })) || [])
          ]}
          allYears={data?.available_cities?.[0]?.available_years || []}
          mode="student"
        />

        <div className="flex flex-col space-y-6">
          <PodiumSection
            top3={data?.top10?.slice(0, 3) || []}
            loading={isLoading}
            error={error?.message}
          />

          <StatsSection
            leaderboard={data?.top10 || []}
            totalParticipants={data?.top10?.length || 0}
            loading={isLoading}
            error={error?.message}
          />


          <LeaderboardTable
            data={{ leaderboard: data?.top10 || [], total: data?.top10?.length || 0 }}
            loading={isLoading}
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