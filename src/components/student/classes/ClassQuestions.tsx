"use client";

import React from 'react';
import { QuestionRow } from '../questions/QuestionRow';

interface Question {
  id: string;
  questionName?: string;
  platform?: string;
  level?: string;
  type?: string;
  isSolved?: boolean;
  questionLink?: string;
}

interface ClassQuestionsProps {
  questions: Question[];
}

export function ClassQuestions({ questions }: ClassQuestionsProps) {
  return (
    <div>
      <h2 className="text-[14px] font-mono font-medium text-muted-foreground tracking-widest uppercase mb-6 flex items-center gap-3 after:flex-1 after:h-[1px] after:bg-border">
        Assigned Questions
      </h2>
      
      <div className="flex flex-col gap-3">
        {questions.length > 0 ? (
          questions.map((q: Question, idx: number) => (
            <div 
              key={q.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
            >
              <QuestionRow 
                questionName={q.questionName || 'Unknown Question'}
                platform={q.platform || 'Unknown'}
                level={q.level || 'EASY'}
                type={q.type || 'CLASSWORK'}
                isSolved={q.isSolved || false}
                link={q.questionLink || ''}
              />
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
            No questions assigned to this class yet.
          </div>
        )}
      </div>
    </div>
  );
}
