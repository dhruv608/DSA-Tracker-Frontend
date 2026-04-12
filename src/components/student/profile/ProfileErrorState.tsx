"use client";

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileErrorStateProps {
  error: string;
}

export function ProfileErrorState({ error }: ProfileErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Profile</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );
}
