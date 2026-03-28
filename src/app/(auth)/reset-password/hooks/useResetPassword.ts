import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { useToast } from '../../shared/hooks/useToast';
import { handleError } from "@/utils/handleError";

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const otpParam = searchParams.get('otp');
  const { showToast } = useToast();

  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailParam || !otpParam) {
      router.push('/forgot-password');
    }
  }, [emailParam, otpParam, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Reset password attempt started');
    console.log('📧 Email:', emailParam);
    console.log('🔑 OTP:', otpParam);
    console.log('🔒 New Password length:', fpNewPassword.length);
    
    if (!fpNewPassword) {
      console.log('❌ Validation failed: No password provided');
      showToast("Please enter a new password.", 'error');
      setError("Please enter a new password.");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      console.log('❌ Validation failed: Passwords do not match');
      showToast("Passwords do not match.", 'error');
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      console.log('📡 Making API call to reset password...');
      const resetData = {
        email: emailParam || '',
        otp: otpParam || '',
        newPassword: fpNewPassword
      };
      console.log('📤 Request data:', { ...resetData, newPassword: '[HIDDEN]' });
      
      const response = await studentAuthService.resetPassword(resetData);
      console.log('✅ API Response received:', response);
      console.log('📊 Response status:', response);
      
      showToast("Password reset successful ✅", "success");
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      handleError(err);
      console.log('❌ API Error occurred:', err);
      console.log('📊 Error response:', err.response);
      console.log('📊 Error status:', err.response?.status);
      console.log('📊 Error data:', err.response?.data);
      
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to reset password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
      console.log('🏁 Reset password process completed');
    }
  };

  return { fpNewPassword, setFpNewPassword, fpConfirmPassword, setFpConfirmPassword, error, loading, handleResetPassword, router };
}
