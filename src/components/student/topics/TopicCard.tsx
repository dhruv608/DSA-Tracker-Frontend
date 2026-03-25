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
      <div className="group relative bg-card border border-border/80 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer">
        {/* Image Section */}
        <div className="h-[140px] relative bg-gradient-to-br from-primary/20 via-primary/10 to-background">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={topicName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-primary/30 rounded-full" />
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-semibold text-[15px] text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {topicName}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{totalClasses} classes</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{solvedQuestions}/{totalQuestions}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-muted rounded-full h-[6px] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground text-right">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}