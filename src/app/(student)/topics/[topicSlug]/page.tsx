"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentTopicService } from '@/services/student/topic.service';
import { ClassCard } from '@/components/student/classes/ClassCard';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';
import { SubtopicBackNav } from '@/components/student/subtopics/SubtopicBackNav';
import { SubtopicHeader } from '@/components/student/subtopics/SubtopicHeader';
import { TopicDetailsShimmer } from '@/components/student/subtopics/TopicDetailsShimmer';
import { Pagination } from '@/components/Pagination';
import { Class } from '@/types/student/index.types';

interface TopicWithPagination {
  id: number;
  topic_name: string;
  slug: string;
  photo_url?: string;
  total_questions: number;
  solved_questions: number;
  total_classes: number;
  description?: string;
  overallProgress?: {
    totalQuestions: number;
    solvedQuestions: number;
  };
  classes?: Class[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function TopicDetailsPage() {
  const { topicSlug } = useParams() as { topicSlug: string };
  const router = useRouter();

  const [topic, setTopic] = useState<TopicWithPagination | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isFetching = useRef(false);
  const lastFetchParams = useRef({ currentPage: 1, limit: 10 });

  const fetchTopicWithPagination = useCallback(async (page: number, pageSize: number) => {
    const currentParams = { currentPage: page, limit: pageSize };
    
    // Skip if already fetching with same params
    if (isFetching.current) {
      const sameParams = 
        lastFetchParams.current.currentPage === page &&
        lastFetchParams.current.limit === pageSize;
      
      if (sameParams) {
        return;
      }
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;
    
    setLoading(true);
    try {
      // Create query params string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });
      
      const data = await studentTopicService.getTopicOverviewWithPagination(topicSlug, queryParams.toString());
      setTopic(data);
    } catch (e) {
      // Error is handled by API client interceptor
      console.error("Topic fetch error", e);
      router.push('/topics');
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [topicSlug, router]);

  useEffect(() => {
    fetchTopicWithPagination(currentPage, limit);
  }, [topicSlug, currentPage, limit, fetchTopicWithPagination]);

  if (loading) {
    return <TopicDetailsShimmer />;
  }

  if (!topic) return null;

  const progress = (topic.overallProgress?.totalQuestions || 0) === 0
    ? 0
    : topic.overallProgress
    ? (topic.overallProgress.solvedQuestions / topic.overallProgress.totalQuestions) * 100
    : 0;

  // Pagination logic for classes (now using backend pagination)
  const classes = topic.classes || [];
  const pagination = topic.pagination;
  const totalItems = pagination?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Refetch data with new page
    fetchTopicWithPagination(page, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    // Refetch data with new limit
    fetchTopicWithPagination(1, newLimit);
  };

return (
  <div className="flex flex-col  mx-auto max-w-325 xl:max-w-275 2xl:max-w-325 w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">

    <SubtopicBackNav />
    <SubtopicHeader topic={topic} progress={progress} />

    {/* 🔥 CLASSES SECTION */}
    <div className="mt-6 rounded-2xl border border-border/40 bg-background/40 glass backdrop-blur-xl p-5 sm:p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-sm font-mono font-medium text-muted-foreground tracking-widest uppercase">
          Classes
        </h2>

        
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3 mb-6">

        {classes.length > 0 ? (
          classes.map((cls: Class, idx: number) => (
            <div
              key={cls.slug}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${idx * 40}ms`,
                animationFillMode: 'both'
              }}
            >
              <ClassCard
                topicSlug={topic.slug}
                classSlug={cls.slug}
                index={((pagination?.page || 1) - 1) * (pagination?.limit || 10) + idx + 1}
                classNameTitle={cls.class_name}
                date={cls.date || cls.class_date || cls.classDate}
                totalQuestions={cls.total_questions || cls.totalQuestions || 0}
                solvedQuestions={cls.solved_questions || cls.solvedQuestions || 0}
                pdfUrl={cls.pdf_url}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center rounded-xl border border-dashed border-border/50 bg-background/30">
            <div className="text-sm text-muted-foreground mb-1">
              No classes available
            </div>
            <div className="text-xs text-muted-foreground/70">
              Classes will appear here once assigned.
            </div>
          </div>
        )}

      </div>

      {/* PAGINATION */}
      {totalItems > 0 && (
        <div className="pt-4 border-t border-border/40">
          <Pagination
            currentPage={pagination?.page || 1}
            totalItems={totalItems}
            limit={pagination?.limit || 10}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            showLimitSelector={true}
            loading={loading}
          />
        </div>
      )}

    </div>
  </div>
);
}
