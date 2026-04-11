"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEnrollmentId, setFormEnrollmentId] = useState('');
  const [formLeetcodeId, setFormLeetcodeId] = useState('');
  const [formGfgId, setFormGfgId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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

  // Form Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      await createAdminStudent({
        name: formName,
        email: formEmail,
        username: formUsername,
        password: formPassword || undefined,
        enrollment_id: formEnrollmentId,
        batch_id: selectedBatch?.id,
        leetcode_id: formLeetcodeId || undefined,
        gfg_id: formGfgId || undefined
      });
      setIsCreateOpen(false);
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setFormError(''); setSubmitting(true);
    try {
      await updateAdminStudent(selectedStudent.id, {
        name: formName,
        email: formEmail,
        username: formUsername,
        enrollment_id: formEnrollmentId,
        leetcode_id: formLeetcodeId || undefined,
        gfg_id: formGfgId || undefined
      });
      setIsEditOpen(false);
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
    setFormName('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('');
    setFormEnrollmentId('');
    setFormLeetcodeId('');
    setFormGfgId('');
    setFormError('');
  };

  const handleBulkUploadSuccess = (result: { success: number; failed: number }) => {
    // Show success message or refresh data
    lastFetchStudentsParams.current = { page: 0, limit: 0, search: '' }; // Reset to force refetch
    fetchStudents();
  };

  const openEdit = (s: AdminStudent) => {
    setSelectedStudent(s);
    setFormName(s.name);
    setFormEmail(s.email);
    setFormUsername(s.username);
    setFormEnrollmentId(s.enrollment_id || '');
    setFormLeetcodeId(s.leetcode_id || '');
    setFormGfgId(s.gfg_id || '');
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
        formName={formName}
        setFormName={setFormName}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formUsername={formUsername}
        setFormUsername={setFormUsername}
        formPassword={formPassword}
        setFormPassword={setFormPassword}
        formEnrollmentId={formEnrollmentId}
        setFormEnrollmentId={setFormEnrollmentId}
        formLeetcodeId={formLeetcodeId}
        setFormLeetcodeId={setFormLeetcodeId}
        formGfgId={formGfgId}
        setFormGfgId={setFormGfgId}
        formError={formError}
        setFormError={setFormError}
        submitting={submitting}
        handleCreateSubmit={handleCreateSubmit}
        handleEditSubmit={handleEditSubmit}
        handleDeleteSubmit={handleDeleteSubmit}
        handleBulkUploadSuccess={handleBulkUploadSuccess}
        selectedBatch={selectedBatch}
      />
    </div>
  );
}


