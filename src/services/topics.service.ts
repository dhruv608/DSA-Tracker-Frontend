import api from '@/lib/api';

export interface Topic {
  id: number;
  topic_name: string;
  slug: string;
}

export interface TopicsResponse {
  topics: Topic[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TopicsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const topicsService = {
  getPaginatedTopics: async (params: TopicsParams = {}): Promise<TopicsResponse> => {
    const { page = 1, limit = 6, search = '' } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (search) {
      queryParams.append('search', search);
    }

    const response = await api.get(`/api/topics?${queryParams.toString()}`);
    return response.data;
  }
};
