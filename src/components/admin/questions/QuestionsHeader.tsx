"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface QuestionsHeaderProps {
  totalRecords: number;
}

export default function QuestionsHeader({ totalRecords }: QuestionsHeaderProps) {
  return (
    <div className="glass rounded-2xl p-6 mb-7 flex items-center justify-between">
      <div className="flex items-center gap-4">
        
        <div>
          <h2 className="text-3xl font-semibold">
            Question <span className='text-primary'>Bank</span>
          </h2>
          <p className='m-0 p-0 mt-1 text-muted-foreground ' >Global Questions ....</p>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {totalRecords} Questions
      </div>
    </div>
  );
}
