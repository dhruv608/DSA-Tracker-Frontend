"use client";



import React, { useState } from 'react';

import { QuestionRow } from '../questions/QuestionRow';

import { BookmarkModal } from '../bookmarks/BookmarkModal';

import { bookmarkService } from '@/services/bookmark.service';

import { useBookmarks } from '@/hooks/useBookmarks';



interface Question {

  id: string;

  questionName?: string;

  platform?: string;

  level?: string;

  type?: string;

  isSolved?: boolean;

  questionLink?: string;

  isBookmarked?: boolean;

}



interface ClassQuestionsProps {

  questions: Question[];

  onRefresh?: () => void; // Add refresh callback

}



export function ClassQuestions({ questions, onRefresh }: ClassQuestionsProps) {
  const { addBookmark, removeBookmark, loading } = useBookmarks();
  const [bookmarkModal, setBookmarkModal] = useState<{
    isOpen: boolean;
    question: any;
  }>({
    isOpen: false,
    question: null
  });

  const handleBookmarkClick = async (questionId: number, question: any) => {
    setBookmarkModal({
      isOpen: true,
      question
    });
  };

  const handleBookmarkSubmit = async (description: string) => {
    if (bookmarkModal.question) {
      await addBookmark(bookmarkModal.question.id, description);
      setBookmarkModal({ isOpen: false, question: null });
      // Refresh the questions data to update bookmark status
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  return (
    <>
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
                  questionId={parseInt(q.id)}
                  isBookmarked={q.isBookmarked || false}
                  onBookmarkClick={handleBookmarkClick}
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

      {/* Bookmark Modal */}
      {bookmarkModal.question && (
        <BookmarkModal
          isOpen={bookmarkModal.isOpen}
          onClose={() => setBookmarkModal({ isOpen: false, question: null })}
          question={bookmarkModal.question}
          onSubmit={handleBookmarkSubmit}
          loading={loading}
        />
      )}
    </>
  );
}

