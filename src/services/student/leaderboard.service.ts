import api from '@/lib/api';
import { handleError } from "@/utils/handleError";

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}, search?: string) => {
    try {
      const url = search 
        ? `/api/students/leaderboard?username=${encodeURIComponent(search)}` 
        : '/api/students/leaderboard';
      
      const res = await api.post(url, filters);
      return res.data;
    } catch (error: any) {
        handleError(error);
      // Handle silent errors (like token refresh failures) without throwing
      if (error?.silent) {
        // Return empty leaderboard data for silent failures
        return {
          success: false,
          top10: [],
          yourRank: null,
          message: "Unable to load leaderboard",
          filters: {
            city: filters?.city || "all",
            year: filters?.year || new Date().getFullYear(),
            type: filters?.type || "all"
          }
        };
      }
      throw error;
    }
  }
};
