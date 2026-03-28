import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { useToast } from '../../shared/hooks/useToast';
import { handleError } from "@/utils/handleError";

export function useForgotPassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email.", 'error');
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await studentAuthService.forgotPassword(email);
      showToast("Email sent successfully ✅");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      handleError(err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, error, handleSendOtp };
}
