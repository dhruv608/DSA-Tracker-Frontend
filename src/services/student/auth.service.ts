import api from '@/lib/api';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { handleToastError, showSuccess } from '@/utils/toast-system';

export const studentAuthService = {
  getCurrentStudent: async () => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear invalid tokens
      const error = new Error('Access denied. Students only.');
      (error as any).response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const response = await api.get('/api/students/me');
    return response.data;
  },

  login: async (credentials: any) => {
    const res = await api.post('/api/auth/student/login', credentials);
    // Check if response is undefined (network error handled by interceptor)
    if (!res) {
      return undefined;
    }
    showSuccess('LOGIN');
    return res.data;
  },

  register: async (data: any) => {
    const res = await api.post('/api/auth/student/register', data);
    showSuccess('REGISTER');
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/api/auth/student/logout');
    showSuccess('LOGOUT');
    return res.data;
  },

  googleLogin: async (idToken: string) => {
    const res = await api.post('/api/auth/google-login', { idToken });
    showSuccess('LOGIN');
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post('/api/auth/forgot-password', { email });
    showSuccess('EMAIL_SENT', 'Password reset email sent!');
    return res.data;
  },

  resetPassword: async (data: any) => {
    const res = await api.post('/api/auth/reset-password', data);
    showSuccess('PASSWORD_RESET');
    return res.data;
  }
};
