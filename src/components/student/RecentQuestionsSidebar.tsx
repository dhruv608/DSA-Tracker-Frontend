"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { useRecentQuestions } from "@/contexts/RecentQuestionsContext";

interface RecentQuestion {
  question_id: number;
  question_name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic_slug: string;
  class_slug: string;
  assigned_at: string;
}

export function RecentQuestionsSidebar() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useRecentQuestions();
  const [questions, setQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch
  const fetchRecentQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        "/api/students/recent-questions?days=7"
      );
      setQuestions(response.data.questions);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to fetch recent questions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentQuestions();
    const interval = setInterval(fetchRecentQuestions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Time formatting
  const formatTimeAgo = (assigned_at: string) => {
    const now = new Date();
    const assigned = new Date(assigned_at);
    const diffMs = now.getTime() - assigned.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
      return diffMinutes < 5 ? "NEW" : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return "1w+ ago";
    }
  };

  const handleViewClass = (question: RecentQuestion) => {
    router.push(
      `/topics/${question.topic_slug}/classes/${question.class_slug}`
    );
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "default";
      case "medium":
        return "secondary";
      case "hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-[380px] md:w-[420px] bg-background border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
            
            <Card className="h-full rounded-none border-none shadow-none bg-transparent">

              {/* Header */}
              <CardHeader className="border-b border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Questions
                  </CardTitle>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-80px)] px-4 py-4">

                  {loading ? (
                    <div className="flex items-center justify-center p-10">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-destructive">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchRecentQuestions}
                        className="mt-3"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">
                      <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        No recent questions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">

                      {questions.map((question, index) => (
                        <Card
                          key={question.question_id}
                          className="group glass border border-white/5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                          style={{
                            animationDelay: `${index * 60}ms`,
                            animation: "slideIn 0.35s ease forwards",
                          }}
                        >
                          <CardContent className="p-4">

                            <div className="flex justify-between items-center gap-4">

                              {/* Left */}
                              <div className="flex-1 min-w-0">

                                <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                  {question.question_name}
                                </h4>

                                <div className="flex items-center gap-2">

                                  <Badge
                                    variant={getDifficultyVariant(
                                      question.difficulty
                                    )}
                                    className="text-xs font-medium"
                                  >
                                    {question.difficulty}
                                  </Badge>

                                  {/* ✅ FIXED TIME COLOR */}
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {formatTimeAgo(
                                      question.assigned_at
                                    )}
                                  </span>

                                </div>
                              </div>

                              {/* Right */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewClass(question)
                                }
                                className="shrink-0 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-primary hover:text-black transition-all"
                              >
                                View
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

      {/* Animation */}
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