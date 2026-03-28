import api from '@/lib/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { handleError } from "@/utils/handleError";

export const studentTopicService = {
  getTopics: async () => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    try {
      const res = await api.get('/api/students/topics');
      return res.data || [];
    } catch (e: any) {
        handleError(e);
      if (e.response?.status === 400) {
        // Missing batchId in token. Return empty topics instead of crashing app.
        return [];
      }
      throw e;
    }
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
