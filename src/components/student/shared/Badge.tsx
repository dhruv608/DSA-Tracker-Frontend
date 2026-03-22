import React from 'react';

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'solved' | 'unsolved' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    easy: 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0] dark:bg-[#064e3b] dark:text-[#34d399] dark:border-[#065f46]',
    medium: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a] dark:bg-[#78350f] dark:text-[#fbbf24] dark:border-[#92400e]',
    hard: 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca] dark:bg-[#7f1d1d] dark:text-[#f87171] dark:border-[#991b1b]',
    solved: 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0] dark:bg-[#064e3b] dark:text-[#34d399] dark:border-[#065f46]',
    unsolved: 'bg-secondary text-muted-foreground border-border',
    default: 'bg-primary/10 text-primary border-primary/20',
  };

  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wide border';

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
