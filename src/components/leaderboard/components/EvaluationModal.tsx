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
      <DialogContent className="w-[900px] max-w-none h-[600px] p-2 rounded-2xl">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Evaluation Logic
          </DialogTitle>
        </DialogHeader>
        <div className="h-full p-6 overflow-y-auto" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignContent: 'start'
        }}>

          <div className="space-y-6">
            {/* Ranking System */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Ranking System
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong className="text-foreground">Global Rank:</strong> Overall ranking across all cities based on total score.</li>
                <li><strong className="text-foreground">City Rank:</strong> Ranking within your city only, filtered by city selection.</li>
                <li><strong className="text-foreground">Dynamic Display:</strong> Shows "Global Rank" when "All Cities" is selected, otherwise "City Rank".</li>
              </ul>
            </div>

            {/* Score Calculation */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                Score Calculation
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-green-600">Easy</div>
                    <div className="text-xs text-muted-foreground">10 points</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-yellow-600">Medium</div>
                    <div className="text-xs text-muted-foreground">15 points</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-red-600">Hard</div>
                    <div className="text-xs text-muted-foreground">20 points</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Total Score = (Easy Solved × 10) + (Medium Solved × 15) + (Hard Solved × 20)</p>
              <p className="text-xs text-muted-foreground/80">Only accepted submissions count toward score.</p>
            </div>

            {/* Completion Metrics */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Completion Metrics
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong className="text-foreground">Easy Completion:</strong> (Easy Solved ÷ Total Easy Problems) × 100%</li>
                <li><strong className="text-foreground">Medium Completion:</strong> (Medium Solved ÷ Total Medium Problems) × 100%</li>
                <li><strong className="text-foreground">Hard Completion:</strong> (Hard Solved ÷ Total Hard Problems) × 100%</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">Average Completion = (Easy + Medium + Hard) ÷ 3</p>
            </div>

            {/* Tie Breaking Rules */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Scale3D className="w-4 h-4 text-primary" />
                Tie-Breaking Rules
              </h4>
              <p className="text-sm text-muted-foreground mb-3">When students have the same score, ranking is determined by:</p>
              <ol className="list-decimal pl-5 mt-3 space-y-2 text-sm">
                <li><strong className="text-foreground">Higher Score:</strong> Primary ranking criterion</li>
                <li><strong className="text-foreground">More Problems Solved:</strong> If scores are equal</li>
                <li><strong className="text-foreground">Higher Difficulty Solved:</strong> Prioritizes hard over medium over easy</li>
                <li><strong className="text-foreground">Longer Active Streak:</strong> Current consecutive days</li>
                <li><strong className="text-foreground">Earlier Achievement:</strong> Who reached to score first</li>
              </ol>
            </div>

            {/* Data Updates */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                Data Updates
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Leaderboard updates every 4 hours via automated cron job</li>
                <li>Last updated timestamp shows when data was last calculated</li>
                <li>Responsive design adapts to all screen sizes</li>
                <li>Manual refresh available for immediate updates</li>
              </ul>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
