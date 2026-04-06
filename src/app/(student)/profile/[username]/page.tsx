"use client";



import React, { useEffect, useState, useRef } from 'react';

import { useParams } from 'next/navigation';

import { studentProfileService } from '@/services/student/profile.service';

import { studentAuthService } from '@/services/student/auth.service';

import { ErrorHandler } from '@/lib/error-handler';

import { Button } from '@/components/ui/button';

import { X, Trash2 } from 'lucide-react';

import {

  ProfileDataState,

  CurrentUserState,

  ApiError

} from '@/types/student';

import { EditProfileModal } from '@/components/student/profile/EditProfileModal';

import { EditUsernameModal } from '@/components/student/profile/EditUsernameModal';



import { ProfilePageShimmer } from '@/components/student/profile/shimmers';

import { ProfileHeader } from '@/components/student/profile/ProfileHeader';

import { ProfileNotFound } from '@/components/student/profile/ProfileNotFound';

import { OverviewStats } from '@/components/student/profile/OverviewStats';

import { ProfileInfo } from '@/components/student/profile/ProfileInfo';

import { SocialLinks } from '@/components/student/profile/SocialLinks';

import { ProblemSolvingStats } from '@/components/student/profile/ProblemSolvingStats';

import ActivityHeatmap from '@/components/student/profile/ActivityHeatmap';

import { RecentActivity } from '@/components/student/profile/RecentActivity';

import TopicProgressModal from '@/components/student/topics/TopicProgressModal';

import { handleToastError, showSuccess, showDeleteSuccess, glassToast } from '@/utils/toast-system';

import { toast } from '@/utils/toast';



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

      if (localStorage.getItem('accessToken') || document.cookie.split('; ').find(row => row.startsWith('accessToken='))) {

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

      const user = await studentAuthService.getCurrentStudent().catch((e: any) => {

        console.error("Failed to fetch current user", e);

        console.error("Error details:", e.response?.data, e.response?.status);

        return null;

      });



      setCurrentUser(user);



      if (user?.error === "Access denied. Students only.") {

        setCurrentUser(null);

        return;

      }



    } catch (error: unknown) {

      handleToastError(error);

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

      const apiError = err as ApiError;

      const userError = ErrorHandler.handle(apiError, 'fetchProfileByUsername');



      // Check if it's a student not found error

      const isStudentNotFoundError =

        apiError?.response?.status === 404 ||           // HTTP status

        (err as any)?.code === 'STUDENT_PROFILE_NOT_FOUND' || // Custom error code from service

        userError.message === "Student not found";       // Fallback message



      // Show toast for student not found using the user-friendly message

      // if (isStudentNotFoundError) {

      //   glassToast.error(userError.message); // Show the corrected "Student not found" message

      // } else {

      //   handleToastError(err); // Use regular error handling for other errors

      // }

      setProfileError(userError.message);

    } finally {

      setLoading(false);

      isFetching.current = false;

    }

  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];



    // Check if user can edit before proceeding

    if (!canEdit()) {

      handleToastError({ message: 'You do not have permission to edit this profile.' });

      if (fileInputRef.current) fileInputRef.current.value = '';

      return;

    }



    // Validate file type (no videos)

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!validImageTypes.includes(file.type)) {

      handleToastError({ message: 'Please select a valid image file (JPG, PNG, GIF, WebP). Videos are not allowed.' });

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

        handleToastError(e);

        console.log('Token decode failed:', e);

      }

    }



    const isOwner5 = tokenUsername === profileData.student.username;

    return isOwner1 || isOwner2 || isOwner5;

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



      // Show success message based on what was updated

      const updates = [];

      if (needsImageUpload) updates.push('Profile image');

      if (needsImageDelete) updates.push('Profile image removed');

      if (needsProfileUpdate) updates.push('Profile details');



      // if (updates.length > 0) {

      //   showSuccess(`${updates.join(', ')} updated successfully!`);

      // }



    } catch (error) {

      handleToastError(error);

      ErrorHandler.showAlert(error, 'handleSaveProfile');

    } finally {

      setSavingProfile(false);

    }

  };



  const handleSaveUsername = async () => {

    try {

      if (!usernameForm.username.trim()) {

        toast.error('Username cannot be empty');

        return;

      }



      const localStorageToken = localStorage.getItem('accessToken');

      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

      const token = localStorageToken || cookieToken;



      if (!token) {

        toast.error('Please log in to update your username.');

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



      // Trigger StudentHeader refresh

      window.dispatchEvent(new CustomEvent('profileUpdated'));



      const newUsername = usernameForm.username.trim();

      if (newUsername !== username) {

        window.location.href = `/profile/${newUsername}`;

      }

    } catch (error: unknown) {

      handleToastError(error);

      if (error instanceof Error) {

        if (error.message === 'Token refresh failed' ||

          error.message.includes('401') ||

          error.message.includes('Unauthorized')) {

          toast.error('Your session has expired. Please log in again to update your username.');

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



  const handleDeleteImage = () => {

    setShowDeleteConfirm(true);

  };



  const confirmDeleteImage = () => {

    // Check if user can edit before proceeding

    if (!canEdit()) {

      handleToastError({ message: 'You do not have permission to edit this profile.' });

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

      {showDeleteConfirm && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-background rounded-2xl border border-border w-full max-w-sm shadow-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">

                <Trash2 className="w-5 h-5 text-red-500" />

              </div>

              <div>

                <h3 className="font-semibold">Remove Profile Photo</h3>

                <p className="text-sm text-muted-foreground">You can cancel this change before saving.</p>

              </div>

            </div>

            <div className="flex gap-2">

              <Button

                onClick={confirmDeleteImage}

                disabled={uploading}

                variant="destructive"

                className="flex-1"

              >

                {uploading ? 'Removing…' : 'Remove Photo'}

              </Button>

              <Button

                onClick={() => setShowDeleteConfirm(false)}

                variant="outline"

                className="flex-1"

                disabled={uploading}

              >

                Cancel

              </Button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}