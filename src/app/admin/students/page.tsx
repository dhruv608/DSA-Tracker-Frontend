"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminStore } from '@/store/adminStore';
import {
  getAdminStudents,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent
} from '@/services/admin.service';
import { AdminStudent } from '@/types/student/index.types';
import { ApiError } from '@/types/admin/index.types';
import { Users } from 'lucide-react';
import StudentsHeader from '@/components/admin/students/StudentsHeader';
import StudentsFilter from '@/components/admin/students/StudentsFilter';
import StudentsTable from '@/components/admin/students/StudentsTable';
import StudentsModals from '@/components/admin/students/StudentsModals';
import StudentsSkeleton from '@/components/admin/students/StudentsSkeleton';
import { createStudentSchema, updateStudentSchema, CreateStudentInput, UpdateStudentInput } from '@/schemas/student.schema';

export default function AdminStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedBatch, isLoadingContext } = useAdminStore();

  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // URL State
  const [sSearch, setSSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isDownloadReportOpen, setIsDownloadReportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // React Hook Form for Create
  const createForm = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: '',
      email: '',
      username: undefined,
      password: undefined,
      enrollment_id: '',
      batch_id: selectedBatch?.id || 0,
      leetcode_id: '',
      gfg_id: '',
    },
  });

  // React Hook Form for Edit
  const editForm = useForm<UpdateStudentInput>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      name: '',
      email: '',
      username: undefined,
      enrollment_id: '',
      leetcode_id: '',
      gfg_id: '',
    },
  });

  // Pagination
  const [limit, setLimit] = useState(10);
  
  // Refs for preventing double API calls
  const isFetchingStudents = useRef(false);
  const lastFetchStudentsParams = useRef<{ batchSlug?: string; page: number; limit: number; search: string }>({
    page: 1,
    limit: 10,
    search: ''
  });
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (sSearch) params.set('search', sSearch);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/admin/students?${params.toString()}`);
  }, [sSearch, page, router]);

  const fetchStudents = useCallback(async () => {
    if (!selectedBatch) return;

    // Skip if already fetching
    if (isFetchingStudents.current) {
      console.log("Already fetching students, skipping duplicate call");
      return;
    }

    // Check if same params were already used
    const currentParams = { batchSlug: selectedBatch.slug, page, limit, search: sSearch };
    const sameParams = 
      lastFetchStudentsParams.current.batchSlug === selectedBatch.slug &&
      lastFetchStudentsParams.current.page === page &&
      lastFetchStudentsParams.current.limit === limit &&
      lastFetchStudentsParams.current.search === sSearch;

    if (sameParams) {
      console.log("Same students params already fetched, skipping");
      return;
    }

    isFetchingStudents.current = true;
    lastFetchStudentsParams.current = currentParams;
    setLoading(true);
    try {
      const p: { page: number; limit: number; batchSlug: string; search?: string } = { page, limit, batchSlug: selectedBatch.slug };
      if (sSearch) p.search = sSearch;

      const res = await getAdminStudents(p);
      setStudents(res.students);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      // Error is handled by API client interceptor
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
      isFetchingStudents.current = false;
    }
  }, [sSearch, page, limit, selectedBatch]);

  useEffect(() => {
    updateUrl();
    if (!isLoadingContext) {
      fetchStudents();
    }
  }, [updateUrl, fetchStudents, isLoadingContext]);

  // Whenever context changes, naturally reset pagination
  useEffect(() => {
    setPage(1);
  }, [selectedBatch?.id]);

  // Form Handlers with Zod validation
  const handleCreateSubmit = async (values: CreateStudentInput) => {
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        batch_id: selectedBatch?.id,
        password: values.password || undefined,
        leetcode_id: values.leetcode_id || undefined,
        gfg_id: values.gfg_id || undefined,
      };
      await createAdminStudent(payload);
      setIsCreateOpen(false);
      resetForms();
      lastFetchStudentsParams.current = { page: 0, limit: 0, search: '' };
      fetchStudents();
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (values: UpdateStudentInput) => {
    if (!selectedStudent) return;
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        leetcode_id: values.leetcode_id || undefined,
        gfg_id: values.gfg_id || undefined,
      };
      await updateAdminStudent(selectedStudent.id, payload);
      setIsEditOpen(false);
      resetForms();
      lastFetchStudentsParams.current = { page: 0, limit: 0, search: '' };
      fetchStudents();
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedStudent) return;
    setFormError(''); setSubmitting(true);
    try {
      await deleteAdminStudent(selectedStudent.id);
      setIsDeleteOpen(false);
      resetForms();
      lastFetchStudentsParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
      fetchStudents();
    } catch (err: unknown) {
      // Error is handled by API client interceptor
      console.log(err)
    } finally {
      setSubmitting(false);
    }
  };

  const resetForms = () => {
    createForm.reset({
      name: '',
      email: '',
      username: undefined,
      password: undefined,
      enrollment_id: '',
      batch_id: selectedBatch?.id || 0,
      leetcode_id: '',
      gfg_id: '',
    });
    editForm.reset({
      name: '',
      email: '',
      username: undefined,
      enrollment_id: '',
      leetcode_id: '',
      gfg_id: '',
    });
    setFormError('');
  };

  const handleBulkUploadSuccess = (result: { success: number; failed: number }) => {
    // Show success message or refresh data
    lastFetchStudentsParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
    fetchStudents();
  };

  const openEdit = (s: AdminStudent) => {
    setSelectedStudent(s);
    editForm.reset({
      name: s.name,
      email: s.email,
      username: s.username || undefined,
      enrollment_id: s.enrollment_id || '',
      leetcode_id: s.leetcode_id || '',
      gfg_id: s.gfg_id || '',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const openDelete = (s: AdminStudent) => {
    setSelectedStudent(s);
    setIsDeleteOpen(true);
  };

  if (isLoadingContext) return <StudentsSkeleton />;

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl">
        <Users className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
        <p className="text-muted-foreground text-sm max-w-sm">Please select a Batch to view its enrolled students.</p>
      </div>
    );
  }

  return (
     <div className="flex flex-col mx-auto  w-full pb-12 ">
      <StudentsHeader totalRecords={totalRecords} selectedBatch={selectedBatch} />
      
      <StudentsFilter
        sSearch={sSearch}
        setSSearch={setSSearch}
        setIsCreateOpen={setIsCreateOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
        setIsDownloadReportOpen={setIsDownloadReportOpen}
        resetForms={resetForms}
        setPage={setPage}
      />

      <StudentsTable
        students={students}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalRecords={totalRecords}
        setPage={setPage}
        setLimit={setLimit}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <StudentsModals
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        isBulkUploadOpen={isBulkUploadOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
        isDownloadReportOpen={isDownloadReportOpen}
        setIsDownloadReportOpen={setIsDownloadReportOpen}
        selectedStudent={selectedStudent}
        formError={formError}
        setFormError={setFormError}
        submitting={submitting}
        createForm={createForm}
        editForm={editForm}
        handleCreateSubmit={handleCreateSubmit}
        handleEditSubmit={handleEditSubmit}
        handleDeleteSubmit={handleDeleteSubmit}
        handleBulkUploadSuccess={handleBulkUploadSuccess}
        selectedBatch={selectedBatch}
      />
    </div>
  );
}


