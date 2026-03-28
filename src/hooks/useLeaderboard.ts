"use client";

import { useQuery } from '@tanstack/react-query';
import { studentLeaderboardService } from '@/services/student/leaderboard.service';
import { handleError } from "@/utils/handleError";

export interface LeaderboardEntry {
  student_id: number;
  name: string;
  username: string;
  profile_image_url: string | null;
  batch_year: number;
  city_name: string;
  max_streak: number;
  total_solved: number;
  score: number;
  global_rank: number;
  city_rank: number;
  last_calculated: string;
  isCurrentUser?: boolean;
}

export interface YourRankData {
  rank: number;
  student_id: number;
  name: string;
  username: string;
  profile_image_url: string | null;
  batch_year: number;
  city_name: string;
  max_streak: number;
  score: string;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_solved: string;
  total_assigned: number;
}

export interface LeaderboardData {
  success: boolean;
  top10: LeaderboardEntry[];
  yourRank: YourRankData | null;
  message: string | null;
  filters: {
    city: string;
    year: number;
    type: string;
  };
}

export interface LeaderboardFilters {
  city?: string;
  year?: number;
  type?: string;
}

interface UseLeaderboardOptions {
  filters?: LeaderboardFilters;
  search?: string;
  enabled?: boolean;
  initialData?: LeaderboardData;
}

export function useLeaderboard({ 
  filters = {}, 
  search, 
  enabled = true,
  initialData
}: UseLeaderboardOptions = {}) {
  console.log('🎣 useLeaderboard hook called with:', { 
    filters, 
    search, 
    enabled, 
    hasInitialData: !!initialData,
    initialDataLength: initialData?.top10?.length || 0
  });
  
  return useQuery({
    queryKey: ["leaderboard", filters, search],
    queryFn: async () => {
      console.log('🌐 Query function executing - fetching leaderboard data...');
      console.log('📡 Making API call with filters:', filters, 'search:', search);
      try {
        const result = await studentLeaderboardService.getLeaderboard(filters, search);
        console.log('📈 Query function SUCCESS - result:', {
          success: result?.success,
          top10Length: result?.top10?.length || 0,
          hasYourRank: !!result?.yourRank,
          firstStudent: result?.top10?.[0]?.name || 'NO_STUDENTS'
        });
        console.log('📊 Full API response:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        handleError(error);
        console.error('❌ Query function FAILED:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled,
    refetchOnWindowFocus: false,
    retry: 2,
    initialData,
  });
}
