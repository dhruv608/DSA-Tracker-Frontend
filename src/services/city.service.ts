import api from '../lib/api';
import { showSuccess, showDeleteSuccess } from '@/utils/toast-system';

export interface City {
  id: number;
  city_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllCities = async (search?: string): Promise<City[]> => {
  const params = search ? { search } : {};
  const response = await api.get('/api/cities', { params });
  return response.data; // Backend returns array directly
};

export const createCity = async (data: { city_name: string }) => {
  const response = await api.post('/api/superadmin/cities', data);
  showSuccess('City Created');
  return response.data;
};

export const updateCity = async (id: number, data: { city_name: string }) => {
  const response = await api.patch(`/api/superadmin/cities/${id}`, data);
  showSuccess('City Updated');
  return response.data;
};

export const deleteCity = async (id: number) => {
  const response = await api.delete(`/api/superadmin/cities/${id}`);
  showDeleteSuccess('City');
  return response.data;
};

