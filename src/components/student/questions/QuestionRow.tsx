import React from 'react';
import { CheckCircle2, Circle, ExternalLink, Code2 } from 'lucide-react';

interface QuestionRowProps {
  questionName: string;
  platform: string;
  level: string;
  type: string; // 'CLASSWORK' | 'HOMEWORK'
  isSolved: boolean;
  link?: string;
  topicName?: string;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({
  questionName,
  platform,
  level,
  type,
  isSolved,
  link,
  topicName
}) => {

  const getLevelColor = (l: string) => {
    switch (l.toUpperCase()) {
      case 'EASY': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM': return 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'HARD': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-secondary border-border';
    }
  };

  const getPlatformIcon = (p: string) => {
    // We stick to lucid-react for all per instruction, using Code2 as generic tech icon
    // Real SAAS might use specific SVGs, but Code2 works great identically
    return <Code2 className="w-3.5 h-3.5 mr-1" />;
  };

  const isHomework = type.toUpperCase() === 'HOMEWORK';

  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
      isSolved 
        ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' 
        : 'bg-card border-border/80 hover:border-primary/50 shadow-sm hover:shadow-md'
    }`}>
      
      <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
        <div className="mt-1 sm:mt-0 shrink-0">
          {isSolved ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
          )}
        </div>
        
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className={`text-[15px] font-semibold ${isSolved ? 'text-foreground/80 line-through decoration-emerald-500/50' : 'text-foreground'}`}>
              {questionName}
            </h4>
            {isHomework && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                HW
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wider font-mono">
            {topicName && (
              <>
                <span className="text-muted-foreground">{topicName}</span>
                <span className="text-border mx-1">•</span>
              </>
            )}
            <span className={`px-2 py-0.5 rounded border ${getLevelColor(level)}`}>
              {level}
            </span>
            <span className="text-border mx-1">•</span>
            <span className="text-muted-foreground flex items-center">
              {getPlatformIcon(platform)}
              {platform}
            </span>
          </div>
        </div>
      </div>

      <div className="pl-10 sm:pl-0 flex items-center gap-3">
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm ${
              isSolved 
                ? 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            Solve Problem <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        ) : (
          <span className="text-[12px] text-muted-foreground italic px-4 py-2 bg-secondary rounded-xl">
            No link provided
          </span>
        )}
      </div>

    </div>
  );
};
