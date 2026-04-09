"use client";

import React from 'react';
import { Users } from 'lucide-react';

interface StudentsHeaderProps {
  totalRecords: number;
  selectedBatch: { name: string } | null;
}

export default function StudentsHeader({ totalRecords, selectedBatch }: StudentsHeaderProps) {
  return (
    <div className="glass backdrop-blur-2xl mb-7 rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
       

        <div>
          <h1 className="text-3xl font-semibold">Student<span className="text-primary ms-1">Management</span> </h1>
          <p className="p-0 m-0 mt-1 text-sm text-muted-foreground" >Hello Student...</p>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {totalRecords} Students
      </div>
    </div>
  );
}
