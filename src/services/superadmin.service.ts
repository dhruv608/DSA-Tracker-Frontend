import api from '../lib/api';

export const getCurrentSuperAdmin = async () => {
  const response = await api.get('/api/superadmin/me');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/superadmin/stats');
  return response.data.data;
};
