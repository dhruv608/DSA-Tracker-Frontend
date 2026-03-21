import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children, icon }: ModalProps) {
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-card border border-border flex flex-col rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
        
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            {icon && <div className="mb-4 text-4xl">{icon}</div>}
            <h2 className="text-xl font-bold font-serif tracking-tight text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
          </div>
          
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
