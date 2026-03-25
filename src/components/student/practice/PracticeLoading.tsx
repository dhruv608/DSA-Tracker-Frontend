"use client";

import React from 'react';

export function PracticeLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse flex gap-2 text-primary font-mono text-[13px]">
        Loading<span className="animate-bounce inline-block">.</span><span className="animate-bounce inline-block" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce inline-block" style={{animationDelay: '0.2s'}}>.</span>
      </div>
    </div>
  );
}