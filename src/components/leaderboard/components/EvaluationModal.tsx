"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Trophy, Calculator, BarChart3, Flame, Scale3D, RefreshCw } from 'lucide-react';
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
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Ranking System
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Global Rank:</strong> Overall ranking across all cities based on total score.</li>
              <li><strong className="text-foreground">City Rank:</strong> Ranking within your city only, filtered by city selection.</li>
              <li><strong className="text-foreground">Dynamic Display:</strong> Shows "Global Rank" when "All Cities" is selected, otherwise "City Rank".</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Score Calculation
            </h4>
            <div className="bg-muted/50 p-3 rounded-md mt-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-bold text-green-600">Easy</div>
                  <div className="text-xs">10 points</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-600">Medium</div>
                  <div className="text-xs">15 points</div>
                </div>
                <div>
                  <div className="font-bold text-red-600">Hard</div>
                  <div className="text-xs">20 points</div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs">Total Score = (Easy Solved × 10) + (Medium Solved × 15) + (Hard Solved × 20)</p>
            <p className="text-xs opacity-80">Only accepted submissions count toward score.</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Completion Metrics
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Easy Completion:</strong> (Easy Solved ÷ Total Easy Problems) × 100%</li>
              <li><strong className="text-foreground">Medium Completion:</strong> (Medium Solved ÷ Total Medium Problems) × 100%</li>
              <li><strong className="text-foreground">Hard Completion:</strong> (Hard Solved ÷ Total Hard Problems) × 100%</li>
            </ul>
            <p className="mt-1 text-xs opacity-80">Average Completion = (Easy + Medium + Hard) ÷ 3</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              Streak Calculation
            </h4>
            <p className="mb-2">Consecutive days with at least one accepted submission:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Streak continues only if you solve problems on consecutive days</li>
              <li>Missing a day resets the streak to 0</li>
              <li>Maximum streak tracks the longest streak achieved</li>
              <li>Days are calculated based on your local timezone</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <Scale3D className="w-4 h-4 text-primary" />
              Tie-Breaking Rules
            </h4>
            <p>When students have the same score, ranking is determined by:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li><strong className="text-foreground">Higher Score:</strong> Primary ranking criterion</li>
              <li><strong className="text-foreground">More Problems Solved:</strong> If scores are equal</li>
              <li><strong className="text-foreground">Higher Difficulty Solved:</strong> Prioritizes hard over medium over easy</li>
              <li><strong className="text-foreground">Longer Active Streak:</strong> Current consecutive days</li>
              <li><strong className="text-foreground">Earlier Achievement:</strong> Who reached the score first</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              Data Updates
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Leaderboard updates every 4 hours via automated cron job</li>
              <li>Last updated timestamp shows when data was last calculated</li>
              <li>Real-time countdown shows time until next refresh</li>
              <li>Manual refresh available for immediate updates</li>
            </ul>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
