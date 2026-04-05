import api from '@/lib/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { handleToastError, showSuccess } from '@/utils/toast-system';

export const studentTopicService = {
  getTopics: async (params?: { page?: number; limit?: number; search?: string }) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = queryString ? `/api/students/topics?${queryString}` : '/api/students/topics';

    const res = await api.get(url);
    return res.data;
  },
  
  getTopicOverview: async (topicSlug: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const res = await api.get(`/api/students/topics/${topicSlug}`);
    return res.data;
  },

  getTopicOverviewWithPagination: async (topicSlug: string, queryParams: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const res = await api.get(`/api/students/topics/${topicSlug}?${queryParams}`);
    return res.data;
  }
};
