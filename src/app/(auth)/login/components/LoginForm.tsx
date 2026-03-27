"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

/* ================= LOGIN FORM ================= */

export function LoginForm() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [, setOnboardingUser] = useLocalStorage('onboardingUser', null);

  const processPostLogin = (u: any) => {
    if (!u.id || !u.leetcode_id || !u.gfg_id || !u.username) {
      setOnboardingUser(u);
    }
    router.push('/');
  };

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
        processPostLogin(data.user);
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Invalid credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 
          bg-red-500/10 border border-red-500/20 text-red-400 text-sm 
          rounded-xl backdrop-blur-md animate-pulse">
          {error}
        </div>
      )}

      {/* EMAIL */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground tracking-wide">
          Email or Username
        </label>

        <Input
          type="text"
          placeholder="student@example.com or username"
          value={emailOrUsername}
          onChange={e => setEmailOrUsername(e.target.value)}
          disabled={loading}
          className="h-11 rounded-lg bg-input border border-border 
            focus:border-primary focus:shadow-[0_0_0_2px_rgba(204,255,0,0.2)] 
            transition-all"
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground tracking-wide">
            Password
          </label>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push('/forgot-password');
            }}
            className="text-primary font-medium text-xs hover:underline hover:text-primary/80 transition"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            className="h-11 bg-input border border-border rounded-lg pr-10
              focus:border-primary focus:shadow-[0_0_0_2px_rgba(204,255,0,0.2)]
              transition-all"
          />

          {/* 👁️ */}
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
              text-muted-foreground hover:text-primary transition"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-sm font-semibold tracking-wide 
          bg-primary text-primary-foreground 
          hover:shadow-[0_0_20px_var(--hover-glow)] 
          transition-all duration-200 
          active:scale-[0.97]"
      >
        {loading ? (
          <span className="animate-pulse">Authenticating...</span>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </div>
        )}
      </Button>

    </form>
  );
}

/* ================= AUTH SECTION ================= */

export function AuthSection({ GoogleAuthButton }: any) {
  return (
    <div className="w-full max-w-md mx-auto">

      {/* LOGO */}
      <div className="flex flex-col items-center justify-center text-center mb-10">

        <h1
          className="
            font-serif italic text-4xl font-bold
            bg-gradient-to-br from-primary via-primary to-amber-500
            bg-clip-text text-transparent
            tracking-tight leading-[1.1]
            drop-shadow-[0_0_10px_var(--hover-glow)]
            transition-all duration-300
          "
        >
          BruteForce
        </h1>

        <p className="mt-2 text-[13.5px] font-medium text-muted-foreground tracking-wide max-w-[260px]">
          Outwork. Outsolve. Outrank.
        </p>
      </div>

      {/* GOOGLE */}
      <div className="glass rounded-xl p-1 hover-glow">
        <GoogleAuthButton />
      </div>

      {/* DIVIDER */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center">
          <span className="px-4 py-1.5 text-[10px] uppercase 
            text-muted-foreground font-semibold tracking-[0.2em]
            glass-borderless rounded-full border border-border/60">
            Or continue with
          </span>
        </div>
      </div>

      {/* FORM */}
      <div className="glass rounded-2xl p-6 shadow-lg">
        <LoginForm />
      </div>

    </div>
  );
}