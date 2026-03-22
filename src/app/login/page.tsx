"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const isEmail = emailOrUsername.includes('@');
      const payload = isEmail 
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const data = await studentAuthService.login(payload);
      
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`; 
        router.push('/');
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      
      {/* Absolute Header for Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/5 dark:bg-amber-900/10 blur-3xl pointer-events-none" />

      <div className="bg-card w-full max-w-[440px] p-10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-border/80 z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <h1 className="font-serif italic text-4xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2 shrink-0">
            BruteForce
          </h1>
          <p className="text-[13.5px] text-muted-foreground font-medium">
            Outwork. Outsolve. Outrank.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleGoogleLogin} 
          className="w-full h-11 mb-6 text-[13.5px] font-medium transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/40"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium tracking-widest">Or continue with</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-foreground tracking-wide">
              Email or Username
            </label>
            <Input 
              type="text" 
              placeholder="you@college.edu or username"
              value={emailOrUsername}
              onChange={e => setEmailOrUsername(e.target.value)}
              disabled={loading}
              className="h-11 bg-muted/40"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-semibold text-foreground tracking-wide">
                Password
              </label>
              <Link href="/forgot-password" className="text-primary font-medium text-[12px] hover:underline transition-all">
                Forgot password?
              </Link>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 bg-muted/40"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-6 text-[13px] text-muted-foreground font-medium">
          New to BruteForce? <Link href="/register" className="text-primary hover:underline transition-all">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
