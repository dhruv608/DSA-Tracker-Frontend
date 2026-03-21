import api from '../lib/api';
import { Batch } from './batch.service';

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN';
  batch_id?: number;
  batch?: Batch;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllAdmins = async (role?: string): Promise<Admin[]> => {
  const params = role ? { role } : {};
  const response = await api.get('/api/superadmin/admins', { params });
  return response.data.data; // Backend wraps in { success, data }
};

export const createAdmin = async (data: any) => {
  const response = await api.post('/api/superadmin/admins', data);
  return response.data.data;
};

export const updateAdmin = async (id: number, data: any) => {
  const response = await api.patch(`/api/superadmin/admins/${id}`, data);
  return response.data.data;
};

export const deleteAdmin = async (id: number) => {
  const response = await api.delete(`/api/superadmin/admins/${id}`);
  return response.data;
};
