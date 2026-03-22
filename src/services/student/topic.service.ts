import api from '@/lib/api';

export const studentTopicService = {
  getTopics: async () => {
    try {
      const res = await api.get('/api/students/topics');
      return res.data || [];
    } catch (e: any) {
      if (e.response?.status === 400) {
        // Missing batchId in token. Return empty topics instead of crashing app.
        return [];
      }
      throw e;
    }
  },
  
  getTopicOverview: async (topicSlug: string) => {
    const res = await api.get(`/api/students/topics/${topicSlug}`);
    return res.data;
  }
};
