"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Activity, 
  X, 
  ChevronRight,
  Loader2 
} from 'lucide-react';
import api from '@/lib/api';
import { useRecentQuestions } from '@/contexts/RecentQuestionsContext';

interface RecentQuestion {
  question_id: number;
  question_name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic_slug: string;
  class_slug: string;
  assigned_at: string;
}

interface RecentQuestionsResponse {
  questions: RecentQuestion[];
  total: number;
}

export function RecentQuestionsSidebar() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useRecentQuestions();
  const [questions, setQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent questions
  const fetchRecentQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/students/recent-questions?days=7');
      setQuestions(response.data.questions);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch recent questions');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchRecentQuestions();
    const interval = setInterval(fetchRecentQuestions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format time ago
  const formatTimeAgo = (assigned_at: string) => {
    const now = new Date();
    const assigned = new Date(assigned_at);
    const diffMs = now.getTime() - assigned.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
      return diffMinutes < 5 ? 'NEW' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return '1w+ ago';
    }
  };

  // Handle view class click
  const handleViewClass = (question: RecentQuestion) => {
    router.push(`/topics/${question.topic_slug}/classes/${question.class_slug}`);
  };

  // Get difficulty badge variant
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-80 bg-background border-l shadow-2xl transform transition-transform duration-300 ease-in-out">
            <Card className="h-full rounded-none border-0 shadow-none">
              {/* Header */}
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Questions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-80px)]">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-destructive">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchRecentQuestions}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No recent questions</p>
                      <p className="text-xs mt-1">Questions added in the last 7 days will appear here</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {questions.map((question, index) => (
                        <Card 
                          key={question.question_id}
                          className="group hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 hover:border-l-primary"
                          style={{ 
                            animationDelay: `${index * 50}ms`,
                            animation: 'slideIn 0.3s ease-out forwards'
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-3">
                              {/* Question Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                  {question.question_name}
                                </h4>
                                
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge 
                                    variant={getDifficultyVariant(question.difficulty)}
                                    className="text-xs font-medium"
                                  >
                                    {question.difficulty}
                                  </Badge>
                                  <span className={`text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                    {formatTimeAgo(question.assigned_at)}
                                  </span>
                                </div>
                              </div>

                              {/* View Class Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewClass(question)}
                                className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                View Class
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
