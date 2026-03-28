import React from 'react';

interface ProfileAvatarProps {
  username: string;
  bgcolor?: string;
  size?: number;
  className?: string;
}

export function ProfileAvatar({ 
  username, 
  bgcolor = 'var(--primary)', 
  size = 100, 
  className = '' 
}: ProfileAvatarProps) {
  // Get first two letters and convert to uppercase
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-bold opacity-90 ${className} text-white`}
      style={{ 
        backgroundColor: bgcolor,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.3}px` // Text size is 50% of container size
      }}
    >
      {initials}
    </div>
  );
}
