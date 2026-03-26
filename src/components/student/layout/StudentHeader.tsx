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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-[64px] flex items-center px-6 lg:px-10 gap-5 shadow-sm transition-all">
      
      {/* Logo */}
      <Link href="/" className="font-serif italic text-2xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent shrink-0">
        BruteForce
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex gap-1 flex-1 ml-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
          const Icon = link.icon;
          const isLocked = isProfileLoaded && !isUserOnboarded;
          
          
          return (
            <Link 
              key={link.name} 
              href={isLocked ? '#' : link.path}
              onClick={e => { 
                if (isLocked) {
                  e.preventDefault();
                  router.push('/login');
                }
              }}
              className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-[13.5px] font-semibold transition-all overflow-hidden ${
                isLocked ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isActive && !isLocked
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : !isLocked ? 'text-muted-foreground hover:text-primary hover:bg-secondary border border-transparent' : 'text-muted-foreground border border-transparent'
              }`}
            >
              <Icon className="w-[15px] h-[15px]" />
              <span className="relative z-10">{link.name}</span>
              {isLocked && <div className="ml-1 text-[12px]"> <Lock/></div>}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        
        <ThemeToggle />

        {/* Recent Questions Button */}
        {isUserOnboarded && profile?.data && !profileLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="relative"
          >
            <Activity className="w-4 h-4 mr-2" />
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
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Login
                </Link>
              </div>
            );
          }
          
          // If authenticated and profile is loaded, show user dropdown
          if (isAuthenticated && profile?.data && !profileLoading) {
            return isUserOnboarded ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative w-9 h-9 rounded-full border-2 border-border hover:border-primary focus:outline-none transition-all flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
                    {profile.data.profileImageUrl ? (
                      <img src={profile.data.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 text-primary-foreground flex items-center justify-center text-[12px] font-bold">
                        {profile.data.name ? profile.data.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/80 shadow-xl dark:shadow-black/50">
                  <div className="px-3 py-2.5 mb-1 bg-secondary/30 rounded-lg border border-border/50">
                    <p className="text-[13.5px] font-semibold text-foreground truncate">{profile.data.name}</p>
                    <p className="text-[12px] text-muted-foreground font-mono truncate">@{profile.data.username}</p>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-border/60 my-1" />
                  
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] font-medium focus:bg-primary/10 focus:text-primary py-2">
                    <Link href={profile.data.username ? `/profile/${profile.data.username}` : '/profile'} className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border/60 my-1" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer rounded-lg text-[13px] font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 text-[13px] font-semibold rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2 shrink-0"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            );
          }
          
          // For authenticated users where profile is still loading, show shimmer effect
          if (isAuthenticated && profileLoading) {
            return (
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-r from-muted via-muted-foreground/20 to-muted animate-pulse shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent animate-pulse"></div>
              </div>
            );
          }
          
          // For authenticated users where profile failed to load, show login button
          if (isAuthenticated && !profileLoading && !profile?.data) {
            return (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Login
                </Link>
              </div>
            );
          }
          
          // Default fallback
          return null;
        })()}
      </div>
    </header>
  );
}