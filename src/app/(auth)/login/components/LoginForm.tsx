"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

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
    <form onSubmit={handleLogin} className="space-y-5">

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* EMAIL / USERNAME */}
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
          className="h-11 rounded-lg"
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
            className="text-primary font-medium text-xs hover:underline transition"
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
            className="h-11 rounded-lg pr-10"
          />

          {/* 👁️ TOGGLE */}
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
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
        className="w-full h-11 text-sm font-semibold tracking-wide"
      >
        {loading ? (
          "Authenticating..."
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </>
        )}
      </Button>

    </form>
  );
}