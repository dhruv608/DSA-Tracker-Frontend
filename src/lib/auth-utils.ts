
/**
 * Authentication utilities for token validation and user type checking
 */

// Helper function to parse JWT token (client-side only)
export const parseJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
};

// Check if current token is for a student
export const isStudentToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('accessToken') || 
                document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
  
  if (!token) return false;
  
  try {
    const decoded = parseJWT(token);
    return decoded?.userType === 'student';
  } catch (error) {
    console.error('Error checking token type:', error);
    return false;
  }
};

// Check if current token is for an admin
export const isAdminToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('accessToken') || 
                document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
  
  if (!token) return false;
  
  try {
    const decoded = parseJWT(token);
    return decoded?.userType === 'admin';
  } catch (error) {
    console.error('Error checking token type:', error);
    return false;
  }
};

// Clear all authentication tokens
export const clearAuthTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
