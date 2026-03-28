"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, LayoutDashboard, Users, Building2, Layers } from 'lucide-react';
import { Sidebar, SidebarNavItems } from '@/components/sidebar/Sidebar';
import { getCurrentSuperAdmin } from '@/services/superadmin.service';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { isAdminToken, clearAuthTokens } from '@/lib/auth-utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { handleError } from "@/utils/handleError";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const [user, setUser] = React.useState<{ name: string, role: string, email?: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const loadUser = async () => {
      if (pathname === '/superadmin/login') return;

      // Check if we have an admin token before making any API calls
      if (!isAdminToken()) {
        console.log('No admin token found, clearing invalid tokens and redirecting to login');
        clearAuthTokens(); // Clear any invalid tokens (like student tokens)
        window.location.href = '/superadmin/login';
        return;
      }

      try {
        const userData = await getCurrentSuperAdmin();
        setUser(userData.data); // Service returns unwrapped data directly
      } catch (err) {
        handleError(err);
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
    { label: 'Admins', href: '/superadmin/admins', icon: Users, showDivider: true, dividerLabel: 'Management' },
    { label: 'Cities', href: '/superadmin/cities', icon: Building2 },
    { label: 'Batches', href: '/superadmin/batches', icon: Layers },
  ];

  if (pathname === '/superadmin/login') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-card border border-border hover:bg-muted"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full z-40 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          role="superadmin"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
          navItems={navItems}
          onLogout={handleLogout}
          portalLabel="SuperAdmin Portal"
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>

      {/* Reusable Sidebar Component */}
      <Sidebar
        role="superadmin"
        isOpen={true}
        onClose={() => {}}
        user={user}
        navItems={navItems}
        onLogout={handleLogout}
        portalLabel="SuperAdmin Portal"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-20 min-w-0 ps-2 mt-3 ">

        {/* Topbar */}
        <header className="h-14 glass rounded-2xl border border-border/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30 w-full">
          <div className="flex items-center gap-3">
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle/>
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
          <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}