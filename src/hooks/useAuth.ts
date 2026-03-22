import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface User {
  name: string;
  role: string;
  email?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkAuth = (allowedRoles: string[]): boolean => {
    if (!isClient) return false;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr) as User;
      return allowedRoles.includes(user.role);
    } catch {
      return false;
    }
  };

  const getCurrentUser = (): User | null => {
    if (!isClient) return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  };

  const isAuthenticated = (): boolean => {
    if (!isClient) return false;
    
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    return !!(token && userStr);
  };

  const logout = (redirectPath: string = '/login') => {
    if (!isClient) return;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push(redirectPath);
  };

  const requireAuth = (allowedRoles: string[], loginPath: string = '/login') => {
    if (!isClient) return false;
    if (pathname === loginPath) return true;
    
    if (!isAuthenticated()) {
      logout(loginPath);
      return false;
    }

    if (!checkAuth(allowedRoles)) {
      logout(loginPath);
      return false;
    }

    return true;
  };

  return {
    checkAuth,
    getCurrentUser,
    isAuthenticated,
    logout,
    requireAuth
  };
};
