import { apiClient } from '@/api';
import { showSuccess } from '@/ui/toast';
import { City as CityType } from '@/types/superadmin/index.types';

// Re-export for backward compatibility with component imports
export type City = CityType;

export const getAllCities = async (search?: string): Promise<City[]> => {
  const params = search ? { search } : {};
  const response = await apiClient.get('/api/cities', { params });
  return response.data; // Backend returns array directly
};

export const createCity = async (data: { city_name: string }) => {
  const response = await apiClient.post('/api/superadmin/cities', data);
  showSuccess('City created successfully');
  return response.data;
};

export const updateCity = async (id: number, data: { city_name: string }) => {
  const response = await apiClient.patch(`/api/superadmin/cities/${id}`, data);
  showSuccess('City updated successfully');
  return response.data;
};

export const deleteCity = async (id: number) => {
  const response = await apiClient.delete(`/api/superadmin/cities/${id}`);
  showSuccess('City deleted successfully!');
  return response.data;
};

