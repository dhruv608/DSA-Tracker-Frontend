import api from '../lib/api';

export const getStats = async () => {
  const response = await api.get('/api/superadmin/stats');
  return response.data.data;
};
