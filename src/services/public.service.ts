import { apiClient } from '@/api';
import { City } from '@/types/superadmin/city.types';
import { Batch } from '@/types/superadmin/batch.types';

/**
 * Get all cities - uses PUBLIC route (no auth required)
 * Perfect for dropdowns in modals
 */
export const getPublicCities = async (): Promise<City[]> => {
  const response = await apiClient.get('/api/cities');
  return response.data;
};

/**
 * Get all batches - uses PUBLIC route (no auth required)
 * Perfect for dropdowns in modals
 */
export const getPublicBatches = async (): Promise<Batch[]> => {
  const response = await apiClient.get('/api/batches');
  return response.data;
};
