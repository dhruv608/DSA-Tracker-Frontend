"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, Trash2, Github, Linkedin, Lock } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { ProfileEditForm, StudentProfile } from '@/types/student/index.types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  editForm: ProfileEditForm;
  setEditForm: (form: ProfileEditForm) => void;
  uploading: boolean;
  savingProfile: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: () => void;
  handleSaveProfile: () => void;
  imagePreview: string | null;
  imageRemoved: boolean;
}

export function EditProfileModal({
  isOpen,
  onClose,
  student,
  editForm,
  setEditForm,
  uploading,
  savingProfile,
  fileInputRef,
  handleImageUpload,
  handleDeleteImage,
  handleSaveProfile,
  imagePreview,
  imageRemoved,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  const handleSaveWithToast = async () => {
    try {
      await handleSaveProfile();
      onClose();
    } catch (error) {
      // Error is handled by API client interceptor
      console.error('Profile update error:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveWithToast();
    }
  };

  return (
    <div className="fixed inset-0 glass backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl  w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-border">
          <h2 className="text-lg font-semibold tracking-tight">Edit Profile</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative  ">
              <div className="w-20 h-20 rounded-full   overflow-hidden shadow-md">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : imageRemoved ? (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                ) : student.profileImageUrl ? (
                  <img src={student.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || savingProfile}
                className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || savingProfile}
                className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors disabled:opacity-50"
              >
                {uploading || savingProfile ? 'Processing…' : imagePreview || imageRemoved ? 'Change photo' : student.profileImageUrl ? 'Change photo' : 'Upload photo'}
              </button>
              {(student.profileImageUrl || imagePreview || imageRemoved) && (
                <>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <button
                    onClick={handleDeleteImage}
                    disabled={uploading || savingProfile}
                    className="text-sm font-medium text-destructive hover:underline underline-offset-4 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* GitHub */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
               GitHub URL
            </label>
            <input
              type="url"
              value={editForm.github}
              onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="https://github.com/username"
              className="w-full border border-border px-3 py-2 rounded-2xl bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={editForm.linkedin}
              onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="https://linkedin.com/in/username"
              className="w-full border border-border px-3 py-2 rounded-2xl bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Locked fields */}
          <div className="rounded-2xl border border-border px-4 py-3 grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Fields locked · contact admin to update</span>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground flex items-center gap-2">
                <LeetCodeIcon className="w-3 h-3 text-leetcode" />
                LeetCode ID
              </label>
              <div className="border border-border px-3 py-2 rounded-2xl bg-muted/20 text-sm text-muted-foreground">
                {student.leetcode || '—'}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground flex items-center gap-2">
                <GeeksforGeeksIcon className="w-3 h-3 text-gfg" />
                GFG ID
              </label>
              <div className="border border-border px-3 py-2 rounded-2xl bg-muted/20 text-sm text-muted-foreground">
                {student.gfg || '—'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSaveWithToast} disabled={savingProfile} className="flex-1">
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
