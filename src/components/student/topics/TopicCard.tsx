"use client";

import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2 } from "lucide-react";

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
  totalClasses,
}: TopicCardProps) {
  const progress =
    totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  return (
    <Link href={`/topics/${topicSlug}`}>
      <div className="group relative glass hover-glow overflow-hidden cursor-pointer rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        
        {/* Image Section */}
        <div className="h-[140px] relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={topicName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1 text-lg group-hover:text-accent-primary transition-colors">
            {topicName}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{totalClasses} classes</span>
            </div>

            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {solvedQuestions}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out 
                           bg-gradient-to-r from-primary via-primary to-primary 
                           shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-1 text-right text-xs text-muted-foreground">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
