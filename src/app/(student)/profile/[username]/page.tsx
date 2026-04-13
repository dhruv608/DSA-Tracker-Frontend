"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { studentProfileService } from '@/services/student/profile.service';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '@/components/ui/button';
import {ProfileDataState, CurrentUserState, ApiError} from '@/types/student/index.types';
import { EditProfileModal } from '@/components/student/profile/EditProfileModal';
import { EditUsernameModal } from '@/components/student/profile/EditUsernameModal';
import { DeleteImageModal } from '@/components/student/profile/DeleteImageModal';
import { ProfilePageShimmer } from '@/components/student/profile/shimmers';
import { ProfileHeader } from '@/components/student/profile/ProfileHeader';
import { ProfileNotFound } from '@/components/student/profile/ProfileNotFound';
import { ProfileErrorState } from '@/components/student/profile/ProfileErrorState';
import { OverviewStats } from '@/components/student/profile/OverviewStats';
import { ProfileInfo } from '@/components/student/profile/ProfileInfo';
import { SocialLinks } from '@/components/student/profile/SocialLinks';
import { ProblemSolvingStats } from '@/components/student/profile/ProblemSolvingStats';
import ActivityHeatmap from '@/components/student/profile/ActivityHeatmap';
import { RecentActivity } from '@/components/student/profile/RecentActivity';
import TopicProgressModal from '@/components/student/topics/TopicProgressModal';
import { showSuccess } from '@/ui/toast';
import { getErrorMessage } from '@/errors';
import { useCanEditProfile } from '@/hooks/useCanEditProfile';



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

  const [originalEditForm, setOriginalEditForm] = useState({
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

  const canEdit = useCanEditProfile({
    authChecked,
    currentUser,
    profileStudent: profileData?.student,
  });

  const [showTopicProgressModal, setShowTopicProgressModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFetching = useRef(false);

  // Image management states

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageRemoved, setImageRemoved] = useState(false);



  useEffect(() => {

    const initializeProfile = async () => {

      // Always fetch profile data first

      await fetchProfileByUsername();



      // Only try to fetch current user if we have a valid student token
      // Admin tokens should not call getCurrentStudent() as it will fail
      const { isStudentToken } = await import('@/lib/auth-utils');
      if (isStudentToken()) {
        await fetchCurrentUser().catch(() => {
          // Silently fail auth check - profile should still be viewable
          setCurrentUser(null);
          setAuthChecked(true);
        });
      } else {
        setCurrentUser(null);
        setAuthChecked(true);
      }

    };

    initializeProfile();

  }, [username]);



  const fetchCurrentUser = async () => {

    try {

      const user = await studentAuthService.getCurrentStudent().catch((e: unknown) => {

        console.error("Failed to fetch current user", e);

        const error = e as { response?: { data?: unknown; status?: number } };
        console.error("Error details:", error.response?.data, error.response?.status);

        return null;

      });



      setCurrentUser(user);



      if (user?.error === "Access denied. Students only.") {

        setCurrentUser(null);

        return;

      }



    } catch (error: unknown) {

      // Error is handled by API client interceptor
      if (error instanceof Error) {
        if (error.message === "Access denied. Students only.") {
          setCurrentUser(null);
          return;
        }
      }

    } finally {
      setAuthChecked(true);
    }

  };



  const fetchProfileByUsername = async () => {

    if (!username) return;

    // Skip if already fetching
    if (isFetching.current) return;

    setLoading(true);

    setProfileError(null);

    isFetching.current = true;

    try {

      const data = await studentProfileService.getProfileByUsername(username);

      setProfileData(data);

      const formValues = {

        name: data?.student?.name || '',

        github: data?.student?.github || '',

        linkedin: data?.student?.linkedin || '',

        leetcode: data?.student?.leetcode || '',

        gfg: data?.student?.gfg || ''

      };

      setEditForm(formValues);

      setOriginalEditForm(formValues);

      setUsernameForm({

        username: data?.student?.username || ''

      });

      // Reset image states when profile loads

      setSelectedImage(null);

      setImagePreview(null);

      setImageRemoved(false);

    } catch (err: unknown) {
      // Get user-friendly error message
      const errorMessage = getErrorMessage(err, { context: 'fetchProfileByUsername' });

      // Check if it's a student not found error
      const apiError = err as ApiError;
      const isStudentNotFoundError =
        apiError?.response?.status === 404 ||
        (err as { code?: string })?.code === 'STUDENT_PROFILE_NOT_FOUND' ||
        errorMessage === "Student not found";

      setProfileError(errorMessage);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }

  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];



    // Check if user can edit before proceeding
    if (!canEdit) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }



    // Validate file type (no videos)

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      // Validation error - component handles this directly
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }



    // Create preview and set state (no API call yet)

    const reader = new FileReader();

    reader.onload = (event) => {

      const previewUrl = event.target?.result as string;

      setImagePreview(previewUrl);

      setSelectedImage(file);

      setImageRemoved(false); // Reset removed state if user selects new image

    };

    reader.readAsDataURL(file);



    // Clear file input

    if (fileInputRef.current) fileInputRef.current.value = '';

  };



  const handleSaveProfile = async () => {

    try {

      setSavingProfile(true);

      // Check what needs to be updated

      const needsImageUpload = selectedImage !== null;

      const needsImageDelete = imageRemoved;

      const needsProfileUpdate =
        editForm.github !== originalEditForm.github ||
        editForm.linkedin !== originalEditForm.linkedin;

      // Make API calls only for what changed

      if (needsImageUpload) {
        await studentProfileService.updateProfileImage(selectedImage);
      }

      if (needsImageDelete) {
        await studentProfileService.deleteProfileImage();
      }

      if (needsProfileUpdate) {
        await studentProfileService.updateProfileDetails({
          github: editForm.github,
          linkedin: editForm.linkedin
        });
      }

      // Refresh profile data and close modal

      await fetchProfileByUsername();
      setShowEditModal(false);

      // Trigger StudentHeader refresh

      window.dispatchEvent(new CustomEvent('profileUpdated'));

      // Show success message

      showSuccess('Profile updated successfully!');
    } catch (error) {
      // Error is handled by API client interceptor
      console.log(error)
    } finally {
      setSavingProfile(false);
    }

  };



  const handleSaveUsername = async () => {

    try {

      if (!usernameForm.username.trim()) {
        return;
      }

      const localStorageToken = localStorage.getItem('accessToken');
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const token = localStorageToken || cookieToken;

      if (!token) {
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

      window.dispatchEvent(new CustomEvent('profileUpdated'));

      const newUsername = usernameForm.username.trim();
      if (newUsername !== username) {
        window.location.href = `/profile/${newUsername}`;
      }

      showSuccess('Username updated successfully!');
    } catch (error: unknown) {
      // Error is handled by API client interceptor
      console.log(error)
    }
  };



  const handleDeleteImage = () => {

    setShowDeleteConfirm(true);

  };



  const confirmDeleteImage = () => {

    // Check if user can edit before proceeding
    if (!canEdit) {
      setShowDeleteConfirm(false);
      return;
    }

    // Preview-only: update state to show removal, no API call yet

    setImageRemoved(true);

    setImagePreview(null);

    setSelectedImage(null);

    setShowDeleteConfirm(false);

  };



  if (loading) {

    return <ProfilePageShimmer />;

  }



  // Only show generic error page for non-student-not-found errors

  if (profileError && !profileError.includes("Student not found")) {
    return <ProfileErrorState error={profileError} />;
  }



  if (!profileData || !profileData.student) {

    return <ProfileNotFound username={username || undefined} error={profileError || undefined} />;

  }



  const { student, codingStats, streak, leaderboard, recentActivity, heatmap, heatmapStartMonth } = profileData || {

    student: {},

    codingStats: {},

    streak: {},

    leaderboard: {},

    recentActivity: [],

    heatmap: [],

    heatmapStartMonth: undefined

  };



  return (

    <div className="w-full max-w-325 xl:max-w-275 2xl:max-w-325  mx-auto pb-16 mt-3">

      {/* PROFILE HEADER */}

      <ProfileHeader

        student={student}

        canEdit={canEdit}

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

            canEdit={canEdit}

            onEditSocialLinks={() => setShowEditModal(true)}

          />

        </div>



        {/* RIGHT COLUMN */}

        <div className="lg:col-span-3 space-y-8">

          {/* PROBLEM SOLVING STATS */}

          <ProblemSolvingStats codingStats={codingStats} />



          {/* ACTIVITY HEATMAP */}

          <ActivityHeatmap

            heatmap={heatmap || []}

            currentStreak={streak?.currentStreak}

            maxStreak={streak?.maxStreak}

          />



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

        imagePreview={imagePreview}

        imageRemoved={imageRemoved}

      />



      <EditUsernameModal

        isOpen={showUsernameEditModal}

        onClose={() => setShowUsernameEditModal(false)}

        usernameForm={usernameForm}

        setUsernameForm={setUsernameForm}

        handleSaveUsername={handleSaveUsername}

        currentUsername={currentUser?.data?.username}

      />



      <TopicProgressModal

        isOpen={showTopicProgressModal}

        onClose={() => setShowTopicProgressModal(false)}

        username={username}

      />



      {/* Delete Image Confirmation Dialog */}
      <DeleteImageModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteImage}
        uploading={uploading}
      />

    </div>

  );

}