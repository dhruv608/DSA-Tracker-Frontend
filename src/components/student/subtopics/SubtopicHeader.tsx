"use client";

import React from 'react';
import { ProgressBar } from '../shared/ProgressBar';

interface SubtopicHeaderProps {
  topic: any;
  progress: number;
}

export function SubtopicHeader({ topic, progress }: SubtopicHeaderProps) {
  return (
    <div className="bg-card border border-border/80 rounded-[24px] overflow-hidden shadow-sm mb-10 flex flex-col md:flex-row relative">
      <div className="md:w-1/3 h-[180px] md:h-auto relative bg-gradient-to-br from-primary/20 via-primary/10 to-background border-r border-border/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {topic.photo_url ? (
          <img
            src={topic.photo_url}
            alt={topic.topic_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/30 rounded-full" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
      </div>

      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
        <h1 className="font-serif italic text-3xl font-bold text-foreground mb-3">
          {topic.topic_name}
        </h1>
        {topic.description && (
          <p className="text-[14px] text-muted-foreground mb-6 max-w-2xl leading-relaxed">
            {topic.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Classes</div>
              <div className="font-semibold text-lg">{topic.classes?.length || 0}</div>
            </div>
            <div className="w-[1px] h-8 bg-border" />
            <div className="text-center">
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Questions</div>
              <div className="font-semibold text-lg">{topic.overallProgress?.totalQuestions || 0}</div>
            </div>
          </div>

          <div className="flex-1 sm:ml-auto w-full sm:max-w-[200px]">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span>{topic.overallProgress?.solvedQuestions || 0} / {topic.overallProgress?.totalQuestions || 0}</span>
            </div>
            <ProgressBar progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
}