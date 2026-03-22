"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { studentTopicService } from '@/services/student/topic.service';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'recent' | 'old'>('recent');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortOrder]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await studentTopicService.getTopics();
        setTopics(topicsData);
      } catch (e) {
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

    result.sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return sortOrder === 'recent' ? timeB - timeA : timeA - timeB;
    });

    const unlocked = result.filter(t => (t.batchSpecificData?.totalClasses || 0) > 0);
    const locked = result.filter(t => (t.batchSpecificData?.totalClasses || 0) === 0);

    return [...unlocked, ...locked];
  }, [topics, searchQuery, sortOrder]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedTopics = filteredAndSortedTopics.slice(start, start + ITEMS_PER_PAGE);
  const totalItems = filteredAndSortedTopics.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif italic text-3xl font-bold text-foreground mb-3">
              Learning <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">Modules</span>
            </h1>
            <p className="text-[14px] text-muted-foreground max-w-2xl">
              Track your progress across different data structure and algorithm topics. Complete classes and solve questions to master each module.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-secondary/30 border border-border rounded-xl p-1 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all items-center">
              <Search className="w-4 h-4 text-muted-foreground ml-3 mr-2" />
              <input 
                type="text" 
                placeholder="Search topics..." 
                className="w-[180px] bg-transparent border-none text-[13.5px] outline-none px-2 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="h-[42px] px-4 rounded-xl text-[13px] bg-card hover:bg-secondary border-border"
              onClick={() => setSortOrder(prev => prev === 'recent' ? 'old' : 'recent')}
            >
              <ArrowUpDown className="w-4 h-4 mr-2 text-primary" />
              {sortOrder === 'recent' ? 'Newest' : 'Oldest'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {paginatedTopics.length > 0 ? (
          paginatedTopics.map((t: any, idx: number) => {
            return (
              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }} key={t.slug}>
                <TopicCard
                  topicSlug={t.slug}
                  topicName={t.topic_name}
                  photoUrl={t.photo_url}
                  totalQuestions={t.batchSpecificData?.totalQuestions || 0}
                  solvedQuestions={t.batchSpecificData?.solvedQuestions || 0}
                  totalClasses={t.batchSpecificData?.totalClasses || 0}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
            {searchQuery ? "No topics matched your search." : "No topics assigned to your batch yet."}
          </div>
        )}
      </div>

      {!loading && totalItems > 0 && (
        <Pagination 
          currentPage={page}
          totalItems={totalItems}
          limit={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      )}

    </div>
  );
}
