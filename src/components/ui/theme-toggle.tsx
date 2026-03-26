"use client";

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full w-9 h-9 hover-glow"
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
