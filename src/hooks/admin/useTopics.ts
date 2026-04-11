import { useState, useEffect, useCallback, useRef } from "react";
import { getAdminBatchTopics } from "@/services/admin.service";
import { Topic, TopicsResponse } from "@/types/admin/topic.types";

type UseTopicsParams = {
  batchSlug?: string;
  page: number;
  limit: number;
  search: string;
  sortBy: string;
};

export function useTopics({
  batchSlug,
  page,
  limit,
  search,
  sortBy,
}: UseTopicsParams) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const isFetching = useRef(false);
  const lastFetchParams = useRef<{ batchSlug?: string; page: number; limit: number; search: string; sortBy: string }>({
    page: 1,
    limit: 20,
    search: '',
    sortBy: 'recent'
  });

  const fetchTopics = useCallback(async () => {
    if (!batchSlug) return;

    // Skip if already fetching
    if (isFetching.current) {
      console.log("Already fetching topics, skipping duplicate call");
      return;
    }

    // Check if same params were already used
    const currentParams = { batchSlug, page, limit, search, sortBy };
    const sameParams = 
      lastFetchParams.current.batchSlug === batchSlug &&
      lastFetchParams.current.page === page &&
      lastFetchParams.current.limit === limit &&
      lastFetchParams.current.search === search &&
      lastFetchParams.current.sortBy === sortBy;

    if (sameParams) {
      console.log("Same params already fetched, skipping");
      return;
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;
    setLoading(true);
    try {
      const data: TopicsResponse = await getAdminBatchTopics(batchSlug, {
        page,
        limit,
        search,
        sortBy,
      });
      console.log("topics dataa: ", data);
      if (data?.topics) {
        setTopics(data.topics);
        setTotalRecords(data.pagination?.total || 0);
      } else if (Array.isArray(data)) {
        setTopics(data);
        setTotalRecords(data.length);
      }
    } catch (err) {
      // Error is handled by API client interceptor
      console.error("Failed to fetch topics", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [batchSlug, page, limit, search, sortBy]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Refetch function that resets params cache to force fresh data
  const refetch = useCallback(() => {
    lastFetchParams.current = { page: 0, limit: 0, search: '', sortBy: '' };
    fetchTopics();
  }, [fetchTopics]);

  return {
    topics,
    loading,
    totalRecords,
    refetch,
  };
}
