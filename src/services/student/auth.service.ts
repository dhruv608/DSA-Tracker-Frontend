import { apiClient } from '@/api';
import { isStudentToken } from '@/lib/auth-utils';
import { showSuccess } from '@/ui/toast';
import { StudentLoginCredentials, StudentRegisterData, ResetPasswordData } from '@/types/student/index.types';
import { AuthError } from '@/types/student/auth.types';

export const studentAuthService = {
  getCurrentStudent: async () => {
    // Check if we have a student token before making the request
    if (!isStudentToken()) {
      // Don't clear tokens - they may be valid admin tokens, just not student tokens
      const error = new Error('Access denied. Students only.');
      const authError = error as AuthError;
      authError.response = { status: 403, data: { error: 'Access denied. Students only.' } };
      throw error;
    }

    const response = await apiClient.get('/api/students/me');
    return response.data;
  },

  login: async (credentials: StudentLoginCredentials) => {
    const res = await apiClient.post('/api/auth/student/login', credentials);
    // Check if response is undefined (network error handled by interceptor)
    if (!res) {
      return undefined;
    }
    showSuccess('Let’s get started');
    return res.data;
  },

  register: async (data: StudentRegisterData) => {
    const res = await apiClient.post('/api/auth/student/register', data);
    showSuccess('Register');
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post('/api/auth/student/logout');
    return res.data;
  },

  googleLogin: async (idToken: string) => {
    const res = await apiClient.post('/api/auth/google-login', { idToken });
    showSuccess('Let’s get started');
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/api/auth/forgot-password', { email });
    showSuccess('Password reset email sent!');
    return res.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const res = await apiClient.post('/api/auth/reset-password', data);
    return res.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await apiClient.post('/api/auth/verify-otp', { email, otp });
    return res.data;
  }
};
