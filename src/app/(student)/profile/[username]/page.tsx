"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { studentProfileService } from '@/services/student/profile.service';
import { studentAuthService } from '@/services/student/auth.service';
import { ErrorHandler } from '@/lib/error-handler';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Flame, Trophy, CheckCircle2, Link as LinkIcon, Camera, Edit2, X, Calendar, Target, TrendingUp, Users, MapPin, GraduationCap, Code, Activity, Clock, Award, BarChart3 } from 'lucide-react';

import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  StudentProfile,
  ProfileEditForm,
  UsernameForm,
  ProfileUpdateData,
  UsernameUpdateData,
  TopicProgressModalProps,
  ProfileDataState,
  CurrentUserState,
  HeatmapData,
  RecentActivity,
  ApiError
} from '@/types/student';
import { EditProfileModal } from '@/components/student/profile/EditProfileModal';
import { EditUsernameModal } from '@/components/student/profile/EditUsernameModal';
import { Toast } from '@/app/(auth)/shared/components/Toast';
import { TopicProgressModal } from '@/components/student/topics/TopicProgressModal';
export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [profileData, setProfileData] = useState<ProfileDataState>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
    // Fetch current user first to establish auth state
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

      // Check if user has admin token trying to access student routes
      if (user?.error === "Access denied. Students only.") {
        setCurrentUser(null);
        return;
      }

    } catch (error: unknown) {
      const apiError = error as ApiError;

      // Handle 403 errors (admin token trying to access student routes)
      if (apiError?.response?.status === 403) {
        setCurrentUser(null);
        return;
      }

      // For other errors, we still want to set authChecked = true
    } finally {
      setAuthChecked(true);
    }
  };

  // Authentication is now completely optional - only check when user tries to edit
  // This prevents all 403 errors on public profile views

  const fetchProfileByUsername = async () => {
    if (!username) {
      return;
    }

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

      // Add timeout for profile refresh to prevent hanging
      const refreshTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile refresh timeout')), 3000); // 3 second timeout
      });

      await Promise.race([fetchProfileByUsername(), refreshTimeout]);

      // Show success feedback
    } catch (err: unknown) {
      const apiError = err as ApiError;

      // If refresh timed out, still show success for the upload
      if (apiError.message === 'Profile refresh timeout') {
        alert('Profile image uploaded successfully!');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
          <p className="text-sm">Fetching profile data for @{username}...</p>
        </div>
      </div>
    );
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

  const { student, codingStats, streak, leaderboard, recentActivity, heatmap } = profileData;
  const initials = student.name
    ? student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  const canEdit = () => {
    // If auth check hasn't completed, don't show edit button yet
    if (!authChecked) {
      console.log('🔒 Edit not allowed: Auth not checked');
      return false;
    }

    // If no current user, definitely can't edit
    if (!currentUser) {
      console.log('🔒 Edit not allowed: No current user');
      return false;
    }

    // If current user has admin token (403 error), can't edit student profile
    if (currentUser?.error === "Access denied. Students only.") {
      console.log('🔒 Edit not allowed: Admin token detected');
      return false;
    }

    // Check if profile data exists and has student info
    if (!profileData?.student) {
      console.log('🔒 Edit not allowed: No profile data');
      return false;
    }

    // Multiple ways to check if this is the owner's profile
    const isOwner1 = currentUser?.data?.id === profileData.student.id;
    const isOwner2 = currentUser?.data?.username === profileData.student.username;

    console.log('🔍 Edit permission check:', {
      authChecked,
      hasCurrentUser: !!currentUser,
      hasProfileData: !!profileData?.student,
      currentUserData: currentUser?.data,
      profileStudent: profileData.student,
      isOwner1,
      isOwner2
    });

    // Check token-based username match
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
        tokenUsername = decoded.email?.split('@')[0]; // Extract username from email
      } catch (e) {
        console.log('🔍 Token decode failed:', e);
      }
    }

    const isOwner5 = tokenUsername === profileData.student.username;
    const canEditResult = isOwner1 || isOwner2 || isOwner5;

    console.log('🔍 Final edit permission result:', {
      isOwner1,
      isOwner2,
      isOwner5,
      tokenUsername,
      profileUsername: profileData.student.username,
      canEditResult
    });

    return canEditResult;
  };

  // Add a manual refresh function for auth state
  const refreshAuthState = async () => {
    setAuthChecked(false);
    await fetchCurrentUser();
  };


  const handleSaveProfile = async () => {
    try {
      setUploading(true);

      // Use the existing profile service with automatic token handling
      await studentProfileService.updateProfileDetails({
        github: editForm.github,
        linkedin: editForm.linkedin
      });

      // Refresh profile data
      await fetchProfileByUsername();
      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (error) {
      // Use proper error handling
      ErrorHandler.showAlert(error, 'handleSaveProfile');
    } finally {
      setUploading(false);
    }
  };


  const handleSaveUsername = async () => {
    try {
      if (!usernameForm.username.trim()) {
        alert('Username cannot be empty');
        return;
      }

      // Get token from multiple sources
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

      console.log("Updating username using /student/me API via service", {
        payload: { username: usernameForm.username.trim() }
      });

      // Use the same service as other profile updates (automatic token handling)
      await studentProfileService.updateProfileDetails({
        username: usernameForm.username.trim()
      });

      // Refresh profile data and redirect to new URL
      await fetchProfileByUsername();
      setShowUsernameEditModal(false);

      // Redirect to new username URL
      const newUsername = usernameForm.username.trim();
      if (newUsername !== username) {
        window.location.href = `/profile/${newUsername}`;
      }
      alert('Username updated successfully!');
    } catch (error: unknown) {
      console.log("Username update error:", error);

      // Handle authentication failures gracefully
      if (error instanceof Error) {
        if (error.message === 'Token refresh failed' ||
          error.message.includes('401') ||
          error.message.includes('Unauthorized')) {
          alert('Your session has expired. Please log in again to update your username.');
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
      }

      const apiError = error as ApiError;
      // Use proper error handling
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
        // Refresh profile data
        await fetchProfileByUsername();
        setShowDeleteConfirm(false);
        alert('Profile image removed successfully!');
      } else {
        throw new Error('Failed to remove profile image');
      }
    } catch (error) {
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-16">
      {/* HERO SECTION */}
      <div className="glass borderless p-8 mb-8" style={{borderRadius: 'var(--radius-xl)'}}>
        <div className="flex items-center justify-between">
          {/* LEFT: Profile Info */}
          <div className="flex items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden border-2 glass hover-glow transition-all duration-200 hover:scale-105" 
                style={{borderColor: 'var(--border)'}}
              >
                {student.profileImageUrl ? (
                  <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center font-bold text-primary-foreground" 
                    style={{backgroundColor: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xl)'}}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Name and Metadata */}
            <div>
              <h1 
                className="font-bold mb-1" 
                style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
              >
                {student.name}
              </h1>
              <p 
                className="font-mono mb-3" 
                style={{fontSize: 'var(--text-base)', color: 'var(--text-secondary)'}}
              >
                @{student.username}
              </p>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-3" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                {student.batch && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: 'var(--accent-primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-full)'}}>
                    <GraduationCap className="w-4 h-4" />
                    Batch {student.batch} {student.year && `(${student.year})`}
                  </span>
                )}
                {student.city && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: 'var(--accent-secondary)', color: 'var(--secondary-foreground)', borderRadius: 'var(--radius-full)'}}>
                    <MapPin className="w-4 h-4" />
                    {student.city}
                  </span>
                )}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-full)'}}>
                  ID: {student.enrollmentId}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="hover-glow"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTopicProgressModal(true)}
              className="hover-glow"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* LEFT COLUMN: STATS & SOCIAL */}
        <div className="lg:col-span-1 space-y-8">

          {/* OVERVIEW STATS */}
          <div className="glass p-6" style={{borderRadius: 'var(--radius-lg)'}}>
            <h3 
              className="font-bold mb-6 flex items-center gap-2" 
              style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
            >
              <Award className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
              Overview
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
                <span className="font-medium flex items-center gap-2" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                  <Trophy className="w-4 h-4" style={{color: 'var(--accent-primary)'}} />
                  Global Rank
                </span>
                <span className="font-bold font-mono" style={{fontSize: 'var(--text-xl)', color: 'var(--foreground)'}}>
                  #{leaderboard?.globalRank || '-'}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
                <span className="font-medium flex items-center gap-2" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                  <Target className="w-4 h-4" style={{color: 'var(--accent-primary)'}} />
                  City Rank
                </span>
                <span className="font-bold font-mono" style={{fontSize: 'var(--text-xl)', color: 'var(--foreground)'}}>
                  #{leaderboard?.cityRank || '-'}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
                <span className="font-medium flex items-center gap-2" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                  <Flame className="w-4 h-4" style={{color: 'var(--accent-primary)'}} />
                  Max Streak
                </span>
                <span className="font-bold font-mono" style={{fontSize: 'var(--text-xl)', color: 'var(--foreground)'}}>
                  {streak?.maxStreak || 0}
                </span>
              </div>

              {/* Current Streak with new logic */}
              <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{
                backgroundColor: (streak?.count === 0 && streak?.hasQuestion === false) 
                  ? 'var(--muted)' 
                  : 'var(--accent-secondary)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div className="flex flex-col gap-1">
                  <span className="font-medium flex items-center gap-2" style={{
                    fontSize: 'var(--text-sm)', 
                    color: (streak?.count === 0 && streak?.hasQuestion === false)
                      ? 'var(--text-secondary)'
                      : 'var(--text-secondary)'
                  }}>
                    <Flame className="w-4 h-4" style={{color: 'var(--accent-primary)'}} />
                    Current Streak
                    {(streak?.count === 0 && streak?.hasQuestion === false) && (
                      <span style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                        (Frozen)
                      </span>
                    )}
                  </span>
                  {(streak?.count === 0 && streak?.hasQuestion === false) && (
                    <span style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                      No question uploaded today
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono" style={{
                    fontSize: 'var(--text-xl)', 
                    color: (streak?.count === 0 && streak?.hasQuestion === false)
                      ? 'var(--text-secondary)'
                      : 'var(--foreground)'
                  }}>
                    {streak?.currentStreak || 0}
                  </span>
                  {streak && streak.count && streak.count > 0 && (
                    <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                      {streak.count} submission{streak.count !== 1 ? 's' : ''} today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FIXED INFO */}
          <div className="glass p-6" style={{borderRadius: 'var(--radius-lg)'}}>
            <h3 
              className="font-bold mb-6 flex items-center gap-2" 
              style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
            >
              <Users className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
              Profile Information
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
                <span className="font-medium" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Name</span>
                <span className="font-bold" style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}>{student.name || '-'}</span>
              </div>

              <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
                <span className="font-medium" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Enrollment ID</span>
                <span className="font-mono" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>{student.enrollmentId || '-'}</span>
              </div>

              <div className="flex items-center gap-4 p-4 hover-glow transition-all duration-200" style={{
                backgroundColor: student.leetcode ? 'var(--accent-secondary)' : 'var(--muted)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${student.leetcode ? 'var(--border)' : 'var(--border)'}`
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
                  backgroundColor: student.leetcode ? 'var(--accent-primary)' : 'var(--muted)',
                  color: student.leetcode ? 'var(--primary-foreground)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Code className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>LeetCode</div>
                  <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.leetcode || 'Not linked'}</div>
                </div>
                {student.leetcode && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
              </div>

              <div className="flex items-center gap-4 p-4 hover-glow transition-all duration-200" style={{
                backgroundColor: student.gfg ? 'var(--accent-secondary)' : 'var(--muted)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${student.gfg ? 'var(--border)' : 'var(--border)'}`
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
                  backgroundColor: student.gfg ? 'var(--accent-primary)' : 'var(--muted)',
                  color: student.gfg ? 'var(--primary-foreground)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Code className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>GeeksforGeeks</div>
                  <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.gfg || 'Not linked'}</div>
                </div>
                {student.gfg && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
              </div>
            </div>
          </div>

          {/* EDITABLE SOCIAL LINKS */}
          <div className="glass p-6" style={{borderRadius: 'var(--radius-lg)'}}>
            <h3 
              className="font-bold mb-6 flex items-center gap-2" 
              style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
            >
              <LinkIcon className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
              Social Links
            </h3>

            <div className="space-y-4">
              <a href={student.github || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 hover-glow transition-all duration-200 ${student.github ? '' : 'opacity-60 pointer-events-none'}`} style={{
                backgroundColor: student.github ? 'var(--accent-secondary)' : 'var(--muted)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${student.github ? 'var(--border)' : 'var(--border)'}`
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
                  backgroundColor: student.github ? 'var(--accent-primary)' : 'var(--muted)',
                  color: student.github ? 'var(--primary-foreground)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Github className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>GitHub</div>
                  <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.github ? 'Connected' : 'Not connected'}</div>
                </div>
                {student.github && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
              </a>

              <a href={student.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 hover-glow transition-all duration-200 ${student.linkedin ? '' : 'opacity-60 pointer-events-none'}`} style={{
                backgroundColor: student.linkedin ? 'var(--accent-secondary)' : 'var(--muted)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${student.linkedin ? 'var(--border)' : 'var(--border)'}`
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
                  backgroundColor: student.linkedin ? 'var(--accent-primary)' : 'var(--muted)',
                  color: student.linkedin ? 'var(--primary-foreground)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Linkedin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>LinkedIn</div>
                  <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.linkedin ? 'Connected' : 'Not linked'}</div>
                </div>
                {student.linkedin && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
              </a>
            </div>

            {canEdit() && (
              <Button 
                variant="outline" 
                className="w-full mt-6 hover-glow transition-all duration-200" 
                onClick={() => setShowEditModal(true)}
                style={{borderRadius: 'var(--radius-lg)'}}
              >
                Edit Social Links
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVITY & HEATMAP */}
        <div className="lg:col-span-3 space-y-8">

          {/* SOLVING STATISTICS */}
          <div className="glass p-8" style={{borderRadius: 'var(--radius-lg)'}}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 
                  className="font-bold mb-2 flex items-center gap-3" 
                  style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
                >
                  <TrendingUp className="w-8 h-8" style={{color: 'var(--accent-primary)'}} />
                  Problem Solving Stats
                </h2>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Track your coding journey across all difficulty levels.</p>
              </div>
              <div className="text-right">
                <div 
                  className="font-black" 
                  style={{fontSize: 'var(--text-5xl)', color: 'var(--accent-primary)'}}
                >
                  {codingStats?.totalSolved || 0}
                </div>
                <div 
                  className="font-mono mt-1" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                >
                  Total Solved
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-6 text-center hover-glow transition-all duration-200" style={{
                backgroundColor: 'var(--accent-secondary)', 
                borderRadius: 'var(--radius-lg)'
              }}>
                <div 
                  className="font-bold mb-3" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                >
                  Easy
                </div>
                <div 
                  className="font-bold" 
                  style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
                >
                  {codingStats?.easy?.solved || 0}
                </div>
                <div 
                  className="mt-2" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                >
                  / {codingStats?.easy?.assigned || 0} assigned
                </div>
                <div 
                  className="w-full rounded-full mt-3" 
                  style={{height: 'var(--spacing-xs)', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)'}}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: `${codingStats?.easy?.assigned ? (codingStats.easy.solved / codingStats.easy.assigned) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>

              <div className="p-6 text-center hover-glow transition-all duration-200" style={{
                backgroundColor: 'var(--accent-secondary)', 
                borderRadius: 'var(--radius-lg)'
              }}>
                <div 
                  className="font-bold mb-3" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                >
                  Medium
                </div>
                <div 
                  className="font-bold" 
                  style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
                >
                  {codingStats?.medium?.solved || 0}
                </div>
                <div 
                  className="mt-2" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                >
                  / {codingStats?.medium?.assigned || 0} assigned
                </div>
                <div 
                  className="w-full rounded-full mt-3" 
                  style={{height: 'var(--spacing-xs)', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)'}}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: `${codingStats?.medium?.assigned ? (codingStats.medium.solved / codingStats.medium.assigned) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>

              <div className="p-6 text-center hover-glow transition-all duration-200" style={{
                backgroundColor: 'var(--accent-secondary)', 
                borderRadius: 'var(--radius-lg)'
              }}>
                <div 
                  className="font-bold mb-3" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
                >
                  Hard
                </div>
                <div 
                  className="font-bold" 
                  style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
                >
                  {codingStats?.hard?.solved || 0}
                </div>
                <div 
                  className="mt-2" 
                  style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                >
                  / {codingStats?.hard?.assigned || 0} assigned
                </div>
                <div 
                  className="w-full rounded-full mt-3" 
                  style={{height: 'var(--spacing-xs)', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)'}}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: `${codingStats?.hard?.assigned ? (codingStats.hard.solved / codingStats.hard.assigned) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ACTIVITY HEATMAP */}
            <div>
              <h3 
                className="font-bold mb-4 flex items-center gap-2" 
                style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
              >
                <Activity className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
                Activity Heatmap (Full Year)
              </h3>
              {heatmap && heatmap.length > 0 ? (
                <div className="glass p-4" style={{borderRadius: 'var(--radius-lg)'}}>
                  {/* GitHub-style horizontal layout */}
                  <div className="flex flex-col gap-2">
                    {/* Month labels */}
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-3 flex items-center justify-end" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                        {/* Empty space for day labels */}
                      </div>
                      <div className="flex-1 flex justify-between" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                      </div>
                    </div>

                    {/* Heatmap grid */}
                    <div className="flex items-start gap-2">
                      {/* Day labels */}
                      <div className="flex flex-col gap-0.5 w-10" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                        <div className="h-3 flex items-center justify-end">Mon</div>
                        <div className="h-3"></div>
                        <div className="h-3"></div>
                        <div className="h-3 flex items-center justify-end">Wed</div>
                        <div className="h-3"></div>
                        <div className="h-3"></div>
                        <div className="h-3 flex items-center justify-end">Fri</div>
                        <div className="h-3"></div>
                      </div>

                      {/* Heatmap cells - Horizontal layout */}
                      <div className="flex-1 flex gap-0.5">
                        {Array.from({ length: 53 }).map((_, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-0.5">
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              // Calculate the date for this cell (full year = 364 days)
                              const dayOffset = (weekIndex * 7) + dayIndex;
                              const date = new Date(today);
                              date.setDate(date.getDate() - (364 - dayOffset));

                              // Skip if date is in the future
                              if (date > today) {
                                return <div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                              }

                              const dateStr = date.toISOString().split('T')[0];
                              const dayData = heatmap.find((h: HeatmapData) => new Date(h.date).toISOString().split('T')[0] === dateStr);

                              const count = dayData ? dayData.count : 0;
                              let bgClass = "bg-secondary/30 border border-border/50";
                              if (count === 0) bgClass = "bg-secondary/30 border border-border/50";
                              else if (count === 1) bgClass = "bg-primary/20 border border-primary/30";
                              else if (count === 2) bgClass = "bg-primary/40 border border-primary/50";
                              else if (count === 3) bgClass = "bg-primary/60 border border-primary/70";
                              else if (count >= 4) bgClass = "bg-primary border border-primary";

                              return (
                                <div
                                  key={`${weekIndex}-${dayIndex}`}
                                  className={`w-3 h-3 ${bgClass} transition-all hover:scale-110 hover:z-10 cursor-pointer`}
                                  title={`${count} submissions on ${date.toLocaleDateString()}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Legend and stats */}
                  <div className="flex items-center justify-between mt-3 pt-3" style={{borderTop: `1px solid var(--border)`}}>
                    <div className="flex items-center gap-3" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                      <span>Less</span>
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3" style={{backgroundColor: 'var(--muted)', border: `1px solid var(--border)`}}></div>
                        <div className="w-3 h-3" style={{backgroundColor: 'var(--primary)', opacity: 0.2, border: `1px solid var(--border)`}}></div>
                        <div className="w-3 h-3" style={{backgroundColor: 'var(--primary)', opacity: 0.4, border: `1px solid var(--border)`}}></div>
                        <div className="w-3 h-3" style={{backgroundColor: 'var(--primary)', opacity: 0.6, border: `1px solid var(--border)`}}></div>
                        <div className="w-3 h-3" style={{backgroundColor: 'var(--primary)', border: `1px solid var(--border)`}}></div>
                      </div>
                      <span>More</span>
                    </div>

                    {/* Stats summary */}
                    <div className="flex items-center gap-4" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3" style={{backgroundColor: 'var(--primary)', opacity: 0.2, border: `1px solid var(--border)`}}></div>
                        {heatmap.reduce((sum: number, h: HeatmapData) => sum + (h.count > 0 ? 1 : 0), 0)} active days
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {heatmap.reduce((sum: number, h: HeatmapData) => sum + h.count, 0)} total submissions
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 flex items-center justify-center" style={{
                  height: 'var(--spacing-2xl)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px dashed var(--border)`,
                  backgroundColor: 'var(--card)'
                }}>
                  <div className="text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2" style={{color: 'var(--text-secondary)'}} />
                    <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>No activity data available yet. Start solving!</div>
                  </div>
                </div>
              )}
            </div>

          {/* RECENT ACTIVITY */}
          <div className="glass p-8" style={{borderRadius: 'var(--radius-lg)'}}>
            <h3 
              className="font-bold mb-6 flex items-center gap-2" 
              style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
            >
              <Clock className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
              Recent Activity
            </h3>

            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity: RecentActivity, idx: number) => {
                  const levelBg = 'var(--accent-secondary)';
                  const levelColor = 'var(--text-secondary)';

                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-5 hover-glow transition-all duration-200" 
                      style={{
                        backgroundColor: levelBg,
                        borderRadius: 'var(--radius-lg)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center" 
                          style={{
                            backgroundColor: 'var(--accent-primary)',
                            color: 'var(--primary-foreground)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div 
                            className="font-semibold cursor-pointer transition-colors" 
                            style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
                            onClick={() => activity.question_link && window.open(activity.question_link, '_blank', 'noopener,noreferrer')}
                          >
                            {activity.question_name}
                          </div>
                          <div 
                            className="font-mono mt-1 flex items-center gap-4" 
                            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                          >
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(activity.solvedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(activity.solvedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg" 
                        style={{
                          fontSize: 'var(--text-xs)',
                          backgroundColor: levelBg,
                          color: levelColor,
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        {activity.difficulty}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12" style={{color: 'var(--text-secondary)'}}>
                <Target className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
                <div style={{fontSize: 'var(--text-base)'}}>No recent submissions.</div>
                <div style={{fontSize: 'var(--text-sm)', marginTop: 'var(--spacing-sm)'}}>Start solving problems to see your activity here!</div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
        editForm={editForm}
        setEditForm={setEditForm}
        uploading={uploading}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        handleDeleteImage={handleDeleteImage}
        handleSaveProfile={handleSaveProfile}
      />
      {/* USERNAME EDIT MODAL */}
      <EditUsernameModal
        isOpen={showUsernameEditModal}
        onClose={() => setShowUsernameEditModal(false)}
        usernameForm={usernameForm}
        setUsernameForm={setUsernameForm}
        handleSaveUsername={handleSaveUsername}
      />

      {/* TOPIC PROGRESS MODAL */}
      <TopicProgressModal
        isOpen={showTopicProgressModal}
        onClose={() => setShowTopicProgressModal(false)}
        username={username}
      />

      {/* CUSTOM CONFIRM DIALOG */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Profile Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove your profile image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteImage}
              disabled={uploading}
            >
              {uploading ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TOAST NOTIFICATIONS */}
      <Toast />
    </div>
  );
}