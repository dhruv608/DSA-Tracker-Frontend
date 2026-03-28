import api from '@/lib/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { handleError, showSuccess } from "@/utils/handleError";

export const studentAuthService = {
  getCurrentStudent: async () => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    try {
      const response = await api.get('/api/students/me');
      return response.data;
    } catch (error) {
        handleError(error);
      throw error;
    }
  },

  login: async (credentials: any) => {
    try {
      const res = await api.post('/api/auth/student/login', credentials);
      showSuccess('LOGIN');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: any) => {
    try {
      const res = await api.post('/api/auth/student/register', data);
      showSuccess('REGISTER');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const res = await api.post('/api/auth/student/logout');
      showSuccess('LOGOUT');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  googleLogin: async (idToken: string) => {
    try {
      const res = await api.post('/api/auth/google-login', { idToken });
      showSuccess('LOGIN');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      showSuccess('EMAIL_SENT', 'Password reset email sent!');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (data: any) => {
    try {
      const res = await api.post('/api/auth/reset-password', data);
      showSuccess('PASSWORD_RESET');
      return res.data;
    } catch (error: any) {
      handleError(error);
      throw error;
    }
  }
};
