"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { studentAuthService } from '@/services/student/auth.service';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Home, BookOpen, PenTool, Trophy, Lock } from 'lucide-react';

export default function StudentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentAuthService.getCurrentStudent();
        // /me endpoint returns clean data directly
        setProfile(data);
        console.log("Student Header Profile Data:", data);
      } catch (e) {
        console.error("Failed to fetch student profile", e);
      }
    };
    
    fetchProfile();
    
    // Listen for custom event to refetch when onboarding completes
    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, []);

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
      console.error(e);
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

  // Debug logging
  console.log('StudentHeader Debug:', {
    profile,
    isProfileLoaded,
    username,
    leetcode,
    gfg,
    isUserOnboarded,
    'Full profile object': profile,
    'Profile keys': Object.keys(profile || {}),
    'Profile data': profile?.data,
    'Profile username': profile?.data?.username,
    'Profile leetcode': profile?.data?.leetcode,
    'Profile gfg': profile?.data?.gfg
  });

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-[64px] flex items-center px-6 lg:px-10 gap-5 shadow-sm transition-all">
      
      {/* Logo */}
      <Link href="/" className="font-serif italic text-2xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent shrink-0">
        BruteForce
      </Link>

      {/* Nav */}
      <nav className="flex gap-1 flex-1 ml-6 hidden md:flex">
        {navLinks.map((link) => {
          const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
          const Icon = link.icon;
          const isLocked = isProfileLoaded && !isUserOnboarded;
          
          // Debug logging
          console.log('Link Debug:', {
            link: link.name,
            isLocked,
            isProfileLoaded,
            isUserOnboarded,
            username,
            leetcode,
            gfg
          });
          
          return (
            <Link 
              key={link.name} 
              href={isLocked ? '#' : link.path}
              onClick={e => { if (isLocked) e.preventDefault(); }}
              className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-[13.5px] font-semibold transition-all overflow-hidden ${
                isLocked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
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

        {isProfileLoaded ? (
          isUserOnboarded ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-9 h-9 rounded-full border-2 border-border hover:border-primary focus:outline-none transition-all flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
                  {profile?.data?.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile?.data?.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 text-primary-foreground flex items-center justify-center text-[12px] font-bold">
                      {profile?.data?.name ? profile?.data?.name.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/80 shadow-xl dark:shadow-black/50">
                <div className="px-3 py-2.5 mb-1 bg-secondary/30 rounded-lg border border-border/50">
                  <p className="text-[13.5px] font-semibold text-foreground truncate">{profile?.data?.name}</p>
                  <p className="text-[12px] text-muted-foreground font-mono truncate">@{profile?.data?.username}</p>
                </div>
                
                <DropdownMenuSeparator className="bg-border/60 my-1" />
                
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] font-medium focus:bg-primary/10 focus:text-primary py-2">
                  <Link href="/profile" className="flex items-center gap-2">
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
          )
        ) : (
          <div className="w-9 h-9 rounded-full border-2 border-border animate-pulse bg-secondary/50 shrink-0"></div>
        )}
      </div>
    </header>
  );
}
