"use client";
import React from 'react';

export function Modal({ children, onClose, title, description, width = "max-w-[440px]" }: { children: React.ReactNode; onClose?: () => void; title?: string; description?: string, width?: string }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200" 
      style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)'}}
    >
      <div 
        className={`w-full p-10 relative transition-all duration-200`} 
        style={{
          maxWidth: width,
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: `1px solid var(--border)`
        }}
      >
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 transition-colors focus:outline-none hover-glow" 
            style={{color: 'var(--text-secondary)'}}
          >
            ✕
          </button>
        )}
        {(title || description) && (
          <div className="text-center mb-8" style={{marginBottom: 'var(--spacing-lg)'}}>
            {title && (
              <h1 
                className="font-serif italic text-3xl font-bold mb-2 bg-gradient-to-br from-accent-primary to-accent-primary bg-clip-text text-transparent" 
                style={{letterSpacing: '-0.025em'}}
              >
                {title}
              </h1>
            )}
            {description && (
              <p 
                className="font-medium" 
                style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
