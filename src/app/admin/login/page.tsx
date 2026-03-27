"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/auth.service';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginAdmin({ email, password });
      const { accessToken } = data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        document.cookie = `accessToken=${accessToken}; path=/`;
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 blur-[120px]" />
      </div>

      {/* CARD */}
      <div className="relative w-full max-w-md glass card-premium p-8 rounded-2xl">

        {/* HEADER */}
        <div className="mb-8 text-center space-y-3">
          <h1 className="font-serif italic text-4xl font-bold text-logo tracking-tight">
            BruteForce
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Admin Portal
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-background/60 border border-border/60 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              placeholder="admin@bruteforce.com"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 pr-10 bg-background/60 border border-border/60 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                placeholder="••••••••"
              />

              {/* 👁️ EYE BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
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
      </div>
    </div>
  );
}