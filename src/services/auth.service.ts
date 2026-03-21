import api from '../lib/api';

export const loginAdmin = async (data: { email: string; password: string }) => {
  const response = await api.post('/api/auth/admin/login', data);
  return response.data;
};
