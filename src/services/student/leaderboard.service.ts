import { apiClient } from '@/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { AuthError } from '@/types/student/auth.types';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}, search?: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    // Pass search in the filters body, not as URL query parameter
    const requestBody = {
      ...filters,
      username: search // Backend expects 'username' in request body
    };
    
    const res = await apiClient.post('/api/students/leaderboard', requestBody);
    return res.data;
  }
};
