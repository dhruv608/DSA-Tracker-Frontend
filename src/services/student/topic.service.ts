import { apiClient } from '@/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { AuthError } from '@/types/student/auth.types';

export const studentTopicService = {
  getTopics: async (params?: { page?: number; limit?: number; search?: string; sortBy?: string }) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const queryString = queryParams.toString();
    const url = queryString ? `/api/students/topics?${queryString}` : '/api/students/topics';

    const res = await apiClient.get(url);
    return res.data;
  },
  
  getTopicOverview: async (topicSlug: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const res = await apiClient.get(`/api/students/topics/${topicSlug}`);
    return res.data;
  },

  getTopicOverviewWithPagination: async (topicSlug: string, queryParams: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const res = await apiClient.get(`/api/students/topics/${topicSlug}?${queryParams}`);
    return res.data;
  }
};
