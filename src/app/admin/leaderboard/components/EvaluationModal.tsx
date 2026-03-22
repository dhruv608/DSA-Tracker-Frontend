"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EvaluationModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 opacity-70 hover:opacity-100 transition-opacity">
          <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Evaluation Logic
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground mt-2">
          
          <div>
            <h4 className="font-semibold text-foreground mb-1">Ranking System</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Global Rank:</strong> Based on the overall objective score across all cities.</li>
              <li><strong className="text-foreground">City Rank:</strong> Specifically filtered relative to peers in the same city.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Score Calculation</h4>
            <p>Score mathematically weights questions by difficulty to reflect true capability.</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Completion Metrics</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hard Completion %</li>
              <li>Medium Completion %</li>
              <li>Easy Completion %</li>
            </ul>
            <p className="mt-1 text-xs opacity-80">Total completion is the average of these three.</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Tie-Breaking Rules</h4>
            <p>If two students have the same score, rank is decided by:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li>Hard problems solved</li>
              <li>Medium problems solved</li>
              <li>Easy problems solved</li>
              <li>Current active streak</li>
            </ol>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
