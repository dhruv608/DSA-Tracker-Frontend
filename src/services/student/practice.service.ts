import api from '@/lib/api';
import { handleToastError, showSuccess } from '@/utils/toast-system';

export interface PracticeFilters {
  search?: string;
  topic?: string;
  level?: string;
  platform?: string;
  type?: string;
  solved?: string;
  page?: number;
  limit?: number;
}

export const studentPracticeService = {
  getQuestions: async (filters: PracticeFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.topic) params.append('topic', filters.topic);
    if (filters.level) params.append('level', filters.level);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.type) params.append('type', filters.type);
    if (filters.solved) params.append('solved', filters.solved);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const res = await api.get(`/api/students/addedQuestions?${params.toString()}`);
    return res.data; // expects { questions: [...], totalPages: N }
  }
};
