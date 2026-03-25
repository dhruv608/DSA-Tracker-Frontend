"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ProfileEditForm, StudentProfile } from '@/types/student';


interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  editForm: ProfileEditForm;
  setEditForm: (form: ProfileEditForm) => void;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement |null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: () => void;
  handleSaveProfile: () => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  student,
  editForm,
  setEditForm,
  uploading,
  fileInputRef,
  handleImageUpload,
  handleDeleteImage,
  handleSaveProfile
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl border border-border w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden">
                {student.profileImageUrl ? (
                  <img src={student.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 text-white flex items-center justify-center text-sm font-bold">
                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {uploading ? 'Uploading...' : (student.profileImageUrl ? 'Change Image' : 'Add Image')}
                </Button>
                {student.profileImageUrl && (
                  <Button
                    onClick={handleDeleteImage}
                    disabled={uploading}
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 text-destructive hover:text-destructive"
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <input
              type="url"
              value={editForm.github}
              onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full border border-border p-3 rounded-lg bg-background"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <input
              type="url"
              value={editForm.linkedin}
              onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full border border-border p-3 rounded-lg bg-background"
            />
          </div>

          {/* Non-Editable Fields */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-3">The following fields cannot be edited. Contact admin to make changes.</p>
            
            {/* LeetCode ID */}
            <div className="space-y-2 mb-3">
              <label className="text-sm font-medium text-muted-foreground">LeetCode ID</label>
              <input
                type="text"
                value={student.leetcode || 'Not set'}
                disabled
                className="w-full border border-border p-3 rounded-lg bg-muted/50 text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>

            {/* GFG ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">GeeksforGeeks ID</label>
              <input
                type="text"
                value={student.gfg || 'Not set'}
                disabled
                className="w-full border border-border p-3 rounded-lg bg-muted/50 text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSaveProfile} disabled={uploading} className="flex-1">
              {uploading ? 'Saving...' : 'Save Changes'}
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