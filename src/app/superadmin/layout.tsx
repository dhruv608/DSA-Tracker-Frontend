"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Building2, Layers, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getCurrentSuperAdmin } from '@/services/superadmin.service';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const [user, setUser] = React.useState<{name: string, role: string, email?: string} | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadUser = async () => {
      if (pathname === '/superadmin/login') return;
      
      try {
        const userData = await getCurrentSuperAdmin();
        setUser(userData.data); // Service returns unwrapped data directly
      } catch (err) {
        console.error('Failed to load superadmin user:', err);
        window.location.href = '/superadmin/login';
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    window.location.href = '/superadmin/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/superadmin', icon: LayoutDashboard },
    { label: 'Admins', href: '/superadmin/admins', icon: Users },
    { label: 'Cities', href: '/superadmin/cities', icon: Building2 },
    { label: 'Batches', href: '/superadmin/batches', icon: Layers },
  ];

  if (pathname === '/superadmin/login') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      
      {/* Sidebar - mapped exactly from theme */}
      <aside className="w-[240px] flex-shrink-0 bg-sidebar border-r border-border flex flex-col z-20 shadow-sm relative animate-in slide-in-from-left duration-500">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center p-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full text-primary-foreground"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div className="text-xl font-bold tracking-tight text-foreground">
              BruteForce
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono px-3 py-2 mb-1">
            Overview
          </div>
          
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <React.Fragment key={item.href}>
                {idx === 1 && (
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono px-3 pt-5 pb-2">
                    Management
                  </div>
                )}
                <Link 
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-primary bg-muted/60 font-semibold' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  {item.label}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-8 h-8 rounded-md bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm shrink-0 uppercase">
              {user.name.charAt(0) || 'S'}
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-foreground">{user.name || 'Super Admin'}</div>
              <div className="text-xs text-muted-foreground truncate">Logout Session</div>
            </div>
            <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        
        {/* Topbar */}
        <header className="h-14 bg-card/80 backdrop-blur border-b flex items-center justify-between px-6 shrink-0 z-10 w-full">
          <div className="flex items-center gap-3">
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>

        
      </main>
    </div>
  );
}