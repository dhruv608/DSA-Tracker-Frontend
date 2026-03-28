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
import { Avatar } from '@/components/ui/Avatar';
import { AdminStudent } from '@/types/student';
import { handleError } from "@/utils/handleError";

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
      handleError(err);
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
      handleError(err);
      setFormError(err.response?.data?.error || 'Failed to onboard student.');
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
      fetchStudents();
    } catch (err: any) {
      handleError(err);
      setFormError(err.response?.data?.error || 'Failed to update student.');
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
      fetchStudents();
    } catch (err: any) {
      handleError(err);
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

    {/* ================= HEADER ================= */}
    <div className="glass card-premium rounded-2xl p-6 flex items-center justify-between">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Student Management</h2>
          <p className="text-sm text-muted-foreground">
            {selectedBatch.name} • {totalRecords} Enrollments
          </p>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {totalRecords} Students
      </div>
    </div>

    {/* ================= SEARCH + ACTION ================= */}
    <div className="glass card-premium rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">

      {/* SEARCH */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by name or email..."
          value={sSearch}
          onChange={(e) => { setSSearch(e.target.value); setPage(1); }}
          className="!pl-9 w-full h-11 rounded-xl bg-background/50"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-3 flex-wrap">

        <Button
          onClick={() => setIsDownloadReportOpen(true)}
          variant="outline"
          className="h-11 rounded-xl px-4"
        >
          <Download className="w-4 h-4 mr-2" />
          Report
        </Button>

        <Button
          onClick={() => setIsBulkUploadOpen(true)}
          variant="outline"
          className="h-11 rounded-xl px-4"
        >
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>

        <Button
          onClick={() => { resetForms(); setIsCreateOpen(true); }}
          className="h-11 rounded-xl px-5 bg-primary text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>

      </div>
    </div>

    {/* ================= TABLE ================= */}
    <div className="glass card-premium rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <Table>

          {/* HEADER */}
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/40 ">
              <TableHead>Student</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-center">Solved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>

            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-[300px] text-center text-muted-foreground">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-[300px] text-center text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="group border-b border-border/20 hover:bg-muted/30 transition"
                >

                  {/* STUDENT */}
                  <TableCell>
                    <Link
                      href={`/profile/${student.username}`}
                      target="_blank"
                      className="flex items-center gap-3 group/link"
                    >
                      <Avatar
                        name={student.name}
                        profileImageUrl={student.profile_image_url}
                        username={student.username}
                        size="sm"
                      />

                      <div className="flex flex-col">
                        <span className="font-medium group-hover/link:text-primary transition flex items-center gap-1">
                          {student.name}
                          <ExternalLink className="w-3 h-3 opacity-40 group-hover/link:opacity-100" />
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {student.email}
                        </span>
                      </div>
                    </Link>
                  </TableCell>

                  {/* USERNAME */}
                  <TableCell className="text-sm text-muted-foreground">
                    @{student.username}
                  </TableCell>

                  {/* SOLVED */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-primary/70" />
                      <span className="font-semibold text-foreground">
                        {student.totalSolved || 0}
                      </span>
                    </div>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition">

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); openEdit(student); }}
                        className="h-8 w-8 rounded-lg hover:bg-primary/10"
                      >
                        <FolderEdit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                          setIsDeleteOpen(true);
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>

                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}

          </TableBody>

        </Table>

      </div>

      {/* PAGINATION */}
      <div className="p-4 border-t border-border/40">
        <Pagination
          currentPage={page}
          totalItems={totalRecords}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          showLimitSelector={true}
        />
      </div>

    </div>

    {/* ================= CREATE MODAL ================= */}
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 rounded bg-primary/10 border border-primary/20">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            Add Student
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Onboard a new student to the batch
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleCreateSubmit} className="space-y-5">

            {/* ERROR */}
            {formError && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                {formError}
              </div>
            )}

            {/* NAME */}
            <div className="grid grid-cols-3  items-center">
              <label className="text-s text-muted-foreground font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter student name"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* EMAIL */}
            <div className="grid grid-cols-3  items-center">
              <label className="text-s text-muted-foreground font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="student@example.com"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* USERNAME */}
            <div className="grid grid-cols-3  items-center">
              <label className="text-s text-muted-foreground font-medium">
                Username
              </label>
              <Input
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                placeholder="username"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* ENROLLMENT */}
            <div className="grid grid-cols-3  items-center">
              <label className="text-s text-muted-foreground font-medium">
                Enrollment ID
              </label>
              <Input
                value={formEnrollmentId}
                onChange={(e) => setFormEnrollmentId(e.target.value)}
                placeholder="ENR123456"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* PASSWORD */}
            <div className="grid grid-cols-3  items-center">
              <label className="text-s text-muted-foreground font-medium">
                Password
              </label>
              <Input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Enter password (optional)"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* PLATFORM IDs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-s text-muted-foreground font-medium">
                  LeetCode ID
                </label>
                <Input
                  value={formLeetcodeId}
                  onChange={(e) => setFormLeetcodeId(e.target.value)}
                  placeholder="leetcode_id"
                  disabled={submitting}
                  className="h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-s text-muted-foreground font-medium">
                  GFG ID
                </label>
                <Input
                  value={formGfgId}
                  onChange={(e) => setFormGfgId(e.target.value)}
                  placeholder="gfg_id"
                  disabled={submitting}
                  className="h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                disabled={submitting}
                className="h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !formName || !formEmail}
                className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
              >
                {submitting ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>

    {/* ================= EDIT MODAL ================= */}
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 rounded bg-primary/10 border border-primary/20">
              <FolderEdit className="w-4 h-4 text-primary" />
            </div>
            Edit Student
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update student information
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleEditSubmit} className="space-y-5">

            {/* ERROR */}
            {formError && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                {formError}
              </div>
            )}

            {/* NAME */}
            <div className="grid grid-cols-3 item-center">
              <label className="text-s text-muted-foreground font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter student name"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* EMAIL */}
            <div className="grid grid-cols-3 item-center">
              <label className="text-xs text-muted-foreground font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="student@example.com"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* USERNAME */}
            <div className="grid grid-cols-3 item-center">
              <label className="text-xs text-muted-foreground font-medium">
                Username
              </label>
              <Input
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                placeholder="username"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* ENROLLMENT */}
            <div className="grid grid-cols-3 item-center">
              <label className="text-s text-muted-foreground font-medium">
                Enrollment ID
              </label>
              <Input
                value={formEnrollmentId}
                onChange={(e) => setFormEnrollmentId(e.target.value)}
                placeholder="ENR123456"
                disabled={submitting}
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            {/* PLATFORM IDs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-s text-muted-foreground font-medium">
                  LeetCode ID
                </label>
                <Input
                  value={formLeetcodeId}
                  onChange={(e) => setFormLeetcodeId(e.target.value)}
                  placeholder="leetcode_id"
                  disabled={submitting}
                  className="h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-s text-muted-foreground font-medium">
                  GFG ID
                </label>
                <Input
                  value={formGfgId}
                  onChange={(e) => setFormGfgId(e.target.value)}
                  placeholder="gfg_id"
                  disabled={submitting}
                  className="h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                disabled={submitting}
                className="h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !formName || !formEmail}
                className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>

    {/* ================= DELETE MODAL ================= */}
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="glass card-premium rounded-2xl p-0 overflow-hidden shadow-xl max-w-[480px] z-50">

        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-red-500/20">
          <DialogTitle className="text-lg font-semibold text-red-400">
            Delete Student
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete "{selectedStudent?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* WARNING ICON */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4 px-6">
              This action cannot be undone and will remove all associated data.
            </p>
          </div>

          {/* STUDENT INFO CARD */}
          <div className="glass rounded-2xl p-4 flex items-center gap-3 border border-border/40">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {selectedStudent?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedStudent?.email}
              </p>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <DialogFooter className="border-t border-border/40 px-6 py-4 flex gap-3">
          <Button
            variant="destructive"
            onClick={handleDeleteSubmit}
            disabled={submitting}
            className="h-11 w-full font-semibold bg-red-500 hover:bg-red-600 text-white mb-4"
          >
            {submitting ? "Deleting..." : "Delete Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* ================= BULK UPLOAD MODAL ================= */}
    <BulkUploadModal
      open={isBulkUploadOpen}
      onOpenChange={setIsBulkUploadOpen}
      onSuccess={handleBulkUploadSuccess}
    />

    {/* ================= DOWNLOAD REPORT MODAL ================= */}
    <DownloadReportModal
      open={isDownloadReportOpen}
      onOpenChange={setIsDownloadReportOpen}
    />

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
