"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bookmark as BookmarkIcon, ExternalLink, Edit2, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import { bookmarkService, Bookmark, BookmarksResponse } from '@/services/bookmark.service';
import { EditBookmarkModal } from '@/components/student/bookmarks/EditBookmarkModal';
import { DeleteModal } from '@/components/DeleteModal';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pagination, setPagination] = useState<BookmarksResponse['pagination']>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'old'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingBookmark, setUpdatingBookmark] = useState(false);

  const isFetching = useRef(false);
  const lastFetchParams = useRef({ page: 1, limit: 10, sort: 'recent', filter: 'all' });

  const fetchBookmarks = async () => {
    const currentParams = { page: pagination.page, limit: pagination.limit, sort: sortBy, filter: filterBy };

    if (isFetching.current) {
      const sameParams =
        lastFetchParams.current.page === pagination.page &&
        lastFetchParams.current.limit === pagination.limit &&
        lastFetchParams.current.sort === sortBy &&
        lastFetchParams.current.filter === filterBy;

      if (sameParams) return;
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;

    try {
      setLoading(true);
      const response = await bookmarkService.getBookmarks({
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        filter: filterBy
      });
      setBookmarks(response.bookmarks);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [pagination.page, pagination.limit, sortBy, filterBy]);

  const handleDeleteBookmark = (bookmark: Bookmark) => {
    setDeletingBookmark(bookmark);
    setShowDeleteModal(true);
  };

  const confirmDeleteBookmark = async () => {
    if (!deletingBookmark) return;

    try {
      await bookmarkService.deleteBookmark(deletingBookmark.question.id);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    } finally {
      setShowDeleteModal(false);
      setDeletingBookmark(null);
    }
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowEditModal(true);
  };

  const handleUpdateBookmark = async (description: string) => {
    if (!editingBookmark) return;

    try {
      setUpdatingBookmark(true);
      await bookmarkService.updateBookmark(editingBookmark.question.id, description);
      setShowEditModal(false);
      setEditingBookmark(null);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    } finally {
      setUpdatingBookmark(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-easy bg-easy/10 border-easy/20';
      case 'MEDIUM': return 'text-medium bg-medium/10 border-medium/20';
      case 'HARD': return 'text-hard bg-hard/10 border-hard/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-325 xl:max-w-275 2xl:max-w-325">

      {/* HEADER */}
      <div className="mb-8 px-5 py-4 backdrop-blur-sm rounded-2xl glass">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookmarkIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            My <span className='text-primary'>Bookmarks</span>
          </h1>
        </div>
        <p className="text-muted-foreground ml-11">
          Your saved questions for practice
        </p>
      </div>

      {/* FILTERS */}
      <div className="glass backdrop-blur-sm rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">

          <div className="flex items-center gap-3">
            <label className="text-m font-medium text-foreground">Sort By:</label>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[140px] bg-transparent border border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="old">Old</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-m font-medium text-foreground">Filter By:</label>
            <Select value={filterBy} onValueChange={(v: any) => setFilterBy(v)}>
              <SelectTrigger className="w-[140px] bg-transparent border border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="space-y-3 p-5 rounded-2xl glass backdrop-blur-md">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-start rounded-2xl border border-border/60 px-6 py-5"
            >
              {/* LEFT SIDE SKELETON */}
              <div className="flex flex-col gap-3 flex-1">
                {/* TITLE SKELETON */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                </div>

                {/* BADGES SKELETON */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Skeleton className="h-6 w-16 rounded-2xl" />
                  <Skeleton className="h-6 w-24 rounded-2xl" />
                </div>

                {/* DESCRIPTION SKELETON */}
                <Skeleton className="h-3 w-64" />
              </div>

              {/* RIGHT SIDE SKELETON */}
              <div className="flex flex-col items-end gap-3 ml-6">
                {/* ACTION BUTTONS SKELETON */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16 rounded-2xl" />
                  <Skeleton className="h-8 w-16 rounded-2xl" />
                </div>

                {/* DATE SKELETON */}
                <Skeleton className="h-6 w-32 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 p-5 rounded-2xl glass backdrop-blur-md">

          {bookmarks.map((bookmark) => {
            const platform = bookmark.question.platform?.toLowerCase();

            const platformData =
              platform?.includes("leetcode")
                ? { name: "LeetCode", icon: <LeetCodeIcon className="w-3.5 h-3.5 text-orange-500" /> }
                : platform?.includes("gfg")
                  ? { name: "GeeksForGeeks", icon: <GeeksforGeeksIcon className="w-3.5 h-3.5 text-green-500" /> }
                  : { name: bookmark.question.platform, icon: null };

            return (
              <div
                key={bookmark.id}
                className="flex justify-between items-start rounded-2xl border border-border/60 px-6 py-5 hover:border-primary/30 transition-all duration-300"
              >
                {/* LEFT SIDE */}
                <div className="flex flex-col gap-3 flex-1">

                  {/* 🔥 TITLE + LINK */}
                  <div
                    className="flex items-center gap-2 cursor-pointer group w-fit"
                    onClick={() => {
                      if (bookmark.question.question_link) {
                        window.open(bookmark.question.question_link, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                      {bookmark.question.question_name}
                    </h3>

                    <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100" />

                    {bookmark.isSolved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  {/* 🔥 BADGES */}
                  <div className="flex items-center gap-3 flex-wrap text-[11px]">

                    {/* LEVEL */}
                    <span
                      className={`px-3 py-1 rounded-2xl border font-semibold ${getLevelColor(
                        bookmark.question.level
                      )}`}
                    >
                      {bookmark.question.level}
                    </span>

                    {/* PLATFORM */}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-2xl border border-border bg-muted text-muted-foreground font-medium">
                      {platformData.icon}
                      {platformData.name}
                    </span>
                  </div>

                  {/* DESCRIPTION (optional) */}
                  {bookmark.description && (
                    <p className="text-xs text-muted-foreground">
                      {bookmark.description}
                    </p>
                  )}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col items-end gap-3 ml-6">

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBookmark(bookmark)}
                      disabled={updatingBookmark}
                      className="rounded-2xl px-3"
                    >
                      {updatingBookmark ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBookmark(bookmark)}
                      className="rounded-2xl px-3 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {/* DATE */}
                  <div className="text-xs px-3 py-1.5 rounded-2xl border border-border bg-muted text-muted-foreground">
                    Bookmarked on{" "}
                    {new Date(bookmark.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-8">
        <Pagination
          currentPage={pagination.page}
          totalItems={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      </div>

      {/* MODALS */}
      {editingBookmark && (
        <EditBookmarkModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          bookmark={editingBookmark}
          onSubmit={handleUpdateBookmark}
          loading={updatingBookmark}
        />
      )}

      {deletingBookmark && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteBookmark}
          title="Delete Bookmark"
          itemName={deletingBookmark.question.question_name} submitting={false} warningText={''} />
      )}
    </div>
  );
}