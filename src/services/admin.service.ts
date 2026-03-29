import api from '../lib/api';
import { isAdminToken, clearAuthTokens } from '../lib/auth-utils';
import { Batch } from './batch.service';
import { handleToastError, showSuccess, showDeleteSuccess } from '@/utils/toast-system';

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'INTERN';
  batch_id?: number;
  city?: {
    id: number;
    city_name: string;
  } | null;
  batch?: {
    id: number;
    batch_name: string;
    year: number;
    city_id: number;
  } | null;
  created_at?: string;
  updated_at?: string;
}

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

export const getAdminRoles = async (): Promise<string[]> => {
  const response = await api.get('/api/admin/roles');
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

// ==========================================
// ADMIN PANEL ENDPOINTS
// ==========================================

export const getCurrentAdmin = async () => {
  // Check if we have an admin token before making the request
  if (!isAdminToken()) {
    clearAuthTokens(); // Clear invalid tokens
    const error = new Error('Access denied. Admins only.');
    (error as any).response = { status: 403, data: { error: 'Access denied. Admins only.' } };
    throw error;
  }

  const response = await api.get('/api/admin/me');
  return response.data;
};

export const getAdminCities = async () => {
  const response = await api.get('/api/cities');
  return response.data;
};

export const getAdminBatches = async (cityName?: string) => {
  const params = cityName ? { city: cityName } : {};
  const response = await api.get('/api/batches', { params });
  return response.data;
};

export const getAdminStats = async (batch_id: number) => {
  const response = await api.post('/api/admin/stats', { batch_id });
  return response.data.data;
};

export const getAdminBatchTopics = async (batchSlug: string, params?: any) => {
  const response = await api.get(`/api/admin/${batchSlug}/topics`, { params });
  return response.data; // paginated structure { topics, pagination }
};

export const createAdminTopic = async (formData: FormData) => {
  const response = await api.post('/api/admin/topics', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  showSuccess('Topic Created');
  return response.data;
};

export const updateAdminTopic = async (topicSlug: string, formData: FormData) => {
  const response = await api.put(`/api/admin/topics/${topicSlug}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  showSuccess('Topic Updated');
  return response.data;
};

export const deleteAdminTopic = async (topicSlug: string) => {
  const response = await api.delete(`/api/admin/topics/${topicSlug}`);
  showDeleteSuccess('Topic');
  return response.data;
};

export const getAllTopics = async () => {
  const response = await api.get('/api/admin/topics');
  return response.data;
};

// ==========================================
// ADMIN PANEL CLASS ENDPOINTS
// ==========================================

export const getAdminTopicClasses = async (batchSlug: string, topicSlug: string) => {
  const response = await api.get(`/api/admin/${batchSlug}/topics/${topicSlug}/classes`);
  return response.data;
};

export const createAdminClass = async (batchSlug: string, topicSlug: string, data: any) => {
  const response = await api.post(`/api/admin/${batchSlug}/topics/${topicSlug}/classes`, data);
  showSuccess('Class Created');
  return response.data;
};

export const updateAdminClass = async (batchSlug: string, topicSlug: string, classSlug: string, data: any) => {
  const response = await api.patch(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}`, data);
  showSuccess('Class Updated');
  return response.data;
};

export const deleteAdminClass = async (batchSlug: string, topicSlug: string, classSlug: string) => {
  const response = await api.delete(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}`);
  showDeleteSuccess('Class');
  return response.data;
};

// ==========================================
// ADMIN PANEL CLASS QUESTIONS ENDPOINTS
// ==========================================

export const getAdminClassQuestions = async (batchSlug: string, topicSlug: string, classSlug: string) => {
  const response = await api.get(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}/questions`);
  return response.data;
};

export const assignQuestionsToClass = async (batchSlug: string, topicSlug: string, classSlug: string, data: { question_ids: number[] }) => {
  const response = await api.post(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}/questions`, data);
  return response.data;
};

export const removeQuestionFromClass = async (batchSlug: string, topicSlug: string, classSlug: string, questionId: number) => {
  const response = await api.delete(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}/questions/${questionId}`);
  return response.data;
};

export const getAdminQuestions = async (params: any) => {
  const response = await api.get('/api/admin/questions', { params });
  return response.data; // paginated structure
};

export const createAdminQuestion = async (data: any) => {
  const response = await api.post('/api/admin/questions', data);
  showSuccess('Question Created');
  return response.data;
};

export const updateAdminQuestion = async (id: number, data: any) => {
  const response = await api.patch(`/api/admin/questions/${id}`, data);
  showSuccess('Question Updated');
  return response.data;
};

export const deleteAdminQuestion = async (id: number) => {
  const response = await api.delete(`/api/admin/questions/${id}`);
  showDeleteSuccess('Question');
  return response.data;
};

// ==========================================
// ADMIN PANEL STUDENT ENDPOINTS
// ==========================================

export const getAdminStudents = async (params: any) => {
  const response = await api.get('/api/admin/students', { params });
  return response.data;
};

export const createAdminStudent = async (data: any) => {
  const response = await api.post('/api/admin/students', data);
  showSuccess('Student Created');
  return response.data;
};

export const updateAdminStudent = async (id: number, data: any) => {
  const response = await api.patch(`/api/admin/students/${id}`, data);
  showSuccess('Student Updated');
  return response.data;
};

export const deleteAdminStudent = async (id: number) => {
  const response = await api.delete(`/api/admin/students/${id}`);
  showDeleteSuccess('Student');
  return response.data;
};

export const bulkUploadStudents = async (formData: FormData) => {
  const response = await api.post('/api/admin/bulk-operations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  showSuccess('File Uploaded', 'Students uploaded successfully!');
  return response.data;
};

export const getAdminStudentProfile = async (username: string) => {
  // Using the public profiling route due to internal restructuring
  const response = await api.get(`/api/students/profile/${username}`);
  return response.data;
};

// ==========================================
// ADMIN PANEL LEADERBOARD ENDPOINTS
// ==========================================

export const getAdminLeaderboard = async (query: { page?: number; limit?: number; search?: string }, body: any) => {
  const response = await api.post('/api/admin/leaderboard', body, { params: query });
  return response.data;
};

export const getAvailableYears = async () => {
  const response = await api.get('/api/admin/leaderboard/years');
  return response.data.years;
};
