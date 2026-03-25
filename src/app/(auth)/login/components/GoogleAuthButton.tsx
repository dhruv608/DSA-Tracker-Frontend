"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function GoogleAuthButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOnboardingUser] = useLocalStorage('onboardingUser', null);

  const processPostLogin = (u: any) => {
    if (!u.leetcode_id || !u.gfg_id || !u.username) {
      setOnboardingUser(u);
    }
    router.push('/');
  };

  const handleGoogleCallback = async (idToken: string) => {
    setLoading(true);
    setError('');

    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));

      if (!payload.email?.endsWith('@pwioi.com')) {
        setError('Access denied: Use your @pwioi.com email.');
        setLoading(false);
        return;
      }

      const data = await studentAuthService.googleLogin(idToken);

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        processPostLogin(data.user);
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Google login failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const initGoogleLogin = () => {
    setError('');

    if (typeof window !== 'undefined' && (window as any).google) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

      if (!clientId) {
        setError('Google Client ID missing.');
        return;
      }

      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: any) => {
          if (res.credential) handleGoogleCallback(res.credential);
        },
      });
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      initGoogleLogin();
    }
  }, []);

  return (
    <>
      {/* GOOGLE SCRIPT */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleLogin}
      />

      {/* ERROR */}
      {error && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl justify-center">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* CUSTOM GOOGLE BUTTON */}
      <div className="w-full flex flex-col items-center gap-4 mb-6">

        <button
          onClick={() => {
            setError('');
            (window as any).google.accounts.id.prompt();
          }}
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border bg-background hover:bg-muted/40 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >

          {/* GOOGLE ICON */}
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.1l6-6C34.6 2.4 29.6 0 24 0 14.6 0 6.6 5.5 2.7 13.5l7.4 5.7C12.2 13.3 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4 7.1-9.9 7.1-17.2z"/>
            <path fill="#FBBC05" d="M10.1 28.8c-.6-1.7-1-3.5-1-5.3s.4-3.6 1-5.3l-7.4-5.7C1 16.6 0 20.2 0 24s1 7.4 2.7 10.5l7.4-5.7z"/>
            <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.7l-7.6-5.9c-2.1 1.4-4.8 2.2-8.4 2.2-6.3 0-11.8-3.8-13.9-9.3l-7.4 5.7C6.6 42.5 14.6 48 24 48z"/>
          </svg>

          {/* TEXT */}
          <span className="text-sm font-semibold text-foreground">
            {loading ? "Authenticating..." : "Continue with Google"}
          </span>

          {/* LOADER */}
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin ml-1" />
          )}
        </button>

        {/* TRUST TEXT */}
        <p className="text-[11px] text-muted-foreground">
          Secure login via Google OAuth
        </p>
      </div>
    </>
  );
}