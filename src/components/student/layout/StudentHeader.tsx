"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isStudentToken } from '@/lib/auth-utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home, BookOpen, PenTool, Trophy, Lock, Activity, ChevronRight, Menu, X, Bookmark } from 'lucide-react';
import { useRecentQuestions } from '@/contexts/RecentQuestionsContext';
import { useProfile } from '@/contexts/ProfileContext';
import { studentAuthService } from '@/services/student/auth.service';
import { handleToastError } from "@/utils/toast-system";

// Drawer Component
const Drawer = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-72 glass border-r border-border/50 z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="p-4">
          <div className="flex items-center justify-end mb-6">
            {/* <h2 className="text-lg font-semibold text-foreground">Menu</h2> */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors  duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <nav className="space-y-2">
            {children}
          </nav>
        </div>
      </div>
    </>
  );
};

// Drawer Navigation Item Component
const DrawerNavItem = ({ href, icon: Icon, label, isActive, onClick }: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
      ${isActive
        ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export default function StudentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleSidebar } = useRecentQuestions();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { profile, profileLoading } = useProfile();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
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
      handleToastError(e);
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


  return (
    <>
      <header className="sticky top-0 z-50 glass-borderless h-16 flex items-center  lg:px-10" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

          {/* Left Side - Hamburger Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - Hidden on Large Screens */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 hover:scale-105"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            {/* Logo - Clean text-only branding */}
            <Link href="/" >
              <h1
                className="font-sans  text-xl font-bold text-logo transition-all duration-300 group-hover:shadow-[0_0_20px_var(--hover-glow)]"
                style={{ fontSize: 'var(--text-lg)', letterSpacing: '-0.025em' }}
              >
                <span className="text-2xl md:text-2xl font-bold leading-[1.05] tracking-tight">
                  <span className="text-foreground">Brute</span>
                  <span className="text-[var(--accent-primary)] ">Force</span>
                </span>
              </h1>
            </Link>
          </div>

          {/* Center Navigation - Desktop Only */}
          <nav
            className="
    hidden md:flex items-center gap-1 px-3 py-2 rounded-2xl 
    glass  backdrop-blur-md
    border border-border
    transition-all duration-200
  "
          >
            {navLinks.map((link) => {
              const isActive =
                pathname === link.path ||
                (link.path !== '/' && pathname.startsWith(link.path));

              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`
          relative flex items-center gap-2
          px-3 py-1.5 rounded-full text-sm font-medium

          transition-all duration-200 ease-in-out

          ${isActive
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

                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">

            {/* Desktop Recent Questions Button - Hidden on Mobile */}
            {profile?.data && !profileLoading && (
              <button
                onClick={() => toggleSidebar()}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all duration-200"
                title="Recent Questions"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden xl:inline">Recent</span>
              </button>
            )}

            <ThemeToggle />

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
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="relative w-10 h-10 rounded-full border-2 border-border/50 hover:border-accent-primary/50 focus:outline-none transition-all duration-200 hover:scale-105  overflow-hidden"
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
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      className="w-56 p-2 rounded-2xl group "
                    >
                      {/* PROFILE HEADER */}
                      <div className="px-3 py-2 mb-1 rounded-lg border border-border/50">
                        <div className="flex flex-col">

                          <p className="text-sm font-semibold text-foreground truncate leading-[1] m-0 p-1">
                            {profile.data.name}
                          </p>

                          <p className="text-[10px] text-muted-foreground font-mono truncate leading-[1] m-0 p-1 -mt-[2px]">
                            @{profile.data.username}
                          </p>

                        </div>
                      </div>

                      <DropdownMenuSeparator className="bg-border/30 my-1" />

                      {/* PROFILE BUTTON */}
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-sm py-2">
                        <Link
                          href={profile.data.username ? `/profile/${profile.data.username}` : '/profile'}
                          className="flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>

                      {/* BOOKMARKS BUTTON */}
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-sm py-2">
                        <Link href="/bookmarks" className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4" />
                          My Bookmarks
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-border/30 my-1" />

                      {/* LOGOUT */}
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer rounded-lg text-sm text-destructive py-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

            {/* PWIO Logo - Theme-aware - Hidden on Mobile */}
            {mounted && (
              <div className="ml-3 hidden sm:block">
                <img
                  src={
                    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
                      ? '/pwioi_dark.jpg'
                      : '/pwioi_light.png'
                  }
                  alt="PWIO Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      <Drawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        {navLinks.map((link) => {
          const isActive =
            pathname === link.path ||
            (link.path !== '/' && pathname.startsWith(link.path));

          return (
            <DrawerNavItem
              key={link.name}
              href={link.path}
              icon={link.icon}
              label={link.name}
              isActive={isActive}
              onClick={() => setMobileMenuOpen(false)}
            />
          );
        })}

        {/* Mobile Recent Questions Button */}
        {profile?.data && !profileLoading && (
          <button
            onClick={() => {
              toggleSidebar();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 w-full"
          >
            <Activity className="w-5 h-5" />
            <span>Recent Questions</span>
          </button>
        )}
      </Drawer>
    </>
  );
}
