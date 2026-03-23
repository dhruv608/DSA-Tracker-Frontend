import api from '@/lib/api';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}) => {
    try {
      // Backend expects filters in request body, not query params
      const res = await api.post('/api/students/leaderboard', filters);
      return res.data;
    } catch (error) {
      console.error('Leaderboard error:', error);
      throw error;
    }
  }
};
