"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RecentQuestionsContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const RecentQuestionsContext = createContext<RecentQuestionsContextType | undefined>(undefined);

export function RecentQuestionsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <RecentQuestionsContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </RecentQuestionsContext.Provider>
  );
}

export function useRecentQuestions() {
  const context = useContext(RecentQuestionsContext);
  if (context === undefined) {
    throw new Error('useRecentQuestions must be used within a RecentQuestionsProvider');
  }
  return context;
}
