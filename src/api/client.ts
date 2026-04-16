import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { 
  handleError, 
  handleErrorSilent, 
  checkIsAuthError,
  canRefreshToken,
  requiresLogout,
  getErrorDetails,
  COMMON_ERROR_CODES,
} from '@/errors';

/**
 * API Client - Centralized axios instance with smart error handling
 * 
 * Features:
 * - Automatic token refresh for TOKEN_EXPIRED errors
 * - Smart error handling based on backend errorCode
 * - Proper logout for INVALID_TOKEN errors
 * - Silent handling for component-managed errors
 */

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

// Extend AxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// Request Interceptor - Attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Concurrency tracking for refresh token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void, reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Response Interceptor - Smart error handling with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Extract error details for smart handling
    const errorData = error.response?.data as { 
      statusCode?: number; 
      message?: string; 
      code?: string;
      errorCode?: string;
    } | undefined;
    
    const errorCode = errorData?.errorCode || errorData?.code;
    const statusCode = error.response?.status;

    // =============================================================================
    // SMART TOKEN HANDLING - Based on errorCode and status code
    // =============================================================================

    // Determine if this is an authentication error that might be recoverable
    const isAuthError = statusCode === 401 ||
      errorCode === COMMON_ERROR_CODES.TOKEN_EXPIRED ||
      errorCode === COMMON_ERROR_CODES.INVALID_TOKEN ||
      errorCode === COMMON_ERROR_CODES.TOKEN_MISSING ||
      errorCode === COMMON_ERROR_CODES.UNAUTHORIZED;

    // TOKEN_EXPIRED / INVALID_TOKEN / 401 → Try refresh token flow (if not already retried)
    if (isAuthError && !originalRequest._retry) {
      // Skip refresh for login endpoints
      if (isLoginEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (res.data?.accessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', res.data.accessToken);
            document.cookie = `accessToken=${res.data.accessToken}; path=/`;
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          processQueue(null, res.data.accessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed → Logout
        executeLogout();
        return Promise.reject(handleErrorSilent(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    // After retry, if still getting auth errors → Immediate logout
    if (originalRequest._retry && isAuthError) {
      executeLogout();
      // Let the error handler show toast and complete logout flow
      const result = handleError(error, { context: originalRequest.url });
      return Promise.reject(result.error);
    }

    // =============================================================================
    // SILENT ERRORS - Component-managed, no toast
    // =============================================================================
    
    if (shouldHandleSilently(originalRequest.url, errorData)) {
      return Promise.reject(handleErrorSilent(error));
    }

    // =============================================================================
    // STANDARD ERROR HANDLING
    // =============================================================================
    
    // Let the error handler process based on errorCode > statusCode > fallback
    handleError(error, {
      context: originalRequest.url || 'API Request',
    });

    return Promise.reject(error);
  }
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if URL is a login endpoint (skip token refresh)
 */
function isLoginEndpoint(url?: string): boolean {
  if (!url) return false;
  const loginEndpoints = [
    '/auth/admin/login',
    '/auth/student/login',
    '/auth/google-login',
    '/auth/refresh-token',
    '/auth/student/logout',
    '/auth/admin/logout',
  ];
  return loginEndpoints.some(endpoint => url.includes(endpoint));
}

/**
 * Check if error should be handled silently (no toast)
 */
function shouldHandleSilently(
  url?: string,
  errorData?: { message?: string; code?: string }
): boolean {
  if (!url) return false;

  // Login endpoints - handled by component (prevents auto-toast, page calls handleError)
  if (url.includes('/auth/student/login')) return true;
  if (url.includes('/auth/admin/login')) return true;
  if (url.includes('/auth/google-login')) return true;

  // Forgot password - handled by hook
  if (url.includes('/auth/forgot-password')) return true;

  // Student logout - handle silently (user is logging out anyway, token may be expired)
  if (url.includes('/auth/student/logout')) return true;

  // Profile not found - handled by component
  if (url.includes('/api/students/profile') && errorData?.message === 'Student not found') {
    return true;
  }

  return false;
}

/**
 * Execute logout - clear tokens and redirect
 */
function executeLogout(): void {
  if (typeof window === 'undefined') return;

  // Clear all auth storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear cookies
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Determine redirect path
  const currentPath = window.location.pathname;
  const isPublicPage =
    currentPath.startsWith('/profile/') &&
    currentPath !== '/profile' &&
    currentPath.split('/').length === 3;
  const isLeaderboard = currentPath === '/leaderboard';

  // Don't redirect if on public pages
  if (isPublicPage || isLeaderboard) return;

  // Redirect to appropriate login
  let redirectPath = '/login';
  if (currentPath.startsWith('/admin/')) {
    redirectPath = '/admin/login';
  } else if (currentPath.startsWith('/superadmin/')) {
    redirectPath = '/superadmin/login';
  }

  window.location.href = redirectPath;
}

/**
 * Check if error is an authentication error (401/403)
 */
export function isAuthError(error: unknown): boolean {
  return checkIsAuthError(error);
}

/**
 * Handle authentication error with redirect
 */
export function handleAuthErrorWithRedirect(error: unknown, redirectPath?: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    const currentPath = window.location.pathname;
    let finalRedirect = redirectPath || '/login';

    if (!redirectPath) {
      if (currentPath.startsWith('/admin/')) {
        finalRedirect = '/admin/login';
      } else if (currentPath.startsWith('/superadmin/')) {
        finalRedirect = '/superadmin/login';
      }
    }

    window.location.href = finalRedirect;
  }
}

export default apiClient;
