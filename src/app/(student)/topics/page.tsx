"use client";

import { useEffect, useState } from 'react';
import { studentTopicService } from '@/services/student/topic.service';
import { Pagination } from '@/components/Pagination';
import { TopicsLoading } from '@/components/student/topics/TopicLoading';
import { TopicsHeader } from '@/components/student/topics/TopicsHeader';
import { TopicsGrid } from '@/components/student/topics/TopicsGrid';
import { handleToastError } from "@/utils/toast-system";

export default function TopicsPage() {
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await studentTopicService.getTopics({
          page,
          limit: itemsPerPage,
          search: searchQuery.trim() || undefined
        });
        setTopicsData(response.topics || []);
        setPagination(response.pagination);
      } catch (e) {
        handleToastError(e);
        console.error("Topics fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [page, itemsPerPage, searchQuery]);


  return (
   
      <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
        <TopicsHeader
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query);
            setPage(1); // Reset to first page when searching
          }}
        />
        
        {loading ? (
          <TopicsLoading />
        ) : (
          <>
            <TopicsGrid
              topics={topicsData}
              searchQuery={searchQuery}
              pagination={
                pagination && (
                  <Pagination 
                    currentPage={pagination.page}
                    totalItems={pagination.total}
                    limit={pagination.limit}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                      setItemsPerPage(newLimit);
                      setPage(1); // Reset to first page when changing limit
                    }}
                    showLimitSelector={true}
                    loading={loading}
                  />
                )
              }
            />
          </>
        )}
        
      </div>
    
  );
}
