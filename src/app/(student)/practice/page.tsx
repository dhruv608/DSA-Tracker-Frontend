"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { studentPracticeService, PracticeFilters } from '@/services/student/practice.service';
import { QuestionRow } from '@/components/student/questions/QuestionRow';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from '@/components/Pagination';

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
    limit: 15
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state to URL and fetch
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentPracticeService.getQuestions(filters);
      setQuestions(data.questions || []);
      setTotalPages(data.totalPages || 1);

      // Update URL safely
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, String(val));
      });
      router.replace(`?${params.toString()}`, { scroll: false });
      
    } catch (e) {
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
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on new filter
  };

  const clearFilters = () => {
    setFilters({ search: '', topic: '', level: '', platform: '', type: '', solved: '', page: 1, limit: 15 });
  };

  // Extract unique topics from the current list (Ideally this comes from a dedicated endpoint in a real app)
  // But for MVP, we just use static options or let them search.

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      
      <div className="mb-8">
        <h1 className="font-serif italic text-3xl font-bold text-foreground mb-2">
          Practice <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">Problems</span>
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Filter and search through all assigned questions to master specific concepts.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border p-4 rounded-2xl mb-6 shadow-sm flex flex-col gap-4">
        
        {/* Search */}
        <div className="flex bg-secondary/30 border border-border rounded-xl p-1 shrink-0 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all items-center">
          <Search className="w-4 h-4 text-muted-foreground ml-3 mr-2" />
          <input 
            type="text" 
            placeholder="Search questions by name..." 
            className="flex-1 bg-transparent border-none text-[13.5px] outline-none px-2 py-2"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Select 
            value={filters.level || "ALL"} 
            onValueChange={(val) => handleFilterChange('level', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-secondary/30 border-border rounded-lg text-[12.5px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.platform || "ALL"} 
            onValueChange={(val) => handleFilterChange('platform', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-secondary/30 border-border rounded-lg text-[12.5px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Platforms</SelectItem>
              <SelectItem value="LEETCODE">LeetCode</SelectItem>
              <SelectItem value="GFG">GFG</SelectItem>
              <SelectItem value="INTERVIEWBIT">InterviewBit</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.type || "ALL"} 
            onValueChange={(val) => handleFilterChange('type', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-secondary/30 border-border rounded-lg text-[12.5px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CLASSWORK">Classwork</SelectItem>
              <SelectItem value="HOMEWORK">Homework</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.solved || "ALL"} 
            onValueChange={(val) => handleFilterChange('solved', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-secondary/30 border-border rounded-lg text-[12.5px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="true">Solved ✓</SelectItem>
              <SelectItem value="false">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          <button 
            onClick={clearFilters}
            className="border-2 border-border/50 text-muted-foreground rounded-lg px-3 py-2 text-[12.5px] font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-3 min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
             <div className="animate-pulse flex gap-2 text-primary font-mono text-[13px]">
               Loading<span className="animate-bounce inline-block">.</span><span className="animate-bounce inline-block" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce inline-block" style={{animationDelay: '0.2s'}}>.</span>
             </div>
          </div>
        ) : questions.length > 0 ? (
          questions.map((q: any, idx) => (
            <div key={q.id} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 20}ms`, animationFillMode: 'both' }}>
              <QuestionRow 
                questionName={q.question_name}
                platform={q.platform}
                level={q.level}
                type={q.type}
                isSolved={q.isSolved || false}
                link={q.question_link}
                topicName={q.topic?.topic_name}
              />
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed p-10">
            <Search className="w-10 h-10 mb-4 opacity-50 text-muted-foreground" />
            <div className="font-semibold text-foreground mb-1">No questions found</div>
            <div className="text-[13px]">Try adjusting your search or filters.</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination 
            currentPage={filters.page || 1}
            totalItems={totalPages * (filters.limit || 15)} // Approximated totalItems since DB provides totalPages natively
            limit={filters.limit || 15}
            onPageChange={(page) => handleFilterChange('page', page)}
          />
        </div>
      )}

    </div>
  );
}
