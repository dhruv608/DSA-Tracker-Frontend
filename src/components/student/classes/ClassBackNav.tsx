"use client";

import React from 'react';
import Link from 'next/link';

interface ClassBackNavProps {
  topicSlug: string;
  topicName?: string;
}

export function ClassBackNav({ topicSlug, topicName }: ClassBackNavProps) {
  return (
    <Link 
      href={`/topics/${topicSlug}`}
      className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mb-6 w-fit"
    >
      <span>←</span> Back to {topicName || "Topic"}
    </Link>
  );
}