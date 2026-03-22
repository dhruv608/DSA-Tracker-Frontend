import api from '../lib/api';

export const loginAdmin = async (data: { email: string; password: string }) => {
  const response = await api.post('/api/auth/admin/login', data);
  return response.data;
};

export const loginSuperAdmin = async (data: { email: string; password: string }) => {
  const response = await api.post('/api/auth/admin/login', data);
  return response.data;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};
