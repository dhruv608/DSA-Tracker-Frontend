import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email domain validation - only allow @pwioi.com
  const validateEmailDomain = (email: string): boolean => {
    const allowedDomain = "pwioi.com";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }
    
    const domain = email.split('@')[1];
    return domain === allowedDomain;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    
    // Validate email domain before sending to backend
    if (!validateEmailDomain(email)) {
      setError("Use your PW email to reset your password.");
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await studentAuthService.forgotPassword(email);
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, error, handleSendOtp };
}
