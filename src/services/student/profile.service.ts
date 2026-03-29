import api from '@/lib/api';
import { ProfileUpdateData } from '@/types/student';
import { handleToastError, showSuccess, showDeleteSuccess } from '@/utils/toast-system';

export const studentProfileService = {
  getProfile: async () => {
    const res = await api.get('/api/students/profile');
    return res.data;
  },
  
  getProfileByUsername: async (username: string) => {
    const res = await api.get(`/api/students/profile/${username}`);
    return res.data;
  },
  
  updateProfileImage: async (file: File) => {
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
  },

  deleteProfileImage: async () => {
    const res = await api.delete('/api/students/profile-image', {
      withCredentials: true
    });
    
    return res.data;
  },

  updateProfileDetails: async (data: ProfileUpdateData) => {
    // Use the new PUT /api/students/me endpoint for updating current student profile
    const res = await api.put('/api/students/me', data);    
    return res.data;
  }
};
