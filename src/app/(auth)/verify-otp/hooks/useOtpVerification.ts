import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { showError, showSuccess } from '@/ui/toast';

export function useOtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [fpOtpArray, setFpOtpArray] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const firstOtpInputRef = useRef<HTMLInputElement>(null);
  
  // Array of refs for all OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    if (!emailParam) router.push('/forgot-password');
  }, [emailParam, router]);

  // Auto-focus first OTP input on mount
  useEffect(() => {
    setTimeout(() => {
      firstOtpInputRef.current?.focus();
    }, 100);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Allow only numbers and limit to 1 digit
    const numericValue = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newOtp = [...fpOtpArray];
    newOtp[index] = numericValue;
    setFpOtpArray(newOtp);
    
    // Auto-focus next input when digit is entered
    if (numericValue && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input if current is empty
    if (e.key === 'Backspace' && !fpOtpArray[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setFpOtpArray(newOtp);
      
      // Focus the last input
      setTimeout(() => {
        inputRefs.current[5]?.focus();
      }, 0);
    }
  };

  const handleVerifyOtpLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpJoined = fpOtpArray.join('');
    
    if (otpJoined.length < 6) {
        showError("Invalid OTP");
        setError("Please enter the 6-digit OTP.");
        return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Call backend to validate OTP
      const response = await studentAuthService.verifyOtp(emailParam || '', otpJoined);
      console.log('Full API response:', response);
console.log('Response valid:', response?.valid);
console.log('Response data:', response?.data);
      // Only redirect if OTP is actually valid
      if (response && (response.valid || response.data?.valid)) {
        showSuccess("OTP verified successfully");
        // Redirect to reset password page only after successful OTP validation
        router.push(`/reset-password?email=${encodeURIComponent(emailParam || '')}&otp=${otpJoined}`);
      } else {
        // Handle case where backend returns success: false
        const errorMessage = response?.message || 'Invalid OTP. Please try again.';
        setError(errorMessage);
        showError(errorMessage);
        setFpOtpArray(Array(6).fill(''));
        setTimeout(() => {
          firstOtpInputRef.current?.focus();
        }, 100);
      }
    } catch (err: any) {
      console.error('OTP validation error:', err);
      // Error is handled by API client interceptor
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      // Clear OTP inputs on validation failure
      setFpOtpArray(Array(6).fill(''));
      // Focus back to first input
      setTimeout(() => {
        firstOtpInputRef.current?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return { 
    email: emailParam, 
    fpOtpArray, 
    error, 
    loading, 
    handleOtpChange, 
    handleOtpKeyDown, 
    handlePaste,
    handleVerifyOtpLocal, 
    router, 
    firstOtpInputRef,
    inputRefs 
  };
}
