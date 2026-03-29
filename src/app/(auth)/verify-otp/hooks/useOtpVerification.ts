import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { glassToast } from "@/utils/toast-system";

export function useOtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [fpOtpArray, setFpOtpArray] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const firstOtpInputRef = useRef<HTMLInputElement>(null);

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
    if (value.length > 1) value = value[value.length - 1]; // ensure 1 digit
    const newOtp = [...fpOtpArray];
    newOtp[index] = value;
    setFpOtpArray(newOtp);
    if (value && index < 5) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !fpOtpArray[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtpLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpJoined = fpOtpArray.join('');
    if (otpJoined.length < 6) { 
        glassToast.error("Invalid OTP ❌"); 
        setError("Please enter the 6-digit OTP."); 
        return; 
    }
    setError('');
    glassToast.success("OTP format valid ✅");
    router.push(`/reset-password?email=${encodeURIComponent(emailParam || '')}&otp=${otpJoined}`);
  };

  return { email: emailParam, fpOtpArray, error, loading, handleOtpChange, handleOtpKeyDown, handleVerifyOtpLocal, router, firstOtpInputRef };
}
