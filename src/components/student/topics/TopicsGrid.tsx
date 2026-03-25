"use client";

import React from 'react';
import { TopicCard } from './TopicCard';

interface Topic {
  slug: string;
  topic_name: string;
  photo_url?: string;
  batchSpecificData?: {
    totalQuestions?: number;
    solvedQuestions?: number;
    totalClasses?: number;
  };
}

interface TopicsGridProps {
  topics: Topic[];
  searchQuery: string;
}

export function TopicsGrid({ topics, searchQuery }: TopicsGridProps) {
  if (topics.length === 0) {
    return (
      <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
        {searchQuery ? "No topics matched your search." : "No topics assigned to your batch yet."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {topics.map((t: Topic, idx: number) => {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }} key={t.slug}>
            <TopicCard
              topicSlug={t.slug}
              topicName={t.topic_name}
              photoUrl={t.photo_url}
              totalQuestions={t.batchSpecificData?.totalQuestions || 0}
              solvedQuestions={t.batchSpecificData?.solvedQuestions || 0}
              totalClasses={t.batchSpecificData?.totalClasses || 0}
            />
          </div>
        );
      })}
    </div>
  );
}