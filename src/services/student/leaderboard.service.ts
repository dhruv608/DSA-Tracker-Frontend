import api from '@/lib/api';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}) => {
    // Determine the query endpoint structure. Example uses query params or body:
    // Here we pass 'type' as query string if backend expects, and city/year in body
    const queryStr = filters.type ? `?type=${filters.type}` : '';
    const res = await api.post(`/api/students/leaderboard${queryStr}`, filters);
    return res.data;
  }
};
