import api from '@/lib/api';

export const studentProfileService = {
  getProfile: async () => {
    const res = await api.get('/api/students/profile');
    return res.data;
  },
  
  updateProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profile_image', file);
    const res = await api.post('/api/students/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  updateProfileDetails: async (data: any) => {
    // Assuming a PUT /api/students/profile exists, or we might need to check backend
    const res = await api.put('/api/students/profile', data);
    return res.data;
  }
};
