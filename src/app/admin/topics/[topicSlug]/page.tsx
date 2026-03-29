"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';
import api from '@/lib/api';
import {
  getAdminTopicClasses,
  createAdminClass,
  updateAdminClass,
  deleteAdminClass
} from '@/services/admin.service';
import {
  Plus,
  Search,
  FolderEdit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Link as LinkIcon
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
import { handleToastError } from "@/utils/toast-system";

export default function AdminClassesPage() {
  const params = useParams();
  const topicSlug = decodeURIComponent(params.topicSlug as string);

  const { selectedBatch, isLoadingContext } = useAdminStore();
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Forms
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [classDate, setClassDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClasses = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      const response = await api.get(`/api/admin/${selectedBatch.slug}/topics/${topicSlug}/classes?${params}`);
      setClassesList(response.data.data || []);
      setTotalRecords(response.data.pagination?.total || 0);
    } catch (err) {
      handleToastError(err);
      console.error("Failed to fetch classes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 when search changes
  }, [search]);

  useEffect(() => {
    fetchClasses();
  }, [selectedBatch, topicSlug, page, limit, search]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await createAdminClass(selectedBatch!.slug, topicSlug, {
        class_name: className,
        description,
        pdf_url: pdfUrl,
        duration_minutes: Number(duration),
        class_date: new Date(classDate).toISOString()
      });
      setIsCreateOpen(false);
      resetForms();
      fetchClasses();
    } catch (err: any) {
      handleToastError(err);
      setFormError(err.response?.data?.error || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await updateAdminClass(selectedBatch!.slug, topicSlug, selectedClass.slug, {
        class_name: className,
        description,
        pdf_url: pdfUrl,
        duration_minutes: Number(duration),
        class_date: new Date(classDate).toISOString()
      });
      setIsEditOpen(false);
      resetForms();
      fetchClasses();
    } catch (err: any) {
      handleToastError(err);
      setFormError(err.response?.data?.error || 'Failed to update class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      await deleteAdminClass(selectedBatch!.slug, topicSlug, selectedClass.slug);
      setIsDeleteOpen(false);
      resetForms();
      fetchClasses();
    } catch (err: any) {
      handleToastError(err);
      setFormError(err.response?.data?.error || 'Failed to delete class.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForms = () => {
    setClassName('');
    setDescription('');
    setPdfUrl('');
    setDuration('');
    setClassDate(new Date().toISOString().substring(0, 10));
    setFormError('');
    setSelectedClass(null);
  };

  const openEdit = (cls: any) => {
    setSelectedClass(cls);
    setClassName(cls.class_name);
    setDescription(cls.description || '');
    setPdfUrl(cls.pdf_url || '');
    setDuration(cls.duration_minutes?.toString() || '');
    setClassDate(cls.class_date ? cls.class_date.substring(0, 10) : new Date().toISOString().substring(0, 10));
    setFormError('');
    setIsEditOpen(true);
  };

  const filteredClasses = classesList.filter(c => c.class_name.toLowerCase().includes(search.toLowerCase()));

  if (isLoadingContext) {
    return <Skeletons />;
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
    <div className="flex flex-col space-y-6">

      <div className="flex items-center gap-3 text-muted-foreground">
        <Link href="/admin/topics" className="hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </Link>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" /> Classes
          </h2>
          <p className="text-muted-foreground mt-1 text-sm font-mono bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
            {selectedBatch.name} / {topicSlug}
          </p>
        </div>
        <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Class
        </Button>
      </div>

      <div className="bg-card border border-border  shadow-sm rounded-xl overflow-hidden">
        <div className="
  glass rounded-xl overflow-hidden
  shadow-md
">

  <div className="
    flex items-center justify-between
    px-5 py-4
  ">

    {/* SEARCH */}
    <div className="relative flex-1 max-w-sm group">

      <Search className="
        absolute left-3 top-1/2 -translate-y-1/2
        w-4 h-4
        text-muted-foreground
        pointer-events-none
        transition
        group-focus-within:text-primary
      " />

      <Input
        placeholder="Search classes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          h-10 !pl-9 !pr-9 rounded-full

          bg-accent/40
          border-0

          focus:ring-2 focus:ring-primary/20
          focus:bg-accent/60

          transition-all
        "
      />
    </div>

    {/* COUNT BADGE */}
    <div className="
      text-xs font-semibold tracking-wide

      px-3 py-1.5 rounded-full

      bg-primary/10 text-primary
      border border-primary/20

      shadow-[0_0_10px_var(--hover-glow)]
    ">
      {totalRecords} Classes
    </div>

  </div>
</div>

        <div className="overflow-x-auto">
          <Table >
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Overview</TableHead>
                <TableHead>Class Date</TableHead>
                <TableHead className="text-center">Resources</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading classes...
                  </TableCell>
                </TableRow>
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    No classes mapped to this batch and topic yet.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((cls) => (
                  <TableRow
                    key={cls.id}
                    className="group hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={(e) => {
                      // Prevent navigation if clicking on buttons
                      if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
                        return;
                      }
                      // Navigate to view questions page (same as row click)
                      window.location.href = `/admin/topics/${topicSlug}/classes/${cls.slug}`;
                    }}
                  >
                    <TableCell>
                      <div className="font-semibold text-foreground text-base">{cls.class_name}</div>
                      {cls.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                          {cls.description.split(' ').slice(0, 7).join(' ')}
                          {cls.description.split(' ').length > 7 && '...'}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        {new Date(cls.class_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {cls.pdf_url ? (
                        <a href={cls.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors font-medium px-2.5 py-1 rounded-md text-xs gap-1.5 max-w-[120px] truncate" title={cls.pdf_url}>
                          <LinkIcon className="w-3 h-3 shrink-0" /> Open PDF
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">No Attachments</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/admin/topics/${topicSlug}/classes/${cls.slug}`;
                          }}
                        >
                          View Questions
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(cls);
                          }}
                          className="h-8 w-8 hover:bg-muted border-border/50"
                        >
                          <FolderEdit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClass(cls);
                            setIsDeleteOpen(true);
                          }}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive border-border/50"
                        >
                          <Trash2 className="w-4 h-4 opacity-70" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
        
      />

      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-6">

          {/* Header */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Create Class Module
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Add a new class assigned under {topicSlug}.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleCreateSubmit} className="space-y-5 mt-4">

            {/* Error */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                {formError}
              </div>
            )}

            {/* Class Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Class Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={className}
                onChange={e => setClassName(e.target.value)}
                required
                placeholder="e.g. Intro to Arrays"
                disabled={submitting}
                className="h-11 rounded-xl px-3"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={submitting}
                placeholder="Optional details about this class."
                className="w-full h-24 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            {/* Duration + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration <span className="text-xs text-muted-foreground">(min)</span>{" "}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  required
                  placeholder="90"
                  disabled={submitting}
                  className="h-11 rounded-xl px-3"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={classDate}
                  onChange={e => setClassDate(e.target.value)}
                  required
                  disabled={submitting}
                  className="h-11 rounded-xl px-3"
                />
              </div>
            </div>

            {/* PDF Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                PDF Content Link{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <Input
                type="url"
                value={pdfUrl}
                onChange={e => setPdfUrl(e.target.value)}
                placeholder="https://..."
                disabled={submitting}
                className="h-11 rounded-xl px-3"
              />
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4 flex justify-end gap-3 border-t border-border/60">

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={submitting}
                className="rounded-xl px-5"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-6 shadow-sm hover:shadow-md transition"
              >
                {submitting ? "Creating..." : "Create Class"}
              </Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-6">

          {/* Header */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Update Class Details
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Modify class attributes directly.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleEditSubmit} className="space-y-5 mt-4">

            {/* Error */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                {formError}
              </div>
            )}

            {/* Class Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Class Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={className}
                onChange={e => setClassName(e.target.value)}
                required
                placeholder="e.g. Intro to Arrays"
                disabled={submitting}
                className="h-11 rounded-xl px-3"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={submitting}
                placeholder="Optional details about this class."
                className="w-full h-24 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            {/* Duration + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration{" "}
                  <span className="text-xs text-muted-foreground">(min)</span>{" "}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  required
                  placeholder="90"
                  disabled={submitting}
                  className="h-11 rounded-xl px-3"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={classDate}
                  onChange={e => setClassDate(e.target.value)}
                  required
                  disabled={submitting}
                  className="h-11 rounded-xl px-3"
                />
              </div>
            </div>

            {/* PDF Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                PDF Content Link{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <Input
                type="url"
                value={pdfUrl}
                onChange={e => setPdfUrl(e.target.value)}
                placeholder="https://..."
                disabled={submitting}
                className="h-11 rounded-xl px-3"
              />
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4 flex justify-end gap-3 border-t border-border/60">

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={submitting}
                className="rounded-xl px-5"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-6 shadow-sm hover:shadow-md transition"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-6">

          {/* Header */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold text-destructive">
              Delete Class
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This action cannot be undone and will detach all questions synced to this module.
            </DialogDescription>
          </DialogHeader>

          {/* Warning Card */}
          <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">

            <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {selectedClass?.class_name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {selectedClass?.slug}
              </p>
            </div>

          </div>

          {/* Error */}
          {formError && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
              {formError}
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="mt-6 pt-4 border-t border-border/60 flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={submitting}
              className="rounded-xl px-5"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={submitting}
              className="rounded-xl px-6 shadow-sm hover:shadow-md transition"
            >
              {submitting ? "Deleting..." : "Confirm Delete"}
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
          <div className="h-4 w-24 bg-muted rounded-md shrink-0 mb-4"></div>
          <div className="h-8 w-64 bg-muted rounded-md shrink-0"></div>
          <div className="h-4 w-96 bg-muted/60 rounded-md shrink-0"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-md shrink-0"></div>
      </div>
      <div className="h-[400px] w-full bg-card border border-border rounded-xl"></div>
    </div>
  );
}
