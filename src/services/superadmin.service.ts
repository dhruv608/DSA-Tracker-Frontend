import { showDeleteSuccess, showSuccess } from '@/utils/toast-system';
import api from '../lib/api';
import { isAdminToken, clearAuthTokens } from '../lib/auth-utils';
import { Admin } from './admin.service';

export const getCurrentSuperAdmin = async () => {
  // Check if we have an admin token before making the request
  if (!isAdminToken()) {
    clearAuthTokens(); // Clear invalid tokens
    const error = new Error('Access denied. Admins only.');
    (error as any).response = { status: 403, data: { error: 'Access denied. Admins only.' } };
    throw error;
  }

  const response = await api.get('/api/superadmin/me');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/superadmin/stats');
  return response.data.data;
};


export const createAdmin = async (data: any) => {
  const response = await api.post('/api/superadmin/admins', data);
  showSuccess('Admin Created');
  return response.data.data;
};



export const updateAdmin = async (id: number, data: any) => {
  const response = await api.patch(`/api/superadmin/admins/${id}`, data);
  showSuccess('Admin Updated');
  return response.data.data;
};



export const deleteAdmin = async (id: number) => {
  const response = await api.delete(`/api/superadmin/admins/${id}`);
  showDeleteSuccess('Admin');
  return response.data;
};


export const getAllAdmins = async (role?: string): Promise<Admin[]> => {
  // Check if we have an admin token before making the request
  if (!isAdminToken()) {
    clearAuthTokens(); // Clear invalid tokens
    const error = new Error('Access denied. Admins only.');
    (error as any).response = { status: 403, data: { error: 'Access denied. Admins only.' } };
    throw error;
  }

  const params = role ? { role } : {};
  const response = await api.get('/api/superadmin/admins', { params });
  return response.data.data; // Backend wraps in { success, data }
};