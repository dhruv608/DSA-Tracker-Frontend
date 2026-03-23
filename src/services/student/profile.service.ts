import api from '@/lib/api';

export const studentProfileService = {
  getProfile: async () => {
    const res = await api.get('/api/students/profile');
    return res.data;
  },
  
  updateProfileImage: async (file: File) => {
    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      const formData = new FormData();
      formData.append('file', file); // Backend middleware expects field name 'file'
      
      console.log('📤 Uploading profile photo to /api/students/profile-image...');
      
      const res = await api.post('/api/students/profile-image', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Profile photo updated successfully');
      return res.data;
    } catch (error: any) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  },

  deleteProfileImage: async () => {
    try {
      console.log('🗑️ Deleting profile photo...');
      
      const res = await api.delete('/api/students/profile-image', {
        withCredentials: true
      });
      
      console.log('✅ Profile photo deleted successfully');
      return res.data;
    } catch (error: any) {
      console.error('Profile image delete error:', error);
      throw error;
    }
  },

  updateProfileDetails: async (data: any) => {
    // Assuming a PUT /api/students/profile exists, or we might need to check backend
    const res = await api.put('/api/students/profile', data);
    return res.data;
  }
};
