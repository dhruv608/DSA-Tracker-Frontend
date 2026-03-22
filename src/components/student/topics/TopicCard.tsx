import React from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import { BookOpen, Target, ChevronRight, Lock } from 'lucide-react';

interface TopicCardProps {
  topicSlug: string;
  topicName: string;
  photoUrl?: string;
  totalQuestions: number;
  solvedQuestions: number;
  totalClasses: number;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topicSlug,
  topicName,
  photoUrl,
  totalQuestions,
  solvedQuestions,
  totalClasses,
}) => {
  const progress = totalQuestions === 0 
    ? 0 
    : (solvedQuestions / totalQuestions) * 100;

  const isCompleted = progress === 100 && totalQuestions > 0;
  const isLocked = totalClasses === 0;

  const CardContent = () => (
    <div className={`group flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden relative ${isLocked ? 'opacity-60 cursor-not-allowed border-dashed' : 'hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300'}`}>
      {/* Premium Image Header */}
      <div className="h-32 w-full relative bg-muted overflow-hidden">
        {photoUrl ? (
          // @ts-ignore
          <img 
            src={photoUrl} 
            alt={topicName} 
            className={`w-full h-full object-cover ${!isLocked && 'group-hover:scale-105'} transition-transform duration-500 ease-in-out`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-amber-600/10" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        
        {isCompleted && !isLocked && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Target className="w-3 h-3" />
            Mastered
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-background/80 px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Locked</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col relative z-10 -mt-8">
        <h3 className={`font-serif italic text-lg font-bold text-foreground mb-4 drop-shadow-sm ${!isLocked && 'group-hover:text-primary'} transition-colors`}>
          {topicName}
        </h3>
        
        <div className="flex items-center gap-4 mb-5 text-[12px] font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-secondary/60 px-2 py-1 rounded-md">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{totalClasses} Classes</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/60 px-2 py-1 rounded-md">
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>{totalQuestions} Questions</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
            <span>Progress</span>
            <span className={isCompleted && !isLocked ? "text-emerald-500" : ""}>
              {solvedQuestions} / {totalQuestions}
            </span>
          </div>
          <ProgressBar progress={progress} className="h-2" />
        </div>
      </div>
      
      {/* Decorative Arrow Hover Indicator */}
      {!isLocked && (
        <div className="absolute bottom-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <div className="bg-primary/10 text-primary p-1 rounded-full">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );

  if (isLocked) {
    return <CardContent />;
  }

  return (
    <Link href={`/topics/${topicSlug}`}>
      <CardContent />
    </Link>
  );
};
