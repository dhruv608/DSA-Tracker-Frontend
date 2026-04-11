"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { apiClient } from '@/api';
import CreateClassModal from '@/components/admin/topics/topicSlug/CreateClassModal';
import EditClassModal from '@/components/admin/topics/topicSlug/EditClassModal';
import DeleteClassModal from '@/components/admin/topics/topicSlug/DeleteClassModal';
import DeletePdfModal from '@/components/admin/topics/topicSlug/DeletePdfModal';
import ClassHeader from '@/components/admin/topics/topicSlug/ClassHeader';
import ClassFilter from '@/components/admin/topics/topicSlug/ClassFilter';
import ClassTable from '@/components/admin/topics/topicSlug/ClassTable';
import {
  BookOpen,
} from 'lucide-react';
import { ClassesTableShimmer } from '@/components/admin/topics/topicSlug/ClassesTableShimmer';
import { Pagination } from '@/components/Pagination';
import { Class } from '@/types/admin/index.types';

export default function AdminClassesPage() {
  const params = useParams();
  const topicSlug = decodeURIComponent(params.topicSlug as string);

  const { selectedBatch, isLoadingContext } = useAdminStore();
  const [classesList, setClassesList] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletePdfOpen, setIsDeletePdfOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const isFetching = useRef(false);
  const lastFetchParams = useRef<{ topicSlug?: string; page: number; limit: number; search: string }>({
    page: 1,
    limit: 20,
    search: ''
  });

  const router = useRouter();
  const fetchClasses = async () => {
    if (!selectedBatch) return;

    // Skip if already fetching
    if (isFetching.current) {
      console.log("Already fetching classes, skipping duplicate call");
      return;
    }

    // Check if same params were already used
    const currentParams = { topicSlug, page, limit, search };
    const sameParams = 
      lastFetchParams.current.topicSlug === topicSlug &&
      lastFetchParams.current.page === page &&
      lastFetchParams.current.limit === limit &&
      lastFetchParams.current.search === search;

    if (sameParams) {
      console.log("Same params already fetched, skipping");
      return;
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      const response = await apiClient.get(`/api/admin/${selectedBatch.slug}/topics/${topicSlug}/classes?${params}`);
      setClassesList(response.data.data || []);
      setTotalRecords(response.data.pagination?.total || 0);
    } catch (err) {
      // Error is handled by API client interceptor
      console.error("Failed to fetch classes", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 when search changes
  }, [search]);

  useEffect(() => {
    fetchClasses();
  }, [selectedBatch, topicSlug, page, limit, search]);

  const openEdit = (cls: Class) => {
    setSelectedClass(cls);
    setIsEditOpen(true);
  };

  const openDelete = (cls: Class) => {
    setSelectedClass(cls);
    setIsDeleteOpen(true);
  };

  const openDeletePdf = () => {
    setIsDeletePdfOpen(true);
  };


  if (isLoadingContext) {
    return <ClassesTableShimmer />;
  }

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl">
        <BookOpen className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
        <p className="text-muted-foreground text-sm max-w-sm">Please select a Global Batch from the top menu.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col  w-full pb-10  -mt-4 ">

      <ClassHeader
        selectedBatch={selectedBatch}
        topicSlug={topicSlug}
        onAddClick={() => setIsCreateOpen(true)}
      />

      <ClassFilter
        search={search}
        onSearchChange={setSearch}
        totalRecords={totalRecords}
      />

      <ClassTable
        classesList={classesList}
        loading={loading}
        search={search}
        topicSlug={topicSlug}
        onEdit={openEdit}
        onDelete={openDelete}
        onViewQuestions={(cls) => router.push(`/admin/topics/${topicSlug}/classes/${cls.slug}`)}
      />

      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        totalItems={totalRecords}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
        showLimitSelector={true}
        loading={loading}
      />

      <CreateClassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          lastFetchParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
          fetchClasses();
        }}
        batchSlug={selectedBatch!.slug}
        topicSlug={topicSlug}
      />

      <EditClassModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          lastFetchParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
          fetchClasses();
        }}
        batchSlug={selectedBatch!.slug}
        topicSlug={topicSlug}
        classData={selectedClass}
      />

      <DeleteClassModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => {
          lastFetchParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
          fetchClasses();
        }}
        batchSlug={selectedBatch!.slug}
        topicSlug={topicSlug}
        classData={selectedClass}
      />

      <DeletePdfModal
        isOpen={isDeletePdfOpen}
        onClose={() => {
          setIsDeletePdfOpen(false);
          setIsEditOpen(false);
        }}
        onSuccess={() => {
          setIsEditOpen(false);
          lastFetchParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
          fetchClasses();
        }}
        batchSlug={selectedBatch!.slug}
        topicSlug={topicSlug}
        classSlug={selectedClass?.slug || ''}
      />
    </div>
  );
}

