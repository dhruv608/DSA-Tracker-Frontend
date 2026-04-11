import { apiClient } from '@/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { AuthError } from '@/types/student/auth.types';

export const studentClassService = {
  getClassDetails: async (topicSlug: string, classSlug: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const res = await apiClient.get(`/api/students/topics/${topicSlug}/classes/${classSlug}`);
    return res.data;
  },

  getClassDetailsWithPagination: async (topicSlug: string, classSlug: string, queryParams: string) => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const res = await apiClient.get(`/api/students/topics/${topicSlug}/classes/${classSlug}?${queryParams}`);
    return res.data;
  }
};
