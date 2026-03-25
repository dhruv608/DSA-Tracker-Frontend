"use client";

import React from 'react';
import { ClassCard } from '../classes/ClassCard';

interface SubtopicClassesProps {
  topic: any;
}

export function SubtopicClasses({ topic }: SubtopicClassesProps) {
  return (
    <div>
      <h2 className="text-[14px] font-mono font-medium text-muted-foreground tracking-widest uppercase mb-5">
        Classes
      </h2>
      <div className="flex flex-col gap-3">
        {topic.classes?.length > 0 ? (
          topic.classes.map((cls: any, idx: number) => (
            <div
              key={cls.slug}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
            >
              <ClassCard
                topicSlug={topic.slug}
                classSlug={cls.slug}
                index={idx}
                classNameTitle={cls.class_name}
                date={cls.classDate}
                totalQuestions={cls.totalQuestions || 0}
                solvedQuestions={cls.solvedQuestions || 0}
                pdfUrl={cls.pdf_url}
              />
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
            No classes assigned to this topic yet.
          </div>
        )}
      </div>
    </div>
  );
}