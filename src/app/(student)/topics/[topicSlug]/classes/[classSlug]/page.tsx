"use client";

import React, { useEffect, useState } from 'react';
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
import { handleToastError } from "@/utils/toast-system";

export default function ClassDetailsPage() {
  const { topicSlug, classSlug } = useParams() as { topicSlug: string; classSlug: string };
  const router = useRouter();

  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('all');

  const fetchClassDetails = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        filter: filter
      });
      
      const data = await studentClassService.getClassDetailsWithPagination(topicSlug, classSlug, queryParams.toString());
      setClassData(data);
    } catch (e) {
      handleToastError(e);
      console.error("Class detail fetch error", e);
      router.push(`/topics/${topicSlug}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [topicSlug, classSlug, currentPage, limit, filter, router]);

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
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
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

      {/* Filter and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-6">
        <div className="flex items-center gap-5">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {pagination?.total || 0} questions
        </div>
      </div>

      <ClassQuestions questions={questions} onRefresh={fetchClassDetails} />

      {/* Pagination */}
      {pagination && pagination.total > limit && (
        <Pagination
          currentPage={pagination.page || 1}
          totalItems={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
          loading={loading}
        />
      )}
    </div>
  );
}
