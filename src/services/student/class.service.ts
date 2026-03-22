import api from '@/lib/api';

export const studentClassService = {
  getClassDetails: async (topicSlug: string, classSlug: string) => {
    const res = await api.get(`/api/students/topics/${topicSlug}/classes/${classSlug}`);
    return res.data;
  }
};
