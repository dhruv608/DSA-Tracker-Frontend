import React from 'react';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';

interface QuestionRowProps {
  questionName: string;
  platform: string;
  level: string;
  type: string;
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

  const isHomework = type === 'HOMEWORK';

  const getLevelColor = (l: string) => {
    switch (l.toUpperCase()) {
      case 'EASY': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HARD': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPlatformShort = (p: string) => {
    if (!p) return '';
    if (p.toLowerCase().includes('leetcode')) return 'LC';
    if (p.toLowerCase().includes('gfg')) return 'GFG';
    return p;
  };

  return (
    <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
      isSolved 
        ? 'bg-emerald-500/5 border-emerald-500/20'
        : 'bg-card border-border/60 hover:border-primary/30 hover:shadow-md'
    }`}>

      {/* LEFT */}
      <div className="flex items-start gap-4">

        {/* STATUS */}
        {isSolved ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground/30 mt-1 group-hover:text-primary/40" />
        )}

        {/* TEXT BLOCK */}
        <div>

          {/* TITLE */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-semibold ${
              isSolved ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {questionName}
            </h4>

            {/* HW / CW */}
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              isHomework
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-muted text-muted-foreground border border-border'
            }`}>
              {isHomework ? 'HW' : 'CW'}
            </span>
          </div>

          {/* 🔥 TOPIC (SUBTLE, NOT BOXY) */}
          {topicName && (
            <p className="text-[11px] text-muted-foreground/70 mb-1">
              {topicName}
            </p>
          )}

          {/* META */}
          <div className="flex items-center gap-2 text-[11px]">

            <span className={`px-2 py-0.5 rounded border font-semibold ${getLevelColor(level)}`}>
              {level}
            </span>

            <span className="text-muted-foreground/40">•</span>

            <span className="text-muted-foreground/70 font-medium">
              {getPlatformShort(platform)}
            </span>

          </div>
        </div>
      </div>

      {/* RIGHT CTA */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            isSolved
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {isSolved ? 'Solution' : 'Solve'}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
