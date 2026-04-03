import api from '../lib/api';
import { City } from './city.service';
import { showSuccess, showDeleteSuccess } from '@/utils/toast-system';

export interface Batch {
  id: number;
  batch_name: string;
  year: number;
  city_id: number;
  city?: City;
   slug: string;
  _count?: {
    students: number;
    classes: number;
  };
  createdAt?: string;
  updatedAt?: string;
}


export const getAllBatches = async (city?: string, year?: number): Promise<Batch[]> => {
  const params: any = {};
  if (city) params.city = city;
  if (year) params.year = year;
  
  // Use public endpoint - accessible without admin authentication
  const response = await api.get('/api/batches', { params });
  return response.data;
};

export const createBatch = async (data: { batch_name: string; year: number; city_id: number }) => {
  const response = await api.post('/api/superadmin/batches', data);
  showSuccess('Batch Created');
  return response.data;
};

export const updateBatch = async (id: number, data: { batch_name?: string; year?: number; city_id?: number }) => {
  const response = await api.patch(`/api/superadmin/batches/${id}`, data);
  showSuccess('Batch Updated');
  return response.data;
};

export const deleteBatch = async (id: number) => {
  const response = await api.delete(`/api/superadmin/batches/${id}`);
  showDeleteSuccess('Batch');
  return response.data;
};
