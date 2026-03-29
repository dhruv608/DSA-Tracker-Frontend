"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { loginSuperAdmin } from '@/services/auth.service';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { showLoginPromise } from '@/utils/toast-system';

export default function SuperAdminLoginPage() {
  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      const loginPromise = loginSuperAdmin({ email, password });
      
      // Show promise toast and wait for it to complete
      await showLoginPromise(loginPromise);
      
      // After successful toast, get actual data
      const data = await loginPromise;
      
      const { accessToken } = data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        document.cookie = `accessToken=${accessToken}; path=/`;
      }
      
      router.push('/superadmin');
    } catch (err: any) {
      // Error is already handled by showLoginPromise
      // console.error('Superadmin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 blur-[120px]" />
      </div>
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8 glass card-premium">
        <div className="mb-8 text-center space-y-3">
         
          <h1 className="font-serif italic text-4xl font-bold text-logo tracking-tight">
            BruteForce
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Super Admin Portal</p>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="admin@bruteforce.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 pr-12 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </span>
          </button>
          
        </form>
      </div>
    </div>
  );
}
