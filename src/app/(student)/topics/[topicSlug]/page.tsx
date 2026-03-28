"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentTopicService } from '@/services/student/topic.service';
import { ClassCard } from '@/components/student/classes/ClassCard';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';
import { SubtopicBackNav } from '@/components/student/subtopics/SubtopicBackNav';
import { SubtopicHeader } from '@/components/student/subtopics/SubtopicHeader';
import { SubtopicLoading } from '@/components/student/subtopics/SubtopicLoading';
import { Pagination } from '@/components/Pagination';
import { handleError } from "@/utils/handleError";

export default function TopicDetailsPage() {
  const { topicSlug } = useParams() as { topicSlug: string };
  const router = useRouter();

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const data = await studentTopicService.getTopicOverview(topicSlug);
        setTopic(data);
      } catch (e) {
        handleError(e);
        console.error("Topic fetch error", e);
        router.push('/topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicSlug, router]);

  if (loading) {
    return <SubtopicLoading />;
  }

  if (!topic) return null;

  const progress = (topic.overallProgress?.totalQuestions || 0) === 0
    ? 0
    : (topic.overallProgress.solvedQuestions / topic.overallProgress.totalQuestions) * 100;

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

  // Function to fetch topic with pagination
  const fetchTopicWithPagination = async (page: number, pageSize: number) => {
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
      handleError(e);
      console.error("Topic fetch error", e);
      router.push('/topics');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
    <SubtopicBackNav />
    <SubtopicHeader topic={topic} progress={progress} />
    
    {/* Classes Section with Pagination */}
    <div>
      <h2 className="text-[14px] font-mono font-medium text-muted-foreground tracking-widest uppercase mb-5">
        Classes
      </h2>
      
      <div className="flex flex-col gap-3 mb-6">
        {classes.length > 0 ? (
          classes.map((cls: any, idx: number) => (
            <div
              key={cls.slug}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
            >
              <ClassCard
                topicSlug={topic.slug}
                classSlug={cls.slug}
                index={(pagination?.page - 1) * (pagination?.limit || 10) + idx + 1}
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

      {/* Pagination Component */}
      {totalItems > 0 && (
        <Pagination
          currentPage={pagination?.page || 1}
          totalItems={totalItems}
          limit={pagination?.limit || 10}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
        />
      )}
    </div>
  </div>
);
}
