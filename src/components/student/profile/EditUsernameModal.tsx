"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { UsernameForm } from '@/types/student';


interface EditUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  usernameForm: UsernameForm;
  setUsernameForm: (form: UsernameForm) => void;
  handleSaveUsername: () => void;
}

export function EditUsernameModal({
  isOpen,
  onClose,
  usernameForm,
  setUsernameForm,
  handleSaveUsername
}: EditUsernameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl border border-border w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Username</h2>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={usernameForm.username}
              onChange={(e) => setUsernameForm({ ...usernameForm, username: e.target.value })}
              placeholder="username"
              className="w-full border border-border p-3 rounded-lg bg-background"
            />
            <p className="text-xs text-muted-foreground">
              This will be your unique identifier for profile URLs
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSaveUsername} className="flex-1">
              Save Username
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