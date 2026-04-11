"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle, User, AlertCircle, Shield } from 'lucide-react';
import { UsernameForm } from '@/types/student/index.types';
import { useUsernameCheck } from '@/components/student/onboarding/hooks/useUsernameCheck';

interface EditUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  usernameForm: UsernameForm;
  setUsernameForm: (form: UsernameForm) => void;
  handleSaveUsername: () => void;
  currentUsername?: string;
}

type UsernameStatus = "idle" | "typing" | "available" | "taken" | "invalid" | "same";

export function EditUsernameModal({
  isOpen,
  onClose,
  usernameForm,
  setUsernameForm,
  handleSaveUsername,
  currentUsername
}: EditUsernameModalProps) {
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { mutate: checkUsername, isPending } = useUsernameCheck();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedUsernameRef = useRef<string>("");

  // API CALL (after debounce) - Updated with same logic as OnboardingStep1
  useEffect(() => {
    const username = debouncedUsername.trim();
    const original = currentUsername?.trim();

    // 1️⃣ Empty
    if (username.length === 0) {
      setUsernameStatus("idle");
      return;
    }

    // 2️⃣ Same as existing username ✅
    if (username === original) {
      setUsernameStatus("same");
      return; 
    }

    // 3️⃣ Length validation
    if (username.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    // 4️⃣ Prevent duplicate calls
    if (username === lastCheckedUsernameRef.current) return;

    lastCheckedUsernameRef.current = username;

    // 5️⃣ API CALL
    checkUsername(
      { username },
      {
        onSuccess: (res) => {
          setUsernameStatus(res.available ? "available" : "taken");
        },
        onError: () => {
          setUsernameStatus("invalid");
        },
      }
    );
  }, [debouncedUsername, checkUsername, currentUsername]);

  // CONDITIONAL RENDER - Don't render if not open
  if (!isOpen) {
    return null;
  }

  // INPUT HANDLER - Same logic as OnboardingStep1
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsernameForm({ ...usernameForm, username: value });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.length > 0) {
      setUsernameStatus("typing");
    } else {
      setUsernameStatus("idle");
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedUsername(value);
      debounceTimerRef.current = null;
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSave && !isSaving) {
      e.preventDefault();
      handleSaveWithToast();
    }
  };

  const canSave = (usernameStatus === "available" || usernameStatus === "same") && usernameForm.username?.trim().length >= 3;

  // STATUS MESSAGE - Same logic as OnboardingStep1
  const getStatusMessage = () => {
    const base = "flex items-center gap-2 text-xs font-medium";

    switch (usernameStatus) {
      case "typing":
        return (
          <div className={`${base} text-muted-foreground`}>
            <span>Typing...</span>
          </div>
        );

      case "available":
        return (
          <div className={`${base} text-green-500`}>
            <CheckCircle size={14} />
            <span>Username is available</span>
          </div>
        );

      case "taken":
        return (
          <div className={`${base} text-red-500`}>
            <XCircle size={14} />
            <span>Username already taken</span>
          </div>
        );

      case "invalid":
        return (
          <div className={`${base} text-red-500`}>
            <XCircle size={14} />
            <span>Minimum 3 characters required</span>
          </div>
        );

      case "same":
        return (
          <div className={`${base} text-green-500`}>
            <CheckCircle size={14} />
            <span>Already yours</span>
          </div>
        );

      default:
        return null;
    }
  };

  // INPUT STYLES - Same logic as OnboardingStep1
  const getInputStyles = () => {
    const base =
      "w-full border  rounded-lg bg-background transition-all duration-300";

    switch (usernameStatus) {
      case "typing":
        return `${base} border-blue-400/30 ring-2 ring-blue-400/10`;

      case "available":
        return `${base} border-green-400/40 ring-2 ring-green-400/20 shadow-md shadow-green-500/10`;

      case "taken":
      case "invalid":
        return `${base} border-red-400/40 ring-2 ring-red-400/20 shadow-md shadow-red-500/10`;

      default:
        return `${base} border-border focus:ring-2 focus:ring-primary/40`;
    }
  };

  // HANDLE SAVE
  const handleSaveWithToast = async () => {
    if (!canSave) {
      return;
    }

    setIsSaving(true);
    try {
      await handleSaveUsername();
      onClose();
    } catch (error) {
      // Error is handled by API client interceptor
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  // HANDLE CLOSE WITH RESET
  const handleClose = () => {
    // Reset form when closing
    setUsernameForm({ username: '' });
    setUsernameStatus('idle');
    setDebouncedUsername('');
    onClose();
  };

  // HANDLE CANCEL
  const handleCancel = () => {
    // Reset form when cancelling
    setUsernameForm({ username: '' });
    setUsernameStatus('idle');
    setDebouncedUsername('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl border border-border w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-6 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Username</h2>
              <p className="text-xs text-muted-foreground">Update your profile identifier</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Username
            </label>
            <div className="relative group">
              <input
                type="text"
                value={usernameForm.username}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter new username"
                className={`${getInputStyles()} group-focus-within:shadow-lg pl-10`}
              />
              
              {/* LEFT ICON */}
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              
              {/* RIGHT ICON - Same logic as OnboardingStep1 */}
              {(usernameStatus === "available" || usernameStatus === "same") && (
                <CheckCircle
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                />
              )}

              {(usernameStatus === "taken" ||
                usernameStatus === "invalid") && (
                <XCircle
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                />
              )}

            </div>
            
            {/* STATUS MESSAGE */}
            <div className="min-h-[20px] transition-all duration-300">
              <div key={usernameStatus} className="animate-fade-in">
                {getStatusMessage()}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
              <Shield className="w-3 h-3" />
              <span>This will be your unique identifier for profile URLs</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSaveWithToast} 
              className="flex-1"
              disabled={!canSave || isPending || isSaving}
            >
              {isSaving ? (
                <>
                  Saving...
                </>
              ) : (
                <>
                  Save Username
                </>
              )}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
      
      {/* ANIMATION - Same as OnboardingStep1 */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
