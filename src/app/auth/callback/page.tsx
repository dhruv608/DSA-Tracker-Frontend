"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { showError } from '@/ui/toast';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let hasRun = false;

    const handleGoogleCallback = async () => {
      if (hasRun) return;
      hasRun = true;

      try {
        setLoading(true);
        setError('');

        // Debug: Log all URL parameters
        // console.log('All URL params:', Object.fromEntries(searchParams.entries()));
        // console.log('Current URL:', window.location.href);
        // console.log('Hash fragment:', window.location.hash);

        // Extract credential from URL parameters (GIS redirect)
        const credential = searchParams.get('credential');
        
        // Also check for id_token in hash fragment
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const idToken = hashParams.get('id_token');

        // Check for error parameters first
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          const errorMsg = `Google OAuth Error: ${errorDescription || error}`;
          setError(errorMsg);
          showError(errorMsg);
          return;
        }

        const token = credential || idToken;
        
        if (!token) {
          setError('No credential received from Google');
          showError('Authentication failed: No credential received');
          return;
        }

        // Decode JWT to validate email domain
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (!payload.email?.endsWith('@pwioi.com')) {
          showError('Please use your PW student email to log in.');
          router.push('/login');
          return;
        }

        // Send token to backend for verification using your backend route
        const data = await studentAuthService.googleLogin(token);

        if (data.accessToken) {
          // Store access token securely
          localStorage.setItem('accessToken', data.accessToken);
          document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=strict`;

          // Handle post-login routing
          if (!data.user.leetcode_id || !data.user.gfg_id || !data.user.username) {
            localStorage.setItem('onboardingUser', JSON.stringify(data.user));
            router.push('/onboarding');
          } else {
            router.push('/');
          }
        } else {
          setError('Login failed: No token received');
          showError('Authentication failed: No token received');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error ||
                            err.response?.data?.message ||
                            'Google login failed';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BruteForceLoader />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Authentication Failed
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="glass rounded-(--radius-md) px-6 py-2 text-foreground 
                       hover:scale-105 transition-all duration-200
                       border border-border"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
