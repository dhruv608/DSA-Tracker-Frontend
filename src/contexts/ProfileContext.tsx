"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { ApiError } from '@/types/common/api.types';

interface ProfileData {
  data: {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImageUrl?: string;
    leetcode?: string;
    leetcode_id?: string;
    gfg?: string;
    gfg_id?: string;
  };
  success?: boolean;
  message?: string;
}

interface ProfileContextType {
  profile: ProfileData | null;
  profileLoading: boolean;
  profileError: string | null;
  refetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchProfile = async () => {
    // Check if we have a student token before making API calls
    if (!isStudentToken()) {
      setProfileLoading(false);
      setProfile(null);
      return;
    }

    // Skip if already fetching
    if (isFetching.current) {
      console.log("Already fetching profile, skipping duplicate call");
      return;
    }

    setProfileLoading(true);
    setProfileError(null);
    isFetching.current = true;
    
    try {
      const data = await studentAuthService.getCurrentStudent();
      setProfile(data);
    } catch (e) {
      // Error is handled by API client interceptor
      const error = e as ApiError;
      setProfileError(error?.message || 'Failed to fetch profile');

      // Handle different error types gracefully
      if (error?.response?.status === 401) {
        // Token expired - will be handled by interceptors
        setProfile(null);
        return;
      } else if (error?.response?.status === 403) {
        // Admin token on student route
        setProfile(null);
      } else if (error?.code === 'NETWORK_ERROR') {
        // Network connectivity issues
        setProfile(null);
      } else {
        // Other errors
        setProfile(null);
      }
    } finally {
      setProfileLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for custom event to refetch when onboarding completes
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []); // Remove pathname dependency - only fetch once on mount

  const refetchProfile = async () => {
    await fetchProfile();
  };

  const clearProfile = () => {
    setProfile(null);
    setProfileError(null);
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      profileLoading, 
      profileError, 
      refetchProfile, 
      clearProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
