import axios from 'axios';

// Helper function to read cookies
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookiePart = parts.pop()?.split(';').shift();
    return cookiePart || null;
  }
  return null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request Interceptor
// Automatically attaches JWT access tokens from cookies or localStorage to all requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Try cookie first, then fallback to localStorage
      const token = getCookie('accessToken') || localStorage.getItem('accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response Interceptor
// Handles 401 errors by attempting token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't refresh on login failures
      if (originalRequest.url?.includes('/auth/admin/login') || originalRequest.url?.includes('/auth/student/login') || originalRequest.url?.includes('/auth/google-login')|| originalRequest.url?.includes('/api/students/profile')) {
        return Promise.reject(error);
      }

      // Check if request is from admin pages to redirect appropriately
      const isAdminRequest = originalRequest.url?.includes('/api/admin/') ||
        (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/'));

      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (res.data?.accessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', res.data.accessToken);
            document.cookie = `accessToken=${res.data.accessToken}; path=/`;
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear data and redirect to appropriate login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

          // Redirect to appropriate login page based on current path
          const currentPath = window.location.pathname;

          if (currentPath.startsWith('/admin/')) {
            window.location.href = '/admin/login';
          }
          else if (currentPath.startsWith('/superadmin/')) {
            window.location.href = '/superadmin/login';
          }
          else if (currentPath === '/login' || currentPath.startsWith('/student/')) {
            window.location.href = '/login';
          }
          else {
            // Default fallback to student login
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
