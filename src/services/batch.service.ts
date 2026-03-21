import api from '../lib/api';
import { City } from './city.service';

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
  
  const response = await api.get('/api/superadmin/batches', { params });
  return response.data; // Backend returns array directly
};

export const createBatch = async (data: { batch_name: string; year: number; city_id: number }) => {
  const response = await api.post('/api/superadmin/batches', data);
  return response.data;
};

export const updateBatch = async (id: number, data: { batch_name?: string; year?: number; city_id?: number }) => {
  const response = await api.patch(`/api/superadmin/batches/${id}`, data);
  return response.data;
};

export const deleteBatch = async (id: number) => {
  const response = await api.delete(`/api/superadmin/batches/${id}`);
  return response.data;
};
