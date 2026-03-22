import api from '../lib/api';
import { Batch } from './batch.service';

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

// ==========================================
// ADMIN PANEL ENDPOINTS
// ==========================================

export const getAdminCities = async () => {
  const response = await api.get('/api/admin/cities');
  return response.data;
};

export const getAdminBatches = async (cityName?: string) => {
  const params = cityName ? { city: cityName } : {};
  const response = await api.get('/api/admin/batches', { params });
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
  return response.data;
};

export const updateAdminTopic = async (topicSlug: string, formData: FormData) => {
  const response = await api.put(`/api/admin/topics/${topicSlug}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteAdminTopic = async (topicSlug: string) => {
  const response = await api.delete(`/api/admin/topics/${topicSlug}`);
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
  return response.data;
};

export const updateAdminClass = async (batchSlug: string, topicSlug: string, classSlug: string, data: any) => {
  const response = await api.patch(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}`, data);
  return response.data;
};

export const deleteAdminClass = async (batchSlug: string, topicSlug: string, classSlug: string) => {
  const response = await api.delete(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}`);
  return response.data;
};

// ==========================================
// ADMIN PANEL CLASS QUESTIONS ENDPOINTS
// ==========================================

export const getAdminClassQuestions = async (batchSlug: string, topicSlug: string, classSlug: string) => {
  const response = await api.get(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classSlug}/questions`);
  return response.data;
};

export const assignQuestionsToClass = async (batchSlug: string, topicSlug: string, classSlug: string, data: { questionIds: number[] }) => {
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
  return response.data;
};

export const updateAdminQuestion = async (id: number, data: any) => {
  const response = await api.patch(`/api/admin/questions/${id}`, data);
  return response.data;
};

export const deleteAdminQuestion = async (id: number) => {
  const response = await api.delete(`/api/admin/questions/${id}`);
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
  return response.data;
};

export const updateAdminStudent = async (username: string, data: any) => {
  const response = await api.patch(`/api/admin/students/${username}`, data);
  return response.data;
};

export const deleteAdminStudent = async (username: string) => {
  const response = await api.delete(`/api/admin/students/${username}`);
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
  try {
    const response = await api.post('/api/admin/leaderboard', body, { params: query });
    return response.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      console.error("Raw Leaderboard error payload:", err.response.data);
      throw new Error((err.response.data.message || err.response.data.error) + " | Status 500 payload attached.");
    }
    throw err;
  }
};

export const getAvailableYears = async () => {
  try {
    const response = await api.get('/api/admin/leaderboard/years');
    return response.data.years;
  } catch (err: any) {
    console.error("Failed to fetch available years:", err);
    // Return fallback years if API fails
    return [2026, 2025, 2024, 2023];
  }
};
