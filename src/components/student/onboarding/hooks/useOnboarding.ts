import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../../app/(auth)/shared/hooks/useToast';
import { useLocalStorage } from '../../../../app/(auth)/shared/hooks/useLocalStorage';
import { handleError } from "@/utils/handleError";

export function useOnboarding() {
  const router = useRouter();
  const { showToast } = useToast();
  const [onboardingUser] = useLocalStorage<any>('onboardingUser', null);
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ username: '', leetcode_id: '', gfg_id: '', linkedin: '', github: '' });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!onboardingUser) {
      router.push('/login');
    } else {
      setData(prev => ({
        ...prev,
        username: onboardingUser.username || '',
        leetcode_id: onboardingUser.leetcode_id || '',
        gfg_id: onboardingUser.gfg_id || ''
      }));
    }
  }, [onboardingUser, router]);

  const submitOnboarding = async () => {
    if (!confirmChecked) { showToast("Please confirm that your usernames are correct.", 'error'); return; }
    setLoading(true);
    try {
      // Only send profile data, no city_id/batch_id needed for /me endpoint
      const payload = {
        leetcode_id: data.leetcode_id,
        gfg_id: data.gfg_id,
        linkedin: data.linkedin,
        github: data.github,
        username: data.username
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save profile.");
      showToast("Profile completed successfully. Welcome!", "success");
      // Clear localStorage 
      localStorage.removeItem('onboardingUser');
      router.push('/');
    } catch (err) {
      handleError(err);
      showToast("Profile verification failed.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return { step, setStep, data, setData, confirmChecked, setConfirmChecked, loading, submitOnboarding };
}
