import api from '@/lib/api';
import { handleToastError, showSuccess } from '@/utils/toast-system';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}, search?: string) => {
    const url = search 
      ? `/api/students/leaderboard?username=${encodeURIComponent(search)}` 
      : '/api/students/leaderboard';
      
    const res = await api.post(url, filters);
    return res.data;
  }
};
