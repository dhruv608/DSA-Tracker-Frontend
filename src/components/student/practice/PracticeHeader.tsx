"use client";

import React from 'react';

export function PracticeHeader() {
  return (
    <div className="mb-8">
      <h1 className="font-serif italic text-3xl font-bold text-foreground mb-2">
        Practice <span className="text-logo">Problems</span>
      </h1>
      <p className="text-[14px] text-muted-foreground">
        Filter and search through all assigned questions to master specific concepts.
      </p>
    </div>
  );
}
