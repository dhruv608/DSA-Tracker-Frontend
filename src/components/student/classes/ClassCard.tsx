import React from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import { PlayCircle, Target, Clock, FileText, ChevronRight } from 'lucide-react';

interface ClassCardProps {
  topicSlug: string;
  classSlug: string;
  index: number;
  classNameTitle: string;
  duration?: number;
  date?: string;
  totalQuestions: number;
  solvedQuestions: number;
  pdfUrl?: string;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  topicSlug,
  classSlug,
  index,
  classNameTitle,
  duration,
  date,
  totalQuestions,
  solvedQuestions,
  pdfUrl
}) => {
  const progress = totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;
  const isCompleted = progress === 100 && totalQuestions > 0;

  return (
    <Link 
      href={`/topics/${topicSlug}/classes/${classSlug}`}
      className="group flex flex-col sm:flex-row bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg rounded-2xl overflow-hidden transition-all duration-300 relative"
    >
      {/* Numbering / Icon Section */}
      <div className="bg-secondary/30 sm:w-20 sm:flex-shrink-0 flex items-center justify-center py-4 sm:py-0 border-b sm:border-b-0 sm:border-r border-border/50 group-hover:bg-primary/5 transition-colors">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Class</span>
          <span className="text-2xl font-black font-serif italic text-foreground group-hover:text-primary transition-colors">
            {index + 1}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-3 mb-2.5">
          <h3 className="font-serif italic text-lg sm:text-xl font-bold text-foreground drop-shadow-sm group-hover:text-primary transition-colors">
            {classNameTitle}
          </h3>
          {isCompleted && (
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-500/20">
              Completed
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-[12.5px] font-medium text-muted-foreground mb-5">
          {date && (
            <div className="flex items-center gap-1.5 bg-background border border-border/50 px-2 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5 bg-background border border-border/50 px-2 py-1 rounded-md">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{duration} min</span>
            </div>
          )}
          {pdfUrl && (
            <div className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md">
              <FileText className="w-3.5 h-3.5" />
              <span>Notes Available</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-auto">
          <div className="flex-1 sm:max-w-[240px]">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
              <span>Questions Progress</span>
              <span className={isCompleted ? "text-emerald-500 font-bold" : ""}>
                {solvedQuestions} / {totalQuestions}
              </span>
            </div>
            <ProgressBar progress={progress} className="h-2" />
          </div>
          
          <div className="hidden sm:flex ml-auto items-center justify-center w-10 h-10 rounded-full border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};
