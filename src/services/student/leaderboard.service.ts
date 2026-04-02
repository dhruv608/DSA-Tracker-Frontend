import api from '@/lib/api';
import { handleToastError, showSuccess } from '@/utils/toast-system';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}, search?: string) => {
    // Pass search in the filters body, not as URL query parameter
    const requestBody = {
      ...filters,
      username: search // Backend expects 'username' in request body
    };
    
    const res = await api.post('/api/students/leaderboard', requestBody);
    return res.data;
  }
};
