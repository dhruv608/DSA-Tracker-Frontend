"use client";

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    console.log('UI ThemeToggle clicked, current theme:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    console.log('Switched to', newTheme, 'mode');
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full w-9 h-9 hover-glow"
        disabled
      >
        <div className="w-4 h-4 animate-pulse bg-muted rounded" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full w-9 h-9 "
    >
      {theme === 'light' ? (
        <Sun 
          className="transition-all" 
          style={{width: 'var(--spacing-lg)', height: 'var(--spacing-lg)', color: 'var(--accent-primary)'}}
        />
      ) : (
        <Moon 
          className="transition-all" 
          style={{width: 'var(--spacing-lg)', height: 'var(--spacing-lg)', color: 'var(--text-secondary)'}}
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
