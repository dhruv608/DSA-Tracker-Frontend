// src/app/(student)/profile/[username]/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { studentProfileService } from '@/services/student/profile.service';
import { studentAuthService } from '@/services/student/auth.service';
import { ErrorHandler } from '@/lib/error-handler';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  ProfileDataState,
  CurrentUserState,
  ApiError
} from '@/types/student';
import { EditProfileModal } from '@/components/student/profile/EditProfileModal';
import { EditUsernameModal } from '@/components/student/profile/EditUsernameModal';
import { Toast } from '@/app/(auth)/shared/components/Toast';

import { ProfilePageShimmer } from '@/components/student/profile/shimmers';
import { ProfileHeader } from '@/components/student/profile/ProfileHeader';
import { OverviewStats } from '@/components/student/profile/OverviewStats';
import { ProfileInfo } from '@/components/student/profile/ProfileInfo';
import { SocialLinks } from '@/components/student/profile/SocialLinks';
import { ProblemSolvingStats } from '@/components/student/profile/ProblemSolvingStats';
import { ActivityHeatmap } from '@/components/student/profile/ActivityHeatmap';
import { RecentActivity } from '@/components/student/profile/RecentActivity';
import TopicProgressModal from '@/components/student/topics/TopicProgressModal';
import { handleError } from "@/utils/handleError";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [profileData, setProfileData] = useState<ProfileDataState>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsernameEditModal, setShowUsernameEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    github: '',
    linkedin: '',
    leetcode: '',
    gfg: ''
  });
  const [usernameForm, setUsernameForm] = useState({
    username: ''
  });
  const [currentUser, setCurrentUser] = useState<CurrentUserState | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showTopicProgressModal, setShowTopicProgressModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAuthAndProfile = async () => {
      await fetchCurrentUser();
      await fetchProfileByUsername();
    };
    initializeAuthAndProfile();
  }, [username]);

  const fetchCurrentUser = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth check timeout')), 5000);
      });

      const currentUserPromise = studentAuthService.getCurrentStudent();
      const user = await Promise.race([currentUserPromise, timeoutPromise]) as any;

      setCurrentUser(user);

      if (user?.error === "Access denied. Students only.") {
        setCurrentUser(null);
        return;
      }

    } catch (error: unknown) {
      handleError(error);
      const apiError = error as ApiError;
      if (apiError?.response?.status === 403) {
        setCurrentUser(null);
        return;
      }
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchProfileByUsername = async () => {
    if (!username) return;

    setLoading(true);
    setProfileError(null);

    try {
      const data = await studentProfileService.getProfileByUsername(username);
      setProfileData(data);
      setEditForm({
        name: data?.student?.name || '',
        github: data?.student?.github || '',
        linkedin: data?.student?.linkedin || '',
        leetcode: data?.student?.leetcode || '',
        gfg: data?.student?.gfg || ''
      });
      setUsernameForm({
        username: data?.student?.username || ''
      });
    } catch (err: unknown) {
      handleError(err);
      const apiError = err as ApiError;
      const userError = ErrorHandler.handle(apiError, 'fetchProfileByUsername');
      setProfileError(userError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
      await studentProfileService.updateProfileImage(file);

      const refreshTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile refresh timeout')), 3000);
      });

      await Promise.race([fetchProfileByUsername(), refreshTimeout]);
    } catch (err: unknown) {
      handleError(err);
      const apiError = err as ApiError;
      if (apiError.message === 'Profile refresh timeout') {
        alert('Profile image uploaded successfully!');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const canEdit = () => {
    if (!authChecked) return false;
    if (!currentUser) return false;
    if (currentUser?.error === "Access denied. Students only.") return false;
    if (!profileData?.student) return false;

    const isOwner1 = currentUser?.data?.id === profileData.student.id;
    const isOwner2 = currentUser?.data?.username === profileData.student.username;

    const token = localStorage.getItem('accessToken') || document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
    let tokenUsername = null;

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
        handleError(e);
        console.log('🔍 Token decode failed:', e);
      }
    }

    const isOwner5 = tokenUsername === profileData.student.username;
    return isOwner1 || isOwner2 || isOwner5;
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      await studentProfileService.updateProfileDetails({
        github: editForm.github,
        linkedin: editForm.linkedin
      });
      await fetchProfileByUsername();
      setShowEditModal(false);
      
    } catch (error) {
      handleError(error);
      ErrorHandler.showAlert(error, 'handleSaveProfile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveUsername = async () => {
    try {
      if (!usernameForm.username.trim()) {
        alert('Username cannot be empty');
        return;
      }

      const localStorageToken = localStorage.getItem('accessToken');
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const token = localStorageToken || cookieToken;
      
      if (!token) {
        alert('Please log in to update your username.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      await studentProfileService.updateProfileDetails({
        username: usernameForm.username.trim()
      });

      await fetchProfileByUsername();
      setShowUsernameEditModal(false);

      const newUsername = usernameForm.username.trim();
      if (newUsername !== username) {
        window.location.href = `/profile/${newUsername}`;
      }
      alert('Username updated successfully!');
    } catch (error: unknown) {
      handleError(error);
      if (error instanceof Error) {
        if (error.message === 'Token refresh failed' ||
          error.message.includes('401') ||
          error.message.includes('Unauthorized')) {
          alert('Your session has expired. Please log in again to update your username.');
          localStorage.removeItem('accessToken');
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
      }

      const apiError = error as ApiError;
      ErrorHandler.showAlert(apiError, 'handleSaveUsername');
    }
  };

  const handleDeleteImage = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteImage = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem('accessToken') ||
        document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

      const response = await fetch('/api/students/profile-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProfileByUsername();
        setShowDeleteConfirm(false);
        alert('Profile image removed successfully!');
      } else {
        throw new Error('Failed to remove profile image');
      }
    } catch (error) {
      handleError(error);
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
     return <ProfilePageShimmer />;
  }

  if (profileError) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Profile</h2>
          <p className="text-muted-foreground mb-6">{profileError}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.student) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <h2>Profile not found.</h2>
      </div>
    );
  }

  const { student, codingStats, streak, leaderboard, recentActivity, heatmap } = profileData || {
  student: {},
  codingStats: {},
  streak: {},
  leaderboard: {},
  recentActivity: [],
  heatmap: []
};

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-16 mt-3">
      {/* PROFILE HEADER */}
      <ProfileHeader
        student={student}
        canEdit={canEdit()}
        onEditProfile={() => setShowEditModal(true)}
        onShowTopicProgress={() => setShowTopicProgressModal(true)}
        onEditUsername={() => setShowUsernameEditModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-8">
          {/* OVERVIEW STATS */}
          <OverviewStats
            leaderboard={leaderboard}
            streak={streak}
          />

          {/* PLATFORM LINKS */}
          <ProfileInfo student={student} />

          {/* SOCIAL LINKS */}
          <SocialLinks
            student={student}
            canEdit={canEdit()}
            onEditSocialLinks={() => setShowEditModal(true)}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 space-y-8">
          {/* PROBLEM SOLVING STATS */}
          <ProblemSolvingStats codingStats={codingStats} />

          {/* ACTIVITY HEATMAP */}
          <ActivityHeatmap heatmap={heatmap} />

          {/* RECENT ACTIVITY */}
          <RecentActivity recentActivity={recentActivity} />
        </div>
      </div>

      {/* MODALS */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
        editForm={editForm}
        setEditForm={setEditForm}
        uploading={uploading}
        savingProfile={savingProfile}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        handleDeleteImage={handleDeleteImage}
        handleSaveProfile={handleSaveProfile}
      />

      <EditUsernameModal
        isOpen={showUsernameEditModal}
        onClose={() => setShowUsernameEditModal(false)}
        usernameForm={usernameForm}
        setUsernameForm={setUsernameForm}
        handleSaveUsername={handleSaveUsername}
      />

      <TopicProgressModal
        isOpen={showTopicProgressModal}
        onClose={() => setShowTopicProgressModal(false)}
        username={username}
      />

      <Toast />
    </div>
  );
}