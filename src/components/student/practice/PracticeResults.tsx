"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { QuestionRow } from '../questions/QuestionRow';
import { PracticeLoading } from './PracticeLoading';

interface Question {
  id: string;
  question_name: string;
  platform: string;
  level: string;
  type: string;
  isSolved?: boolean;
  question_link?: string;
  topic?: {
    topic_name: string;
  };
}

interface PracticeResultsProps {
  loading: boolean;
  questions: Question[];
}

export function PracticeResults({ loading, questions }: PracticeResultsProps) {
  if (loading) {
    return <PracticeLoading />;
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed p-10">
        <Search className="w-10 h-10 mb-4 opacity-50 text-muted-foreground" />
        <div className="font-semibold text-foreground mb-1">No questions found</div>
        <div className="text-[13px]">Try adjusting your search or filters.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-[400px]">
      {questions.map((q: Question, idx) => (
        <div key={q.id} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 20}ms`, animationFillMode: 'both' }}>
          <QuestionRow 
            questionName={q.question_name}
            platform={q.platform}
            level={q.level}
            type={q.type}
            isSolved={q.isSolved || false}
            link={q.question_link}
            topicName={q.topic?.topic_name}
          />
        </div>
      ))}
    </div>
  );
}
