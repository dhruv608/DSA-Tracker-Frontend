import { apiClient } from '@/api';
import { showSuccess } from '@/ui/toast';

export const loginAdmin = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/admin/login', data);
  // Check if response is undefined (network error handled by interceptor)
  if (!response) {
    return undefined;
  }
  showSuccess('Welcome to Admin Portal');
  return response.data;
};

export const loginSuperAdmin = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/admin/login', data);
  // Check if response is undefined (network error handled by interceptor)
  if (!response) {
    return undefined;
  }
  showSuccess('Welcome to SuperAdmin Portal');
  return response.data;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
  showSuccess('Logged out successfully.');
};
