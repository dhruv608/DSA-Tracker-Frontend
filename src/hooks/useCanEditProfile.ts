import { useMemo } from 'react';

interface UseCanEditProfileParams {
  authChecked: boolean;
  currentUser: {
    data?: {
      id?: number;
      username?: string;
    };
    error?: string;
  } | null;
  profileStudent?: {
    id?: number;
    username?: string;
  } | null;
}

export function useCanEditProfile({ authChecked, currentUser, profileStudent }: UseCanEditProfileParams) {
  const canEdit = useMemo(() => {
    if (!authChecked) return false;
    if (!currentUser) return false;
    if (currentUser?.error === "Access denied. Students only.") return false;
    if (!profileStudent) return false;

    const isOwner1 = currentUser?.data?.id === profileStudent.id;
    const isOwner2 = currentUser?.data?.username === profileStudent.username;

    const token = typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') || document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
      : null;

    let tokenUsername: string | null = null;

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        tokenUsername = decoded.email?.split('@')[0];
      } catch (e) {
        console.log(e);
      }
    }

    const isOwner5 = tokenUsername === profileStudent.username;

    return isOwner1 || isOwner2 || isOwner5;
  }, [authChecked, currentUser, profileStudent]);

  return canEdit;
}
