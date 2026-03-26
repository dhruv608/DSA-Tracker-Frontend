"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface TopicCardProps {
  topicSlug: string;
  topicName: string;
  photoUrl?: string;
  totalQuestions: number;
  solvedQuestions: number;
  totalClasses: number;
}

export function TopicCard({
  topicSlug,
  topicName,
  photoUrl,
  totalQuestions,
  solvedQuestions,
  totalClasses
}: TopicCardProps) {
  const progress = totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  return (
    <Link href={`/topics/${topicSlug}`}>
      <div 
        className="group relative glass hover-glow overflow-hidden cursor-pointer" 
        style={{borderRadius: 'var(--radius-lg)'}}
      >
        {/* Image Section */}
        <div 
          className="h-[140px] relative" 
          style={{background: 'linear-gradient(to bottom right, var(--accent-primary), var(--background))'}}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={topicName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center" 
                style={{background: 'var(--accent-primary)', borderRadius: 'var(--radius-full)'}}
              >
                <span 
                  className="text-primary-foreground text-sm font-bold"
                  style={{fontSize: 'var(--text-xs)'}}
                >
                  {topicName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            style={{background: 'linear-gradient(to top, var(--background), transparent)'}}
          />
        </div>

        {/* Content Section */}
        <div className="p-4" style={{padding: 'var(--spacing-md)'}}>
          <h3 
            className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent-primary transition-colors" 
            style={{fontSize: 'var(--text-lg)'}}
          >
            {topicName}
          </h3>

          {/* Stats */}
          <div 
            className="flex items-center justify-between mb-3" 
            style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" style={{fontSize: 'var(--text-sm)'}} />
              <span>{totalClasses} classes</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" style={{fontSize: 'var(--text-sm)'}} />
              <span>{solvedQuestions}/{totalQuestions}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative" style={{marginTop: 'var(--spacing-sm)'}}>
            <div 
              className="w-full rounded-full overflow-hidden" 
              style={{
                background: 'var(--muted)',
                height: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
              />
            </div>
            <div 
              className="mt-1 text-right" 
              style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
            >
              {Math.round(progress)}%
            </div>
          </div>

          {/* Hover Effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
            style={{background: 'linear-gradient(to top, var(--background), transparent)'}}
          />
        </div>
      </div>
    </Link>
  );
}