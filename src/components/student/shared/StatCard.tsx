import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

export const StatCard = ({ icon, value, label, className = '' }: StatCardProps) => {
  return (
    <div className={`bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg mb-3 text-primary">
        {icon}
      </div>
      <div className="font-mono text-3xl font-semibold mb-1">
        {value}
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {label}
      </div>
    </div>
  );
};
