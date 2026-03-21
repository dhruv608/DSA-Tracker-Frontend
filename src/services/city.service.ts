import api from '../lib/api';

export interface City {
  id: number;
  city_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllCities = async (search?: string): Promise<City[]> => {
  const params = search ? { search } : {};
  const response = await api.get('/api/superadmin/cities', { params });
  return response.data; // Backend returns array directly
};

export const createCity = async (data: { city_name: string }) => {
  const response = await api.post('/api/superadmin/cities', data);
  return response.data;
};

export const updateCity = async (id: number, data: { city_name: string }) => {
  const response = await api.patch(`/api/superadmin/cities/${id}`, data);
  return response.data;
};

export const deleteCity = async (id: number) => {
  const response = await api.delete(`/api/superadmin/cities/${id}`);
  return response.data;
};
