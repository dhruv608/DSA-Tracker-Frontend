import { apiClient } from '@/api';
import { City } from './city.service';
import { showSuccess } from '@/ui/toast';
import { Batch, BatchQueryParams } from '@/types/superadmin/index.types';

export type { Batch, BatchQueryParams };


export const getAllBatches = async (city?: string, year?: number): Promise<Batch[]> => {
  const params: BatchQueryParams = {};
  if (city) params.city = city;
  if (year) params.year = year;
  
  // Use public endpoint - accessible without admin authentication
  const response = await apiClient.get('/api/batches', { params });
  return response.data;
};

export const createBatch = async (data: { batch_name: string; year: number; city_id: number }) => {
  const response = await apiClient.post('/api/superadmin/batches', data);
  showSuccess('Batch created successfully!');
  return response.data;
};

export const updateBatch = async (id: number, data: { batch_name?: string; year?: number; city_id?: number }) => {
  const response = await apiClient.patch(`/api/superadmin/batches/${id}`, data);
  showSuccess('Batch updated successfully!');
  return response.data;
};

export const deleteBatch = async (id: number) => {
  const response = await apiClient.delete(`/api/superadmin/batches/${id}`);
  showSuccess('Batch deleted successfully!');
  return response.data;
};
