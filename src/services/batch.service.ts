import api from '../lib/api';
import { City } from './city.service';
import { showSuccess, showDeleteSuccess, handleError } from '@/utils/handleError';

export interface Batch {
  id: number;
  batch_name: string;
  year: number;
  city_id: number;
  city?: City;
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
  try {
    const response = await api.post('/api/superadmin/batches', data);
    showSuccess('BATCH_CREATED');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateBatch = async (id: number, data: { batch_name?: string; year?: number; city_id?: number }) => {
  try {
    const response = await api.patch(`/api/superadmin/batches/${id}`, data);
    showSuccess('BATCH_UPDATED');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteBatch = async (id: number) => {
  try {
    const response = await api.delete(`/api/superadmin/batches/${id}`);
    showDeleteSuccess('Batch');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
