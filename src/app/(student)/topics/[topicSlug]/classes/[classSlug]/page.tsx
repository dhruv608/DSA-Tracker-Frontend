"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentClassService } from '@/services/student/class.service';
import { QuestionRow } from '@/components/student/questions/QuestionRow';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';
import { Calendar, Clock, FileText } from 'lucide-react';
import { ClassBackNav } from '@/components/student/classes/ClassBackNav';
import { ClassHeader } from '@/components/student/classes/ClassHeader';
import { ClassQuestions } from '@/components/student/classes/ClassQuestions';
import { ClassDetailsShimmer } from '@/components/student/classes/ClassDetailsShimmer';
import { Pagination } from '@/components/Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PracticeQuestion } from '@/types/student/index.types';

interface ClassData {
  topic?: { topic_name: string };
  questions?: PracticeQuestion[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  totalQuestions?: number;
  solvedQuestions?: number;
  class_date?: string;
  class_name: string;
  duration_minutes?: number;
  pdf_url?: string;
  description?: string;
}

export default function ClassDetailsPage() {
  const { topicSlug, classSlug } = useParams() as { topicSlug: string; classSlug: string };
  const router = useRouter();

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('all');
  const isFetching = useRef(false);
  const lastFetchParams = useRef({ currentPage: 1, limit: 10, filter: 'all' });

  const fetchClassDetails = useCallback(async () => {
    const currentParams = { currentPage, limit, filter };
    
    // Skip if already fetching with same params
    if (isFetching.current) {
      const sameParams = 
        lastFetchParams.current.currentPage === currentPage &&
        lastFetchParams.current.limit === limit &&
        lastFetchParams.current.filter === filter;
      
      if (sameParams) {
        return;
      }
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;
    
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        filter: filter
      });
      
      const data = await studentClassService.getClassDetailsWithPagination(topicSlug, classSlug, queryParams.toString());
      setClassData(data);
    } catch (e) {
      // Error is handled by API client interceptor
      console.error("Class detail fetch error", e);
      router.push(`/topics/${topicSlug}`);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [topicSlug, classSlug, currentPage, limit, filter, router]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  if (loading) {
    return <ClassDetailsShimmer />;
  }

  if (!classData) return null;

  const questions = classData.questions || [];
  const pagination = classData.pagination;
  const totalQuestions = classData.totalQuestions || 0;
  const solvedQuestions = classData.solvedQuestions || 0;
  const progress = totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  const formattedDate = classData.class_date
    ? new Date(classData.class_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

return (
  <div className="flex flex-col  mx-auto max-w-325 xl:max-w-275 2xl:max-w-325 w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">

    <ClassBackNav
      topicSlug={topicSlug}
      topicName={classData.topic?.topic_name}
    />

    <ClassHeader
      classData={classData}
      progress={progress}
      solvedQuestions={solvedQuestions}
      totalQuestions={totalQuestions}
      formattedDate={formattedDate}
    />

    {/* 🔥 FILTER BAR */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 rounded-2xl glass bg-background/40 backdrop-blur-xl">

      {/* LEFT */}
      <div className="flex items-center gap-4">


        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="h-9 rounded-2xl bg-muted border border-border px-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Questions</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* RIGHT */}
      <div className=" text-primary flex items-center gap-1">

        <span className="text-xs ">
          Showing
        </span>

        <span className="text-xs font-medium   ">
          {pagination?.total || 0}
        </span>

        <span className="text-xs ">
          questions
        </span>

      </div>
    </div>

    {/* QUESTIONS */}
    <ClassQuestions
      classSlug={classSlug}
      topicSlug={topicSlug}
      questions={questions}
      onRefresh={fetchClassDetails}
      loading={loading}
    />

    {/* PAGINATION */}
    {pagination && pagination.total > limit && (
      <div className="mt-10">
        <Pagination
          currentPage={pagination.page || 1}
          totalItems={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
          loading={loading}
        />
      </div>
    )}

  </div>
);
}
