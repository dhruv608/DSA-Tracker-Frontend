"use client";
import Link from "next/link"
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import {
  getAdminStudents,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent
} from '@/services/admin.service';
import {
  Plus,
  Search,
  FolderEdit,
  Trash2,
  Users,
  Award,
  ExternalLink,
  AlertTriangle,
  Download,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pagination } from '@/components/Pagination';
import BulkUploadModal from './components/BulkUploadModal';
import DownloadReportModal from './components/DownloadReportModal';
import { useToast } from '@/app/(auth)/shared/hooks/useToast';
import { Toast } from '@/app/(auth)/shared/components/Toast';




export default function AdminStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedBatch, isLoadingContext } = useAdminStore();
  const { toasts } = useToast();

  const [students, setStudents] = useState<any[]>([]);
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
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

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
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (sSearch) params.set('search', sSearch);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/admin/students?${params.toString()}`);
  }, [sSearch, page, router]);

  const fetchStudents = useCallback(async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const p: any = { page, limit, batchSlug: selectedBatch.slug };
      if (sSearch) p.search = sSearch;

      const res = await getAdminStudents(p);
      setStudents(res.students);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
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
      fetchStudents();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to onboard student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      fetchStudents();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to update student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setFormError(''); setSubmitting(true);
    try {
      await deleteAdminStudent(selectedStudent.id);
      setIsDeleteOpen(false);
      resetForms();
      fetchStudents();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Operation failed.');
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

  const handleBulkUploadSuccess = (result: any) => {
    // Show success message or refresh data
    fetchStudents();
  };

  const openEdit = (s: any) => {
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

  if (isLoadingContext) return <Skeletons />;

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
    <div className="flex flex-col space-y-6">

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" /> Roster Management
          </h2>
          <p className="text-muted-foreground mt-1 text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
            {selectedBatch.name} - {totalRecords} Total Enrollments
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsDownloadReportOpen(true)} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
          <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Bulk Upload
          </Button>
          <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Onboard Student
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-border flex items-center bg-muted/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, or enrollment ID..."
              value={sSearch}
              onChange={(e) => { setSSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 bg-background focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-center">Platforms</TableHead>
                <TableHead className="text-center">Total Solved</TableHead>
                <TableHead className="text-center">Difficulty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] text-center text-muted-foreground">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Retrieving assignments...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-[400px] text-center text-muted-foreground">
                    No students found matching your query within this batch.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <Link 
                        href={`/profile/${student.username}`}  target="_blank"
                        className="hover:text-primary transition-colors"
                      >
                        <div className="font-bold text-foreground">{student.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{student.email}</div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-muted-foreground">@{student.username}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {student.leetcode_id ? (
                          <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-1.5 py-0.5 rounded" title="LeetCode linked">LC</span>
                        ) : null}
                        {student.gfg_id ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded" title="GFG linked">GFG</span>
                        ) : null}
                        {!student.leetcode_id && !student.gfg_id && <span className="text-xs text-muted-foreground italic">None</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <Award className="w-4 h-4 text-primary opacity-60 flex-shrink-0" />
                        <span className="text-foreground text-base tracking-tight">{student.stats?.total_solved || student.totalSolved || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="flex items-center justify-center text-[11px] font-bold bg-emerald-500/10 text-emerald-500 rounded px-1.5 py-[2px] min-w-[28px]" title="Easy Solved">{student.stats?.easy_solved || 0}</span>
                        <span className="flex items-center justify-center text-[11px] font-bold bg-amber-500/10 text-amber-500 rounded px-1.5 py-[2px] min-w-[28px]" title="Medium Solved">{student.stats?.medium_solved || 0}</span>
                        <span className="flex items-center justify-center text-[11px] font-bold bg-rose-500/10 text-rose-500 rounded px-1.5 py-[2px] min-w-[28px]" title="Hard Solved">{student.stats?.hard_solved || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/admin/students/${student.username}`); }} className="h-8 hover:bg-primary hover:text-white transition-colors">
                          View
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(student); }} className="h-8 w-8 hover:bg-muted text-muted-foreground">
                          <FolderEdit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); setIsDeleteOpen(true); }} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
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
      </div>

      {/* CREATE / EDIT Modals */}
      {[
        { open: isCreateOpen, setOpen: setIsCreateOpen, title: "Onboard Student", submit: handleCreateSubmit, isEdit: false },
        { open: isEditOpen, setOpen: setIsEditOpen, title: "Modify Identity", submit: handleEditSubmit, isEdit: true }
      ].map((modalProps, idx) => (
        <Dialog key={idx} open={modalProps.open} onOpenChange={modalProps.setOpen}>

          <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">

            {/* HEADER */}
            <DialogHeader className="px-6 py-4 border-b bg-muted/40">
              <DialogTitle className="text-lg font-semibold">
                {modalProps.title}
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground">
                {modalProps.isEdit
                  ? "Updating student details directly overrides DB values."
                  : "Manually bind a student into the active batch context."}
              </DialogDescription>
            </DialogHeader>

            {/* BODY */}
            <div className="p-6 space-y-5">
              <form onSubmit={modalProps.submit} className="space-y-5 tracking-tight">

                {/* ERROR */}
                {formError && (
                  <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 font-medium">
                    {formError}
                  </div>
                )}

                {/* BASIC INFO */}
                <div className="space-y-4 p-4 rounded-xl border bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Basic Information
                  </p>

                  <div className=" gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="Enter your name"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium">
                        Enrollment ID
                      </label>
                      <Input
                        className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50"
                        value={formEnrollmentId}
                        onChange={e => setFormEnrollmentId(e.target.value)}
                        placeholder="23****24"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      {/* Empty space for layout balance */}
                    </div>
                  </div>
                </div>

                {/* PASSWORD (CREATE ONLY) */}
                {!modalProps.isEdit && (
                  <div className="space-y-2 p-4 rounded-xl border bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Password
                    </p>

                    <Input
                      type="password"
                      className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50"
                      value={formPassword}
                      onChange={e => setFormPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={submitting}
                    />
                  </div>
                )}

                {/* FOOTER */}
                <DialogFooter className="pt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => modalProps.setOpen(false)}
                    disabled={submitting}
                    className="h-11"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-11 w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {submitting
                      ? "Saving..."
                      : modalProps.isEdit
                        ? "Save Changes"
                        : "Onboard User"}
                  </Button>
                </DialogFooter>

              </form>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">

          {/* HEADER */}
          <DialogHeader className="px-6 py-4 border-b bg-red-500/5">
            <DialogTitle className="text-red-500 flex items-center gap-3 font-semibold">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              Terminate Account
            </DialogTitle>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-5">

            {/* DESCRIPTION */}
            <div className="text-sm text-foreground space-y-2">
              <p>
                You are about to permanently remove this student profile from the system.
              </p>

              <p className="text-red-400 font-medium">
                This action cannot be undone.
              </p>
            </div>

            {/* USER INFO CARD */}
            <div className="p-4 bg-muted/40 rounded-xl border text-xs font-mono space-y-1.5">
              <div>
                <span className="text-muted-foreground">NAME:</span>{" "}
                <span className="font-semibold text-foreground">
                  {selectedStudent?.name}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground">EMAIL:</span>{" "}
                {selectedStudent?.email}
              </div>

              <div>
                <span className="text-muted-foreground">ENROLL:</span>{" "}
                {selectedStudent?.enrollment_id}
              </div>
            </div>

            {/* ERROR */}
            {formError && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 font-semibold">
                {formError}
              </div>
            )}

            {/* EXTRA WARNING */}
            <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
              <AlertTriangle className="w-4 h-4 mt-[2px]" />
              <div>
                All associated progress and records will be permanently lost.
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="mt-2 border-t pt-4 flex gap-2">

              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDeleteOpen(false)}
                disabled={submitting}
                className="h-11"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteSubmit}
                disabled={submitting}
                className="h-11 w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? "Terminating..." : "Confirm Purge"}
              </Button>

            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* BULK UPLOAD MODAL */}
      <BulkUploadModal
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onSuccess={handleBulkUploadSuccess}
      />

      {/* DOWNLOAD REPORT MODAL */}
      <DownloadReportModal
        open={isDownloadReportOpen}
        onOpenChange={setIsDownloadReportOpen}
      />

      {/* TOAST NOTIFICATIONS */}
      <Toast />
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-md shrink-0"></div>
          <div className="h-5 w-48 bg-muted/60 rounded-md shrink-0 mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-md shrink-0"></div>
      </div>
      <div className="h-[600px] w-full bg-card border border-border rounded-xl"></div>
    </div>
  );
}
