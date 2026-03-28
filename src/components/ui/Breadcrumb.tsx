"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === '/superadmin/login') {
      return [{ label: 'Login', isCurrent: true }];
    }
    
    if (pathname === '/superadmin') {
      return [{ label: 'SuperAdmin', isCurrent: true }];
    }
    
    if (pathname.includes('/superadmin/admins')) {
      return [
        { label: 'SuperAdmin', href: '/superadmin' },
        { label: 'Admins', isCurrent: true }
      ];
    }
    
    if (pathname.includes('/superadmin/cities')) {
      return [
        { label: 'SuperAdmin', href: '/superadmin' },
        { label: 'Cities', isCurrent: true }
      ];
    }
    
    if (pathname.includes('/superadmin/batches')) {
      return [
        { label: 'SuperAdmin', href: '/superadmin' },
        { label: 'Batches', isCurrent: true }
      ];
    }
    
    // Default fallback
    return [{ label: 'Dashboard', isCurrent: true }];
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.href && !item.isCurrent) {
      router.push(item.href);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 mx-1 flex-shrink-0" />
          )}
          <span
            onClick={() => handleBreadcrumbClick(item)}
            className={`${
              item.isCurrent
                ? 'text-foreground font-medium cursor-default'
                : 'text-muted-foreground hover:text-foreground transition-colors cursor-pointer hover:underline'
            } truncate max-w-[100px] sm:max-w-none`}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}
