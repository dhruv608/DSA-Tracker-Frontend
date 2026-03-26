"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StudentHeader from '@/components/student/layout/StudentHeader';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken, clearAuthTokens } from '@/lib/auth-utils';
import { RecentQuestionsSidebar } from '@/components/student/RecentQuestionsSidebar';
import { RecentQuestionsProvider } from '@/contexts/RecentQuestionsContext';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [leetcodeId, setLeetcodeId] = useState('');
  const [gfgId, setGfgId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    
    // Allow public access to profile routes
    if (pathname.startsWith('/profile/')) {
      setLoading(false);
      return;
    }

    // Check if we have a student token
    if (!isStudentToken()) {
      clearAuthTokens(); // Clear any invalid tokens (like admin tokens)
      router.push('/login');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      router.push('/login');
      return;
    }


    const checkProfile = async () => {
      try {
        const profileData = await studentAuthService.getCurrentStudent();
        setProfile(profileData);
        // Only require complete profile if we actually loaded a profile and it is concretely missing IDs
        const leetcode = profileData?.leetcode || profileData?.leetcode_id;
        const gfg = profileData?.gfg || profileData?.gfg_id;
        const requireCompleteProfile = profileData !== null && (!leetcode || !gfg);

        if (requireCompleteProfile) {
          setShowProfileModal(true);
        }
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [router, pathname]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Note: We'll implement profile update later if needed
      // For now, just close the modal and update local state
      setShowProfileModal(false);
      // Optimistically update local profile state
      setProfile((prev: any) => ({ ...prev, leetcode: leetcodeId, gfg: gfgId }));
    } catch (e) {
      console.error("Failed to update profile", e);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <RecentQuestionsProvider>
        <StudentHeader />
        
        <main className="flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
        
        <RecentQuestionsSidebar />
      </RecentQuestionsProvider>
    </div>
  );
}
