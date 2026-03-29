"use client";

import { useEffect, useState, useMemo } from 'react';
import { studentTopicService } from '@/services/student/topic.service';
import { Pagination } from '@/components/Pagination';
import { TopicsLoading } from '@/components/student/topics/TopicLoading';
import { TopicsHeader } from '@/components/student/topics/TopicsHeader';
import { TopicsGrid } from '@/components/student/topics/TopicsGrid';
import { handleToastError } from "@/utils/toast-system";

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await studentTopicService.getTopics();
        setTopics(topicsData);
      } catch (e) {
        handleToastError(e);
        console.error("Topics fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const filteredAndSortedTopics = useMemo(() => {
    let result = [...topics];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.topic_name.toLowerCase().includes(q));
    }

    // Separate unlocked and locked topics (unlocked topics first)
    const unlocked = result.filter(t => (t.batchSpecificData?.totalClasses || 0) > 0);
    const locked = result.filter(t => (t.batchSpecificData?.totalClasses || 0) === 0);

    return [...unlocked, ...locked];
  }, [topics, searchQuery]);

  const start = (page - 1) * itemsPerPage;
  const paginatedTopics = filteredAndSortedTopics.slice(start, start + itemsPerPage);
  const totalItems = filteredAndSortedTopics.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return <TopicsLoading />;
  }

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      <TopicsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <TopicsGrid
        topics={paginatedTopics}
        searchQuery={searchQuery}
      />

      {!loading && totalItems > 0 && (
        <Pagination 
          currentPage={page}
          totalItems={totalItems}
          limit={itemsPerPage || 10}
          onPageChange={setPage}
          onLimitChange={setItemsPerPage}
          showLimitSelector={true}
        />
      )}
      
    </div>
  );
}
