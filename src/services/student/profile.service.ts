import api from '@/lib/api';
import { ProfileUpdateData } from '@/types/student';
import { handleError } from "@/utils/handleError";

export const studentProfileService = {
  getProfile: async () => {
    const res = await api.get('/api/students/profile');
    return res.data;
  },
  
  getProfileByUsername: async (username: string) => {
    try {
      const res = await api.get(`/api/students/profile/${username}`);
      return res.data;
    } catch (error: any) {
      handleError(error);
      console.error('Profile fetch error:', error);
      // If network error or server not available, throw a more descriptive error
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check if backend is running.');
      }
      throw error;
    }
  },
  
  updateProfileImage: async (file: File) => {
    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      const formData = new FormData();
      formData.append('file', file); // Backend middleware expects field name 'file'
      
      
      const res = await api.post('/api/students/profile-image', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return res.data;
    } catch (error: any) {
      handleError(error);
      throw error;
    }
  },

  deleteProfileImage: async () => {
    try {
      
      const res = await api.delete('/api/students/profile-image', {
        withCredentials: true
      });
      
      return res.data;
    } catch (error: any) {
      handleError(error);
      throw error;
    }
  },

  updateProfileDetails: async (data: ProfileUpdateData) => {
    // Use the new PUT /api/students/me endpoint for updating current student profile
    const res = await api.put('/api/students/me', data);    
    return res.data;
  }
};
