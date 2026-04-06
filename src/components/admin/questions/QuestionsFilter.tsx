"use client";

import React from 'react';
import { Search, Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';
import { InfiniteScrollDropdown } from '@/components/ui/InfiniteScrollDropdown';
import { useSearchParams, useRouter } from 'next/navigation';

interface QuestionsFilterProps {
  qSearch: string;
  setQSearch: (value: string) => void;
  qLevel: string;
  setQLevel: (value: string) => void;
  qPlatform: string;
  setQPlatform: (value: string) => void;
  setIsCreateOpen: (open: boolean) => void;
  setIsBulkUploadOpen: (open: boolean) => void;
  setPage: (page: number) => void;
}

export default function QuestionsFilter({
  qSearch,
  setQSearch,
  qLevel,
  setQLevel,
  qPlatform,
  setQPlatform,
  setIsCreateOpen,
  setIsBulkUploadOpen,
  setPage,
}: QuestionsFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasActiveFilters = () => {
    const topic = searchParams.get('topic');
    return (
      qSearch ||
      qLevel ||
      qPlatform ||
      (topic && topic !== 'all')
    );
  };

  const clearAllFilters = () => {
    setQSearch('');
    setQLevel('');
    setQPlatform('');
    setPage(1);
    const params = new URLSearchParams();
    params.set('page', '1');
    router.replace(`/admin/questions?${params.toString()}`);
  };

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-4">
      {/* TOP ROW → SEARCH + BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* SEARCH */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search questions..."
            value={qSearch}
            onChange={(e) => {
              setQSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9! w-full h-11 rounded-xl bg-background/50"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => setIsBulkUploadOpen(true)}
            variant="outline"
            className="h-11 rounded-xl px-4 border-border hover:bg-muted/40"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-11 rounded-xl px-5 bg-primary text-black font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* BOTTOM ROW → FILTERS */}
      <div className='flex justify-between'>
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={qLevel}
            onChange={(v) => { setQLevel(v as string); setPage(1); }}
            options={[
              { label: 'All Difficulties', value: '' },
              { label: 'Easy', value: 'EASY' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Hard', value: 'HARD' },
            ]}
            className="w-[150px] border"
          />

          <Select
            value={qPlatform}
            onChange={(v) => { setQPlatform(v as string); setPage(1); }}
            options={[
              { label: 'All Platforms', value: '' },
              { label: 'LeetCode', value: 'LEETCODE' },
              { label: 'GFG', value: 'GFG' },
              { label: 'InterviewBit', value: 'INTERVIEWBIT' },
            ]}
            className="w-[170px] border"
          />

          {/* Topic - New Infinite Scroll Dropdown */}
          <InfiniteScrollDropdown
            value={searchParams.get('topic') || ''}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams.toString());
              if (value && value !== '') params.set('topic', value);
              else params.delete('topic');
              params.set('page', '1');
              router.replace(`/admin/questions?${params.toString()}`);
            }}
            placeholder="Topics"
            searchPlaceholder="Search topics..."
            className="w-[200px]"
          />
        </div>
        <div>
          {/* CLEAR FILTER */}
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="h-10 p-4 py-5 fw-bold text-sm border border-border"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
