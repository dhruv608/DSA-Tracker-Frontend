import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { glassToast, handleToastError, showSuccess } from '@/utils/toast-system';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      glassToast.error("Please enter your email.");
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await studentAuthService.forgotPassword(email);
      glassToast.success("Email sent successfully ✅");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      handleToastError(err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP.';
      setError(msg);
      glassToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, error, handleSendOtp };
}
