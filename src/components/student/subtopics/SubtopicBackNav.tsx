"use client";

import React from 'react';
import Link from 'next/link';

export function SubtopicBackNav() {
  return (
    <Link
      href="/topics"
      className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mb-6 w-fit"
    >
      <span>←</span> Back to Topics
    </Link>
  );
}
