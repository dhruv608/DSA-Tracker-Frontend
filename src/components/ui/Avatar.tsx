"use client";

import React from 'react';

interface AvatarProps {
  name: string;
  profileImageUrl?: string | null;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  showRankBadge?: boolean;
  rank?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  profileImageUrl,
  username,
  size = 'md',
  className = '',
  showBorder = true,
  showRankBadge = false,
  rank
}) => {
  // Generate initials from name
  const initials = name
    ? name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : username?.toUpperCase().slice(0, 2) || 'ME';

  // Size configurations
  const sizeConfig = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  // Border styling based on rank
  const getBorderClass = () => {
    if (!showBorder) return '';
    
    if (showRankBadge && rank) {
      if (rank === 1) return 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]';
      if (rank === 2) return 'border-slate-400';
      if (rank === 3) return 'border-amber-600';
    }
    
    return 'border-border';
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizeConfig[size]} 
          rounded-full overflow-hidden 
          ${getBorderClass()} 
          shadow-sm 
          group-hover:border-primary/50 
          transition-all duration-200
          ${showBorder ? 'border' : ''}
          bg-primary/10
        `}
      >
        {profileImageUrl ? (
          <img 
            src={profileImageUrl} 
            alt={name || username || 'User'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-primary">
            {initials}
          </div>
        )}
      </div>
      
      {/* Rank badge for top 3 */}
      {showRankBadge && rank && rank <= 3 && (
        <div className="absolute -top-1 -right-1">
          {rank === 1 && (
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-yellow-900">1</span>
            </div>
          )}
          {rank === 2 && (
            <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">2</span>
            </div>
          )}
          {rank === 3 && (
            <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">3</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
