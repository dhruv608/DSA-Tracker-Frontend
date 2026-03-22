"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, User, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  
  // Step Management
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [batchId, setBatchId] = useState('');
  
  // Step 2 Data (Username)
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (step === 2 && username.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else if (username.length <= 2) {
      setIsAvailable(null);
    }
  }, [username, step]);

  const generateSuggestions = (baseName: string) => {
    const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanName) return;
    setSuggestions([
      `${cleanName}_dev`,
      `${cleanName}_dsa`,
      `${cleanName}codes`,
      `${cleanName}${Math.floor(Math.random() * 1000)}`
    ]);
  };

  const checkUsernameAvailability = async (uname: string) => {
    setCheckingUsername(true);
    try {
      // Hit public profile route. If 200, user exists. If 404, user doesn't exist.
      await api.get(`/api/students/profile/${uname}`);
      setIsAvailable(false); // It found a profile -> Taken
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setIsAvailable(true); // 404 -> Available!
      } else {
        setIsAvailable(false); // Unknown error, assume unavailable to be safe
      }
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !batchId) {
      setError("Please fill all fields, including Batch ID.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    generateSuggestions(name.split(' ')[0]);
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || isAvailable === false) {
      setError("Please choose a valid & available username.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await studentAuthService.register({ 
        name, 
        email, 
        username, 
        password,
        batch_id: Number(batchId)
      });
      
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        document.cookie = `accessToken=${data.accessToken}; path=/`; 
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed.');
      setStep(1); // Go back to show error
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/5 dark:bg-amber-900/10 blur-3xl pointer-events-none" />

      <div className="bg-card w-full max-w-[480px] p-8 sm:p-10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-border/80 z-10 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`} />
        </div>

        <div className="text-center mb-7">
          <h1 className="font-serif italic text-[32px] font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-1.5 shrink-0">
            {step === 1 ? "Join BruteForce" : "Create Username"}
          </h1>
          <p className="text-[13.5px] text-muted-foreground font-medium">
            {step === 1 ? "Start tracking, start climbing." : "This is how others will see you on the leaderboard."}
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
            {error}
          </div>
        )}

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="animate-in slide-in-from-left-4 fade-in duration-300">
            <Button 
              type="button"
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
              Register with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium tracking-widest">Or create account</span>
              </div>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                  Full Name
                </label>
                <Input 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-10 text-[13px] bg-muted/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    placeholder="you@college.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-10 text-[13px] bg-muted/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                    Batch Code / ID
                  </label>
                  <Input 
                    type="number" 
                    placeholder="E.g. 1"
                    value={batchId}
                    onChange={e => setBatchId(e.target.value)}
                    className="h-10 text-[13px] bg-muted/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                    Password
                  </label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-10 text-[13px] bg-muted/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                    Confirm
                  </label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="h-10 text-[13px] bg-muted/40"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide bg-secondary hover:bg-secondary/80 text-foreground shadow-sm transition-all"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: Username */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            
            <form onSubmit={handleRegister} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                  Choose Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="e.g. awesome_coder"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    disabled={loading}
                    className={`h-12 pl-10 pr-10 text-[15px] bg-muted/40 font-mono transition-colors focus-visible:ring-1 ${
                      isAvailable === true ? 'border-emerald-500/50 focus-visible:ring-emerald-500' :
                      isAvailable === false ? 'border-destructive/50 focus-visible:ring-destructive' : ''
                    }`}
                  />
                  
                  {/* Validation Indicators */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {checkingUsername ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    ) : isAvailable === true ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : isAvailable === false ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : null}
                  </div>
                </div>
                
                {/* Status Message */}
                <div className="h-5">
                  {checkingUsername ? (
                    <p className="text-[11px] text-muted-foreground">Checking availability...</p>
                  ) : isAvailable === true ? (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Username is available!</p>
                  ) : isAvailable === false ? (
                    <p className="text-[11px] text-destructive font-medium">This username is already taken.</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">Letters, numbers, and underscores only.</p>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && isAvailable !== true && (
                <div className="bg-secondary/40 p-4 rounded-xl border border-border/50">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setUsername(sug)}
                        className="px-3 py-1.5 bg-background border border-border rounded-lg text-[13px] font-mono hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="h-11 px-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={loading || isAvailable !== true}
                  className="flex-1 h-11 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                >
                  {loading ? 'Creating Account...' : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Complete Signup
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        )}

        <p className="text-center mt-6 text-[13px] text-muted-foreground font-medium">
          Already have an account? <Link href="/login" className="text-primary hover:underline transition-all">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
