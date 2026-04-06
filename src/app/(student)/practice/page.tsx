"use client";

import { useEffect, useState, useCallback } from 'react';
import { studentPracticeService, PracticeFilters } from '@/services/student/practice.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { PracticeResults } from '@/components/student/practice/PracticeResults';
import { PracticeFilters as PracticeFiltersComponent } from '@/components/student/practice/PracticeFilters';
import { PracticeHeader } from '@/components/student/practice/PracticeHeader';
import { handleToastError } from "@/utils/toast-system";


export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState<PracticeFilters>({
    search: searchParams.get('search') || '',
    topic: searchParams.get('topic') || '',
    level: searchParams.get('level') || '',
    platform: searchParams.get('platform') || '',
    type: searchParams.get('type') || '',
    solved: searchParams.get('solved') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: 10
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    levels: string[];
    platforms: string[];
    types: string[];
  }>({
    levels: [],
    platforms: [],
    types: []
  });

  // Check if any filters are active (excluding page and limit)
  const hasActiveFilters = !!(filters.search || filters.topic || filters.level || filters.platform || filters.type || filters.solved);

  // Sync state to URL and fetch
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentPracticeService.getQuestions(filters);
      console.log('Practice API Response:', data); // Debug log
      setQuestions(data.questions || []);

      // Extract total items from backend response structure
      const totalItemsCount = data.pagination?.totalQuestions || data.totalItems || data.totalCount || 0;
      const totalPagesCount = data.pagination?.totalPages || data.totalPages || 1;

      console.log('Pagination Data:', { totalItemsCount, totalPagesCount }); // Debug log

      setTotalPages(totalPagesCount);
      setTotalItems(totalItemsCount);

      // Set filter options from API response
      if (data.filters) {
        setFilterOptions({
          levels: data.filters.levels || [],
          platforms: data.filters.platforms || [],
          types: data.filters.types || []
        });
      }

      // Update URL safely
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, String(val));
      });
      router.replace(`?${params.toString()}`, { scroll: false });

    } catch (e) {
      handleToastError(e);
      console.error("Failed to fetch practice questions", e);
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    // Debounce search text changes
    const timeout = setTimeout(() => {
      fetchQuestions();
    }, 400);
    return () => clearTimeout(timeout);
  }, [filters, fetchQuestions]);

  const handleFilterChange = (key: keyof PracticeFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 only when changing filters other than page
      ...(key !== 'page' ? { page: 1 } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', topic: '', level: '', platform: '', type: '', solved: '', page: 1, limit: 10 });
  };

  // Extract unique topics from the current list (Ideally this comes from a dedicated endpoint in a real app)
  // But for MVP, we just use static options or let them search.

  return (
    
      <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
        <PracticeHeader />

        <PracticeFiltersComponent
          filters={filters}
          filterOptions={filterOptions}
          hasActiveFilters={hasActiveFilters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />

        <PracticeResults
          loading={loading}
          questions={questions}
          onRefresh={fetchQuestions}
        />

        {/* Pagination */}
        {(questions.length > 0 || loading) && (
          <div className="mt-8">
            <Pagination
              currentPage={filters.page || 1}
              totalItems={totalItems}
              limit={filters.limit || 10}
              onPageChange={(page) => handleFilterChange('page', page)}
              onLimitChange={(limit) => handleFilterChange('limit', limit)}
              showLimitSelector={true}
              loading={loading}
            />
          </div>
        )}
      </div>
    
  );
}
