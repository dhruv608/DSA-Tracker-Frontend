"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, BookOpen, HelpCircle, Users, Trophy, AlertCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Select } from '@/components/Select';
import { Sidebar, SidebarNavItems } from '@/components/sidebar/Sidebar';
import { logoutUser } from '@/services/auth.service';
import { getCurrentAdmin } from '@/services/admin.service';
import { useAdminStore } from '@/store/adminStore';
import { getAdminCities, getAdminBatches } from '@/services/admin.service';
import { isAdminToken, clearAuthTokens } from '@/lib/auth-utils';

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

// Helper functions for localStorage
const getStoredSelections = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminSelections');
    return stored ? JSON.parse(stored) : { city: null, batch: null };
  }
  return { city: null, batch: null };
};

const setStoredSelections = (city: any, batch: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminSelections', JSON.stringify({ city, batch }));
  }
};

const clearStoredSelections = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSelections');
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const [cities, setCities] = useState<{id: number, city_name: string}[]>([]);
  const [batches, setBatches] = useState<{id: number, slug: string, batch_name: string, year: number}[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { 
    selectedCity, 
    selectedBatch, 
    setSelectedCity, 
    setSelectedBatch,
    setIsLoadingContext 
  } = useAdminStore();

  const handleLogout = () => {
    clearStoredSelections();
    logoutUser();
    router.push('/admin/login');
  };

  const handleRetry = () => {
    setAuthError(null);
    setAuthLoading(true);
    window.location.reload();
  };

  useEffect(() => {
    // Skip all API calls on login page only
    if (pathname === '/admin/login') {
      return;
    }

    // Check if we have an admin token before making any API calls
    if (!isAdminToken()) {
      console.log('No admin token found, clearing invalid tokens and redirecting to login');
      clearAuthTokens(); // Clear any invalid tokens (like student tokens)
      handleLogout();
      return;
    }

    const token = localStorage.getItem('accessToken');
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
    
    if (!token && !cookieToken) {
      console.log('No admin token found, redirecting to login');
      handleLogout();
      return;
    }

    const loadUserAndData = async () => {
      setAuthLoading(true);
      setAuthError(null);
      setIsLoadingContext(true);
      try {
        // Get current admin user from API
        const userData = await getCurrentAdmin();
        setUser(userData.data); // Service returns unwrapped data directly

        // Get cities and batches
        const cityList = await getAdminCities();
        setCities(cityList);

        // Check if we have stored selections
        const storedSelections = getStoredSelections();
        
        if (storedSelections.city) {
          // Restore from localStorage (persisted selections)
          setSelectedCity(storedSelections.city);
          
          const batchList = await getAdminBatches(storedSelections.city.name);
          setBatches(batchList);
          
          if (storedSelections.batch) {
            setSelectedBatch(storedSelections.batch);
          }
        } else {
          // First time visit - use token defaults
          const activeToken = token || cookieToken;
          const payload = decodeJwt(activeToken || '');
          let initialCityId = payload?.cityId;
          
          let matchingCity = null;
          if (initialCityId) {
             matchingCity = cityList.find((c: any) => c.id === initialCityId);
          }
          
          if (!matchingCity && cityList.length > 0) {
             matchingCity = cityList[0];
          }

          if (matchingCity) {
             const cityData = { id: matchingCity.id, name: matchingCity.city_name };
             setSelectedCity(cityData);
             
             const batchList = await getAdminBatches(matchingCity.city_name);
             setBatches(batchList);

             const initialBatchId = payload?.batchId;
             let matchingBatch = null;
             
             if (initialBatchId) {
               matchingBatch = batchList.find((b: any) => b.id === initialBatchId);
             }
             if (!matchingBatch && batchList.length > 0) {
               matchingBatch = batchList[0];
             }

             if (matchingBatch) {
               const batchData = {
                 id: matchingBatch.id, 
                 slug: matchingBatch.slug, 
                 name: matchingBatch.batch_name,
                 year: matchingBatch.year
               };
               setSelectedBatch(batchData);
               // Store the initial selections
               setStoredSelections(cityData, batchData);
             }
          }
        }
      } catch (err: any) {
        console.error("Failed to load admin data", err);
        
        // Handle specific error cases
        let errorMessage = 'Authentication failed';
        if (err.response?.status === 403) {
          errorMessage = 'Access forbidden - insufficient permissions';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed - token expired';
        } else if (err.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error - please check your connection';
        }
        
        setAuthError(errorMessage);
        
        // Clear tokens and redirect to login after a delay
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } finally {
        setIsLoadingContext(false);
        setAuthLoading(false);
      }
    };

    loadUserAndData();
  }, []); // Remove pathname dependency - only run once on mount

  // Handle City Change
  const handleCityChange = (value: string | number) => {
    const cityId = Number(value);
    const cityObj = cities.find(c => c.id === cityId);
    
    if (cityObj) {
      const cityData = { id: cityObj.id, name: cityObj.city_name };
      setSelectedCity(cityData);
      setStoredSelections(cityData, null); // Clear batch when city changes
      setIsLoadingContext(true);
      getAdminBatches(cityObj.city_name).then((batchList) => {
        setBatches(batchList);
        if (batchList.length > 0) {
          const first = batchList[0];
          const batchData = {
            id: first.id, 
            slug: first.slug, 
            name: first.batch_name,
            year: first.year
          };
          setSelectedBatch(batchData);
          setStoredSelections(cityData, batchData);
        }
      }).catch(err => {
        console.error("Batch load error:", err);
      }).finally(() => {
        setIsLoadingContext(false);
      });
    }
  };

  const handleBatchChange = (value: string | number) => {
    const batchId = Number(value);
    const batchObj = batches.find(b => b.id === batchId);
    if (batchObj) {
      const batchData = {
        id: batchObj.id, 
        slug: batchObj.slug, 
        name: batchObj.batch_name,
        year: batchObj.year
      };
      console.log('Setting batch with slug:', batchData.slug); // Debug log
      setSelectedBatch(batchData);
      setStoredSelections(selectedCity, batchData);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Topics & Classes', href: '/admin/topics', icon: BookOpen },
    { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Leaderboard', href: '/admin/leaderboard', icon: Trophy },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Skip loading screen for testing - go directly to content
  if (authLoading) {
    return null;
  }

  // Show error state if authentication fails
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{authError}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleRetry} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Retry
            </button>
            <button onClick={() => router.push('/admin/login')} className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              Login Again
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Redirecting to login in 3 seconds...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-[100vh] bg-background text-foreground selection:bg-primary/20">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-card border border-border hover:bg-muted"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Collapsible Sidebar Container */}
      <div className={`
        relative transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'w-[60px]' : 'w-[240px]'}
        lg:block hidden
      `}>
        {/* Reusable Sidebar Component */}
        <Sidebar
          role="admin"
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          user={user}
          navItems={navItems}
          onLogout={handleLogout}
          portalLabel="Admin Portal"
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full z-40 transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          role="admin"
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          user={user}
          navItems={navItems}
          onLogout={handleLogout}
          portalLabel="Admin Portal"
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>

      {/* Main Content Area with Dynamic Spacing */}
      <main className={`
        flex-1 flex flex-col relative z-20 min-w-0 transition-all duration-300 ease-in-out ps-3  mt-3
        ${isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-0'}
      `}>
        {/* Topbar */}
        <header className="h-14 glass border rounded-2xl border-border/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30 w-full">
          {/* Dropdown Selectors */}
          <div className="flex items-center gap-4">
             {selectedCity ? (
               <Select 
                 value={selectedCity.id.toString()}
                 onChange={handleCityChange}
                 options={cities.map(c => ({ label: c.city_name, value: c.id.toString() }))}
                 placeholder="Select City"
               />
             ) : (
                <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
             )}

             {selectedCity && (
               selectedBatch ? (
                 <Select 
                   value={selectedBatch.id.toString()}
                   onChange={handleBatchChange}
                   options={batches.map(b => ({ label: `${b.batch_name} - ${b.year}`, value: b.id.toString() }))}
                   placeholder="Select Batch"
                 />
               ) : (
                 <div className="h-9 w-40 bg-muted rounded-md animate-pulse ml-2"></div>
               )
             )}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
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