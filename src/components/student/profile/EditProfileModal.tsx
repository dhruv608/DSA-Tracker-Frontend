"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold tracking-tight">Edit Profile</DialogTitle>
          <DialogDescription className="hidden">Update your profile information</DialogDescription>
          
        </DialogHeader>

        <div className="p-5 space-y-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
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
            <Input
              type="url"
              value={editForm.github}
              onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="https://github.com/username"
              className="w-full rounded-2xl"
              style={{
                height: 'var(--spacing-lg)',
                border: '1px solid var(--border)',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: 'var(--text-base)',
                padding: '16px 20px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              LinkedIn URL
            </label>
            <Input
              type="url"
              value={editForm.linkedin}
              onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-2xl"
              style={{
                height: 'var(--spacing-lg)',
                border: '1px solid var(--border)',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: 'var(--text-base)',
                padding: '16px 20px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
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

        </div>

        <DialogFooter className="p-5 pt-1">
          <div className="flex gap-2 w-full">
            <Button onClick={handleSaveWithToast} disabled={savingProfile} className="flex-1">
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button onClick={onClose} variant="outline" size="default" className="flex-1 py-5!">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
