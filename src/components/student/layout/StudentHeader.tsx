"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home, BookOpen, PenTool, Trophy, Lock, Activity } from 'lucide-react';
import { useRecentQuestions } from '@/contexts/RecentQuestionsContext';
import { handleError } from "@/utils/handleError";

export default function StudentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toggleSidebar } = useRecentQuestions();

  useEffect(() => {
    // Check if we have a student token before making API calls
    if (!isStudentToken()) {
      setProfileLoading(false);
      return; // Don't make API calls if not a student token
    }

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await studentAuthService.getCurrentStudent();
        setProfile(data);
      } catch (e: any) {
        handleError(e);
        // Handle different error types gracefully
        if (e?.response?.status === 401) {
          // Token expired - will be handled by interceptors
          return;
        } else if (e?.response?.status === 403) {
          // Admin token on student route
          setProfile(null);
        } else if (e?.code === 'NETWORK_ERROR') {
          // Network connectivity issues
          setProfile(null);
        } else {
          // Other errors
          setProfile(null);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();

    // Listen for custom event to refetch when onboarding completes
    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Topics', path: '/topics', icon: BookOpen },
    { name: 'Practice', path: '/practice', icon: PenTool },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const handleLogout = async () => {
    try {
      await studentAuthService.logout();
    } catch (e) {
      handleError(e);
      // Handle logout error silently
    } finally {
      localStorage.removeItem('accessToken');
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/login');
    }
  };

  const isProfileLoaded = !!profile;
  const username = profile?.data?.username;
  const leetcode = profile?.data?.leetcode;
  const gfg = profile?.data?.gfg;

  const isUserOnboarded = isProfileLoaded ? Boolean(username && leetcode && gfg) : true;


  return (
    <header className="sticky top-0 z-50 glass-borderless h-16 flex items-center px-6 lg:px-10" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* Logo - Clean text-only branding */}
        <Link href="/" className="group">
          <h1
            className="font-sans italic text-xl font-bold text-logo transition-all duration-300 group-hover:shadow-[0_0_20px_var(--hover-glow)]"
            style={{ fontSize: 'var(--text-lg)', letterSpacing: '-0.025em' }}
          >
            BruteForce
          </h1>
        </Link>

        {/* Pill Navigation */}
        <nav
          className="
    flex items-center gap-1 px-3 py-2 rounded-full
    bg-[var(--glass-bg)] backdrop-blur-md
    border border-[var(--glass-border)]
    transition-all duration-200
  "
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== '/' && pathname.startsWith(link.path));

            const Icon = link.icon;
            const isLocked = isProfileLoaded && !isUserOnboarded;

            return (
              <Link
                key={link.name}
                href={isLocked ? '#' : link.path}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                    router.push('/login');
                  }
                }}
                className={`
          relative flex items-center gap-2
          px-3 py-1.5 rounded-full text-sm font-medium

          transition-all duration-200 ease-in-out

          ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}

          ${isActive && !isLocked
                    ? `
                text-primary-foreground 
                bg-primary
                shadow-[0_0_15px_var(--hover-glow)]
              `
                    : `
                text-muted-foreground
                hover:text-foreground
                hover:bg-accent/40
              `
                  }
        `}
              >
                <Icon className="w-4 h-4 transition-all duration-200" />

                <span className="relative text-sm">
                  {link.name}
                </span>

                {isLocked && (
                  <div className="absolute -top-1 -right-1">
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {/* Recent Questions Button */}
          {isUserOnboarded && profile?.data && !profileLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="glass hover-glow rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', borderRadius: 'var(--radius-full)' }}
            >
              <Activity className="w-4 h-4 mr-2" style={{ fontSize: 'var(--text-sm)' }} />
              Recent
            </Button>
          )}

          {/* Check authentication and show appropriate UI */}
          {(() => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const isAuthenticated = !!token;

            // If not authenticated, show login button
            if (!isAuthenticated) {
              return (
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="glass hover-glow rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
                    style={{ padding: 'var(--spacing-sm) var(--spacing-xs)', borderRadius: 'var(--radius-full)' }}
                  >
                    <Link href="/login" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" style={{ fontSize: 'var(--text-sm)' }} />
                      Login
                    </Link>
                  </Button>
                </div>
              );
            }

            // If authenticated and profile is loaded, show user dropdown
            if (isAuthenticated && profile?.data && !profileLoading) {
              return isUserOnboarded ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative w-10 h-10 rounded-full border-2 border-border/50 hover:border-accent-primary/50 focus:outline-none transition-all duration-200 hover:scale-105 glass overflow-hidden"
                      style={{ borderRadius: 'var(--radius-full)', borderColor: 'var(--border)' }}
                    >
                      {profile.data.profileImageUrl ? (
                        <img src={profile.data.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full bg-gradient-to-br from-accent-primary to-accent-primary text-primary-foreground flex items-center justify-center text-sm font-bold"
                          style={{ borderRadius: 'var(--radius-full)' }}
                        >
                          {profile.data.name ? profile.data.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl glass" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}>
                    <div className="px-3 py-2.5 mb-1 bg-muted/30 rounded-lg border border-border/50" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)' }}>
                      <p className="text-sm font-semibold text-foreground truncate" style={{ fontSize: 'var(--text-sm)' }}>{profile.data.name}</p>
                      <p className="text-xs text-text-secondary font-mono truncate" style={{ fontSize: 'var(--text-xs)' }}>@{profile.data.username}</p>
                    </div>

                    <DropdownMenuSeparator className="bg-border/30 my-1" />

                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-sm font-medium focus:bg-accent-primary/10 focus:text-accent-primary py-2 transition-all duration-200" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                      <Link href={profile.data.username ? `/profile/${profile.data.username}` : '/profile'} className="flex items-center gap-2">
                        <User className="w-4 h-4" style={{ fontSize: 'var(--text-sm)' }} />
                        My Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-border/30 my-1" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-lg text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 transition-all duration-200"
                      style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                    >
                      <LogOut className="w-4 h-4 mr-2" style={{ fontSize: 'var(--text-sm)' }} />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={handleLogout}
                  className="glass hover-glow rounded-full px-4 py-1.5 text-sm font-medium text-destructive transition-all duration-200"
                  style={{ borderRadius: 'var(--radius-full)', padding: 'var(--spacing-sm) var(--spacing-xs)' }}
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" style={{ fontSize: 'var(--text-sm)' }} />
                </button>
              );
            }

            // For authenticated users where profile is still loading, show shimmer effect
            if (isAuthenticated && profileLoading) {
              return (
                <div className="relative w-10 h-10 rounded-full glass overflow-hidden" style={{ borderRadius: 'var(--radius-full)' }}>
                  <div className="w-full h-full bg-gradient-to-r from-muted via-muted-foreground/20 to-muted animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent animate-pulse" />
                </div>
              );
            }

            // For authenticated users where profile failed to load, show login button
            if (isAuthenticated && !profileLoading && !profile?.data) {
              return (
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="glass hover-glow rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
                    style={{ padding: 'var(--spacing-sm) var(--spacing-xs)', borderRadius: 'var(--radius-full)' }}
                  >
                    <Link href="/login" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" style={{ fontSize: 'var(--text-sm)' }} />
                      Login
                    </Link>
                  </Button>
                </div>
              );
            }

            return null;
          })()}
        </div>
      </div>
    </header>
  );
}