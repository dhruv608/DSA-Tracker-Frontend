"use client";



import React, { useState } from 'react';

import { Search } from 'lucide-react';

import { QuestionRow } from '../questions/QuestionRow';

import { PracticeLoading } from './PracticeLoading';

import { BookmarkModal } from '../bookmarks/BookmarkModal';

import { useBookmarks } from '@/hooks/useBookmarks';



interface Question {

  id: string;

  question_name: string;

  platform: string;

  level: string;

  type: string;

  isSolved?: boolean;

  question_link?: string;

  isBookmarked?: boolean;

  topic?: {

    topic_name: string;

  };

}



interface PracticeResultsProps {
  loading: boolean;
  questions: Question[];
  onRefresh?: () => void; // Add refresh callback
}



export function PracticeResults({ loading, questions, onRefresh }: PracticeResultsProps) {
  const { addBookmark, loading: bookmarkLoading } = useBookmarks();
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
    <>
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
              questionId={parseInt(q.id)}
              isBookmarked={q.isBookmarked || false}
              onBookmarkClick={handleBookmarkClick}
            />
          </div>
        ))}
      </div>

      {/* Bookmark Modal */}
      {bookmarkModal.question && (
        <BookmarkModal
          isOpen={bookmarkModal.isOpen}
          onClose={() => setBookmarkModal({ isOpen: false, question: null })}
          question={bookmarkModal.question}
          onSubmit={handleBookmarkSubmit}
          loading={bookmarkLoading}
        />
      )}
    </>
  );

}

