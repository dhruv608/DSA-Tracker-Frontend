"use client";

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
  ExternalLink
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




export default function AdminStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedBatch, isLoadingContext } = useAdminStore();

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
      await updateAdminStudent(selectedStudent.username, {
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
      await deleteAdminStudent(selectedStudent.username);
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
        <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Onboard Student
        </Button>
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
                    className="group hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/students/${student.username}`)}
                  >
                    <TableCell>
                      <div className="font-bold text-foreground">{student.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{student.email}</div>
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
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>{modalProps.title}</DialogTitle>
              <DialogDescription>
                {modalProps.isEdit ? 'Updating student details directly overrides DB values.' : 'Manually bind a student directly into the active batch context.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={modalProps.submit} className="space-y-4 tracking-tight">
              {formError && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md font-medium">{formError}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                  <Input value={formName} onChange={e => setFormName(e.target.value)} required placeholder="John Doe" disabled={submitting} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Internal Username <span className="text-destructive">*</span></label>
                  <Input value={formUsername} onChange={e => setFormUsername(e.target.value)} required placeholder="johndoe123" disabled={submitting} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></label>
                  <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} required placeholder="john@example.com" disabled={submitting} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Enrollment ID</label>
                  <Input value={formEnrollmentId} onChange={e => setFormEnrollmentId(e.target.value)} placeholder="BF-2024-..." disabled={submitting} />
                </div>
              </div>

              {/* Separate credential logic block */}
              {!modalProps.isEdit && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-sm font-medium">Account Password <span className="text-destructive">*</span></label>
                  <Input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} required placeholder="••••••••" disabled={submitting} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-orange-500 flex items-center gap-1.5">LeetCode Username</label>
                  <Input value={formLeetcodeId} onChange={e => setFormLeetcodeId(e.target.value)} placeholder="Required for Tracking" disabled={submitting} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-green-500 flex items-center gap-1.5">GFG Username</label>
                  <Input value={formGfgId} onChange={e => setFormGfgId(e.target.value)} placeholder="Required for Tracking" disabled={submitting} />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => modalProps.setOpen(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : modalProps.isEdit ? 'Save Changes' : 'Onboard User'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ))}

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2 border-b border-border pb-3">
              <Trash2 className="w-5 h-5" /> Terminate Account
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-foreground space-y-3">
            <p>You are about to irreversibly delete this student profile from the database.</p>
            <div className="p-3 bg-muted/50 rounded-md font-mono text-xs border border-border">
              NAME: {selectedStudent?.name}<br />
              EMAIL: {selectedStudent?.email}<br />
              ENROLL: {selectedStudent?.enrollment_id}
            </div>
            <p className="font-semibold text-destructive mt-4">This action cannot be undone.</p>
          </div>
          {formError && <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-md">{formError}</div>}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSubmit} disabled={submitting}>
              {submitting ? 'Terminating...' : 'Confirm Purge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
