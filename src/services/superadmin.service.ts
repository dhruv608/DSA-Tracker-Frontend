import { apiClient } from '@/api';
import { showSuccess } from '@/ui/toast';
import { isAdminToken, clearAuthTokens } from '../lib/auth-utils';
import { Admin, ApiError } from '@/types/common/api.types';
import { AdminCreateData, AdminUpdateData } from '@/types/superadmin/index.types';

export const getCurrentSuperAdmin = async () => {
  // Check if we have an admin token before making the request
  if (!isAdminToken()) {
    clearAuthTokens(); // Clear invalid tokens
    const error = new Error('Access denied. Admins only.');
    const apiError = error as ApiError;
    apiError.response = { status: 403, data: { error: 'Access denied. Admins only.' } };
    throw error;
  }

  const response = await apiClient.get('/api/superadmin/me');
  return response.data;
};

export const getStats = async () => {
  const response = await apiClient.get('/api/superadmin/stats');
  return response.data.data;
};

export const createAdmin = async (data: AdminCreateData) => {
  const response = await apiClient.post('/api/superadmin/admins', data);
  showSuccess('Admin Created');
  return response.data.data;
};

export const updateAdmin = async (id: number, data: AdminUpdateData) => {
  const response = await apiClient.patch(`/api/superadmin/admins/${id}`, data);
  showSuccess('Admin updated successfully');
  return response.data.data;
};

export const deleteAdmin = async (id: number) => {
  const response = await apiClient.delete(`/api/superadmin/admins/${id}`);
  showSuccess('Admin deleted successfully!');
  return response.data;
};

export const getAllAdmins = async (role?: string): Promise<Admin[]> => {
  // Check if we have an admin token before making the request
  if (!isAdminToken()) {
    clearAuthTokens(); // Clear invalid tokens
    const error = new Error('Access denied. Admins only.');
    const apiError = error as ApiError;
    apiError.response = { status: 403, data: { error: 'Access denied. Admins only.' } };
    throw error;
  }

  const params = role ? { role } : {};
  const response = await apiClient.get('/api/superadmin/admins', { params });
  return response.data.data; // Backend wraps in { success, data }
};