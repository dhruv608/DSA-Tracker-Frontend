import { useState, useEffect } from 'react';
import { glassToast, handleToastError } from "@/utils/toast-system";

export function useOnboardingModal(onComplete?: () => void) {
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({ username: '', leetcode_id: '', gfg_id: '', linkedin: '', github: '', city_id: null, batch_id: null });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debug step changes
  const handleSetStep = (newStep: number) => {
    console.log("Step changing from", step, "to", newStep);
    setStep(newStep);
  };

  const submitOnboarding = async () => {
    if (!confirmChecked) { 
      glassToast.error("Please confirm that your usernames are correct."); 
      return; 
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log("Token for onboarding submission:", token ? "exists" : "missing");
      
      if (!token) {
        glassToast.error("Authentication token missing. Please log in again.");
        return;
      }
      
      // Only send profile data, no city_id/batch_id needed for /me endpoint
      const payload = {
        leetcode_id: data.leetcode_id,
        gfg_id: data.gfg_id,
        linkedin: data.linkedin,
        github: data.github,
        username: data.username
      };
      
      console.log("Submitting onboarding payload:", payload);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/me`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        
        if (res.status === 401) {
          glassToast.error("Session expired. Please log in again.");
          // Optionally redirect to login
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to save profile.`);
        }
        return;
      }
      
      glassToast.success("Profile completed successfully. Welcome!");
      
      // Dispatch custom event to notify StudentHeader and page to refresh
      window.dispatchEvent(new Event('profileUpdated'));
      
      // Call onComplete callback to close modal and refresh data
      if (onComplete) {
        onComplete();
      }
      
    } catch (err) {
      handleToastError(err);
      glassToast.error("Profile verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return { step, setStep: handleSetStep, data, setData, confirmChecked, setConfirmChecked, loading, submitOnboarding };
}
