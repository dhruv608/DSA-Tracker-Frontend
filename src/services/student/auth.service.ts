import api from '@/lib/api';

export const studentAuthService = {
  getCurrentStudent: async () => {
    try {
      const response = await api.get('/api/students/me');
      console.log("Raw API response:", response);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  },

  login: async (credentials: any) => {
    const res = await api.post('/api/auth/student/login', credentials);
    return res.data;
  },

  register: async (data: any) => {
    const res = await api.post('/api/auth/student/register', data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/api/auth/student/logout');
    return res.data;
  },

  googleLogin: async (idToken: string) => {
    const res = await api.post('/api/auth/google-login', { idToken });
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post('/api/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: any) => {
    const res = await api.post('/api/auth/reset-password', data);
    return res.data;
  }
};
