import api from '../lib/api';
import { showSuccess, showDeleteSuccess, handleError } from '@/utils/handleError';

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
  try {
    const response = await api.post('/api/superadmin/cities', data);
    showSuccess('CITY_CREATED');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateCity = async (id: number, data: { city_name: string }) => {
  try {
    const response = await api.patch(`/api/superadmin/cities/${id}`, data);
    showSuccess('CITY_UPDATED');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteCity = async (id: number) => {
  try {
    const response = await api.delete(`/api/superadmin/cities/${id}`);
    showDeleteSuccess('City');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
