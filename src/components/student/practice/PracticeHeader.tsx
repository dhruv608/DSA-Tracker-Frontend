"use client";

import React from 'react';

export function PracticeHeader() {
  return (
    <div className="mb-8">
      <h1 className="font-serif italic text-3xl font-bold text-foreground mb-2">
        Practice <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">Problems</span>
      </h1>
      <p className="text-[14px] text-muted-foreground">
        Filter and search through all assigned questions to master specific concepts.
      </p>
    </div>
  );
}