"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { topicsService, Topic, TopicsResponse } from '@/services/topics.service';

// Custom debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Shimmer component
const Shimmer = () => (
  <div className="p-3 space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-muted/60 rounded animate-pulse"></div>
        <div className="h-3 bg-muted/40 rounded w-3/4 animate-pulse"></div>
      </div>
    ))}
  </div>
);

interface InfiniteScrollDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function InfiniteScrollDropdown({
  value = "",
  onValueChange,
  placeholder = "Select Topic",
  searchPlaceholder = "Search topics...",
  loading = false,
  disabled = false,
  className = "",
}: InfiniteScrollDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state when search changes
  const resetTopics = useCallback(() => {
    setTopics([]);
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  // Fetch topics with pagination
  const fetchTopics = useCallback(async (page: number, search: string, isReset: boolean = false) => {
    if (loadingTopics || (!hasMore && !isReset)) return;
    
    setLoadingTopics(true);
    try {
      const response: TopicsResponse = await topicsService.getPaginatedTopics({
        page,
        limit: 6,
        search
      });
      
      if (isReset) {
        setTopics(response.topics);
      } else {
        setTopics(prev => [...prev, ...response.topics]);
      }
      
      setHasMore(response.pagination.hasNextPage);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoadingTopics(false);
    }
  }, [loadingTopics, hasMore]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      resetTopics();
      fetchTopics(1, search, true);
    }, 300),
    [fetchTopics, resetTopics]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle topic selection
  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    onValueChange(topic.slug);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Clear selection
  const handleClear = () => {
    setSelectedTopic(null);
    onValueChange("");
    setSearchQuery("");
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Focus search input when opening
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (isOpen && topics.length === 0) {
      fetchTopics(1, "", true);
    }
  }, [isOpen, fetchTopics, topics.length]);

  // Set selected topic from value prop
  useEffect(() => {
    if (value) {
      const found = topics.find(topic => topic.slug === value);
      if (found) {
        setSelectedTopic(found);
      } else {
        // If not found in current topics, search for it
        topicsService.getPaginatedTopics({ search: value }).then(response => {
          const found = response.topics.find(topic => topic.slug === value);
          if (found) {
            setSelectedTopic(found);
          }
        });
      }
    } else {
      setSelectedTopic(null);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Infinite scroll detection
  useEffect(() => {
    if (!isOpen || !hasMore || loadingTopics) return;

    const handleScroll = () => {
      if (!listRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      
      // Load more when user scrolls to 80% of the content
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        if (!loadingTopics && hasMore) {
          fetchTopics(currentPage + 1, searchQuery);
        }
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen, hasMore, loadingTopics, currentPage, searchQuery, fetchTopics]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={toggleDropdown}
        className={`
        flex items-center justify-between gap-2
        h-10 px-4 rounded-full
        bg-accent/40
        border-border border-border
        text-m font-medium
        transition-all duration-200
        hover:bg-accent/60
        focus:outline-none
        focus:ring-2 focus:ring-primary/20
        focus:border-border-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        data-placeholder:text-muted-foreground
        [&_svg]:size-4 [&_svg]:text-muted-foreground
        cursor-pointer
        ${className}
      `}
      >
        <span className="truncate">
          {selectedTopic ? selectedTopic.topic_name : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedTopic && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-0.5 rounded hover:bg-accent/60 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </div>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className={`
          z-50
          min-w-[180px]
          max-h-64
          overflow-y-auto overflow-x-hidden
          rounded-2xl
          bg-[var(--glass-bg)]
          backdrop-blur-md
          border-border border-[var(--glass-border)]
          p-1.5
          shadow-lg
          scroll-smooth
          no-scrollbar
          absolute top-full left-0 right-0 mt-1
        `}>
          {/* Search Input */}
          <div className="p-2 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-accent/40 border border-border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border-primary"
              />
            </div>
          </div>

          {/* Topics List */}
          <div ref={listRef} className="max-h-60 overflow-y-auto p-1 no-scrollbar">
            {topics.length === 0 && !loadingTopics && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {searchQuery ? "No topics found" : "No topics available"}
              </div>
            )}

            {topics.map((topic, index) => (
              <button
                key={`${topic.id}-${index}`}
                type="button"
                onClick={() => handleTopicSelect(topic)}
                className={`
                relative flex items-center gap-2
                px-3 py-2 rounded-lg
                text-foreground/90
                text-sm font-medium
                cursor-pointer select-none outline-none
                transition-all duration-200
                hover:text-foreground
                hover:bg-accent/60
                hover:scale-105
                focus:bg-accent
                focus:text-foreground
                w-full text-left
              `}
              >
                <div>
                  <div className="font-medium">{topic.topic_name}</div>
                  <div className="text-xs text-muted-foreground">{topic.slug}</div>
                </div>
                {selectedTopic?.slug === topic.slug && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}

            {/* Loading Shimmer */}
            {loadingTopics && <Shimmer />}

            {/* No More Topics */}
            {!hasMore && topics.length > 0 && (
              <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/60">
                No more topics
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
