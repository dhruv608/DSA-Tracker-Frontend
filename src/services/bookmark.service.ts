import api from '@/lib/api';
import { handleToastError, showSuccess } from '@/utils/toast-system';

export interface Bookmark {
  id: number;
  question: {
    id: number;
    question_name: string;
    question_link: string;
    platform: string;
    level: string;
    type: string;
  };
  description: string | null;
  created_at: string;
  isSolved: boolean;
}

export interface BookmarksResponse {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BookmarkRequest {
  question_id: number;
  description?: string;
}

export const bookmarkService = {
  // Get all bookmarks with pagination and filtering
  getBookmarks: async (params: {
    page?: number;
    limit?: number;
    sort?: 'recent' | 'old' | 'solved' | 'unsolved';
    filter?: 'all' | 'solved' | 'unsolved';
  } = {}): Promise<BookmarksResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.filter) queryParams.append('filter', params.filter);

    const res = await api.get(`/api/students/bookmarks?${queryParams.toString()}`);
    return res.data.data;
  },

  // Add new bookmark
  addBookmark: async (data: BookmarkRequest): Promise<{ id: number; question_id: number; description: string | null; created_at: string }> => {
    try {
      const res = await api.post('/api/students/bookmarks', data);
      showSuccess('Bookmark added successfully!');
      return res.data.data;
    } catch (error) {
      handleToastError(error);
      throw error;
    }
  },

  // Update bookmark description
  updateBookmark: async (questionId: number, description: string): Promise<{ id: number; question_id: number; description: string; created_at: string; updated_at: string }> => {
    try {
      const res = await api.put(`/api/students/bookmarks/${questionId}`, { description });
      showSuccess('Bookmark updated successfully!');
      return res.data.data;
    } catch (error) {
      handleToastError(error);
      throw error;
    }
  },

  // Delete bookmark
  deleteBookmark: async (questionId: number): Promise<void> => {
    try {
      await api.delete(`/api/students/bookmarks/${questionId}`);
      showSuccess('Bookmark removed successfully!');
    } catch (error) {
      handleToastError(error);
      throw error;
    }
  }
};
