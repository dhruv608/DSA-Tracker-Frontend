"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StudentHeader from '@/components/student/layout/StudentHeader';
import { studentProfileService } from '@/services/student/profile.service';

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const checkProfile = async () => {
      try {
        const profileData = await studentProfileService.getProfile();
        setProfile(profileData);
        // Only require complete profile if we actually loaded a profile and it is concretely missing the IDs
        const leetcode = profileData?.student?.leetcode || profileData?.student?.leetcode_id;
        const gfg = profileData?.student?.gfg || profileData?.student?.gfg_id;
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
      await studentProfileService.updateProfileDetails({
        leetcode_id: leetcodeId,
        gfg_id: gfgId
      });
      setShowProfileModal(false);
      // Optimistically update local profile state
      setProfile((prev: any) => ({ ...prev, leetcode_id: leetcodeId, gfg_id: gfgId }));
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
      <StudentHeader />
      
      <main className="flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-[420px] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-3xl mb-3 text-center">👤</div>
            <h2 className="font-serif italic text-2xl font-semibold text-center mb-1">
              Profile Not Completed
            </h2>
            <p className="text-[13px] text-muted-foreground text-center mb-6">
              Add your coding platform IDs to start tracking your progress. <br/>
              <strong className="text-amber-600 dark:text-amber-500">Note: You can only set these once.</strong>
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1 tracking-wide uppercase">
                  LeetCode ID
                </label>
                <input 
                  type="text" 
                  placeholder="your-leetcode-username"
                  className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2.5 text-[13.5px] outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  value={leetcodeId}
                  onChange={(e) => setLeetcodeId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1 tracking-wide uppercase">
                  GeeksforGeeks ID
                </label>
                <input 
                  type="text" 
                  placeholder="your-gfg-username"
                  className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2.5 text-[13.5px] outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  value={gfgId}
                  onChange={(e) => setGfgId(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-secondary border border-transparent transition-colors"
                >
                  Skip for Now
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving || (!leetcodeId && !gfgId)}
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {saving ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
