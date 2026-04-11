import { apiClient } from '@/api';
import { showSuccess } from '@/ui/toast';
import { Bookmark, BookmarksResponse, BookmarkRequest } from '@/types/student/index.types';

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

    const res = await apiClient.get(`/api/students/bookmarks?${queryParams.toString()}`);
    return res.data.data;
  },

  // Add new bookmark
  addBookmark: async (data: BookmarkRequest): Promise<{ id: number; question_id: number; description: string | null; created_at: string }> => {
    const res = await apiClient.post('/api/students/bookmarks', data);
    showSuccess('Bookmark added successfully!');
    return res.data.data;
  },

  // Update bookmark description
  updateBookmark: async (questionId: number, description: string): Promise<{ id: number; question_id: number; description: string; created_at: string; updated_at: string }> => {
    const res = await apiClient.put(`/api/students/bookmarks/${questionId}`, { description });
    showSuccess('Bookmark updated successfully!');
    return res.data.data;
  },

  // Delete bookmark
  deleteBookmark: async (questionId: number): Promise<void> => {
    await apiClient.delete(`/api/students/bookmarks/${questionId}`);
    showSuccess('Bookmark removed successfully!');
  }
};
