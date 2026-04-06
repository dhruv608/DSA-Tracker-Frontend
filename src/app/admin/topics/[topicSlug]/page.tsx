"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PdfPreview } from '@/components/ui/PdfPreview';
import { ClassesTableShimmer, ClassesTableRowsShimmer } from '@/components/ClassesTableShimmer';
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
  const [isDeletePdfOpen, setIsDeletePdfOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Forms
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showReplaceInputs, setShowReplaceInputs] = useState(false);
  const [duration, setDuration] = useState('');
  const [classDate, setClassDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Helper function to check if PDF is from S3
  const isS3Pdf = (url: string) => {
    return url?.includes('amazonaws.com/class-pdfs/');
  };

  // Handle PDF file selection
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setFormError('Only PDF files are allowed');
        return;
      }
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        setFormError('PDF file size must be less than 20MB');
        return;
      }
      setPdfFile(file);
      setPdfUrl(''); // Clear URL when file is selected
      setFormError('');
    }
  };

  // Handle PDF removal
  const handlePdfRemove = () => {
    setPdfFile(null);
    setPdfUrl('');
    setFormError('');
  };
  const router = useRouter();
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
      const formData = new FormData();
      formData.append('class_name', className);
      formData.append('description', description);
      formData.append('duration_minutes', duration ? duration.toString() : ''); // Convert to string
      formData.append('class_date', classDate);
      
      // Handle PDF input
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      } else if (pdfUrl) {
        formData.append('pdf_url', pdfUrl);
      }

      await api.post(`/api/admin/${selectedBatch!.slug}/topics/${topicSlug}/classes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  const handleDeletePdfSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('remove_pdf', 'true');

      await api.patch(`/api/admin/${selectedBatch!.slug}/topics/${topicSlug}/classes/${selectedClass.slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setIsDeletePdfOpen(false);
      setIsEditOpen(false);
      resetForms();
      fetchClasses();
    } catch (err: any) {
      handleToastError(err);
      setFormError(err.response?.data?.error || 'Failed to remove PDF');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('class_name', className);
      formData.append('description', description);
      formData.append('duration_minutes', duration); // Keep as string
      formData.append('class_date', classDate);
      
      // Handle PDF input
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      } else if (pdfUrl) {
        formData.append('pdf_url', pdfUrl);
      }

      await api.patch(`/api/admin/${selectedBatch!.slug}/topics/${topicSlug}/classes/${selectedClass.slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    setPdfFile(null);
    setShowReplaceInputs(false);
    setDuration('');
    setClassDate(new Date().toISOString().substring(0, 10));
    setFormError('');
    setSelectedClass(null);
  };

  const openEdit = (cls: any) => {
    setSelectedClass(cls);
    setClassName(cls.class_name);
    setDescription(cls.description || '');
    setPdfUrl('');
    setPdfFile(null);
    setDuration(cls.duration_minutes?.toString() || '');
    setClassDate(cls.class_date ? cls.class_date.substring(0, 10) : new Date().toISOString().substring(0, 10));
    setFormError('');
    setIsEditOpen(true);
  };

  const filteredClasses = classesList.filter(c => c.class_name.toLowerCase().includes(search.toLowerCase()));

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
    <div className="flex flex-col space-y-6">

      <div className="flex items-center gap-3 text-muted-foreground">
        <Link href="/admin/topics" className="hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </Link>
      </div>

      <div className="flex items-end glass rounded-2xl p-5 justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" /> Classes
          </h2>
          <p className="text-muted-foreground mt-1 text-sm font-mono bg-muted inline-block px-3 py-1 rounded border border-border mt-2">
            {selectedBatch.name} / {topicSlug}
          </p>
        </div>
        <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Class
        </Button>
      </div>

      <div className="bg-card border border-border  shadow-sm rounded-xl overflow-hidden">
        <div className="
  glass rounded-2xl overflow-hidden
  shadow-md
">

          <div className="
    flex items-center justify-between
    px-5 py-4
  ">

            {/* SEARCH */}
            <div className="relative flex-1 max-w-sm ">

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

        <div className="overflow-x-auto ">
          <Table >
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Overview</TableHead>
                <TableHead>Class Date</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead className="text-center">Resources</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <ClassesTableRowsShimmer />
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
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
                      router.push(`/admin/topics/${topicSlug}/classes/${cls.slug}`);
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
                      <div className="flex items-center justify-center gap-1">
                        <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-md text-sm">
                          {cls.questionCount || 0}
                        </span>
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
                            router.push(`/admin/topics/${topicSlug}/classes/${cls.slug}`);
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
        loading={loading}
      />

      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent
          className="sm:max-w-[520px] max-h-[85vh] rounded-3xl border border-white/10 
    bg-gradient-to-br from-background via-background/95 to-background/90 
    backdrop-blur-2xl p-0 shadow-2xl overflow-hidden flex flex-col"
        >

          {/* 🔥 Header */}
          <div className="flex-shrink-0 p-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Create Class Module
              </DialogTitle>

              <DialogDescription className="text-sm text-muted-foreground">
                Add a new class under <span className="font-medium text-foreground">{topicSlug}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* 📄 Form */}
          <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* ❌ Error */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                {formError}
              </div>
            )}

            {/* 🏷 Class Name */}
            <div >
              <label className="text-sm font-medium">
                Class Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                placeholder="Intro to Arrays"
                disabled={submitting}
                className="mt-1 w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
          focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
              />
            </div>

            {/* 📝 Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                placeholder="Optional details about this class."
                className="mt-1 w-full h-24 px-3 py-2 rounded-2xl border border-border/40 
          bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            {/* ⏱ Duration + 📅 Date */}
            <div className="flex justify-between">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration <span className="text-xs text-muted-foreground">(min)</span>{" "}
                  <span className="text-destructive">*</span>
                </label>

                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="90"
                  disabled={submitting}
                  className="mt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
      focus:ring-2 focus:ring-primary/40 px-4"
                />
              </div>

              {/* 📅 Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </label>

                <div className="relative">
                  <Input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    required
                    disabled={submitting}
                    className="mt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
        focus:ring-2 focus:ring-primary/40 px-4 pr-10  appearance-none"
                  />
                </div>
              </div>

            </div>

            {/* 📄 PDF Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                PDF Content{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              
              {/* URL Input */}
              <div>
                <Input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => {
                    setPdfUrl(e.target.value);
                    setPdfFile(null); // Clear file when URL is entered
                  }}
                  placeholder="Enter PDF URL (Google Drive, etc.)"
                  disabled={submitting}
                  className="w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                    focus:ring-2 focus:ring-primary/40"
                />
              </div>
              
              {/* OR text */}
              <div className="text-center">
                <span className="text-xs text-muted-foreground font-medium">OR</span>
              </div>
              
              {/* File Upload Button */}
              <div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfFileChange}
                  disabled={submitting}
                  id="pdf-file-input-create"
                  className="hidden"
                />
                <label
                  htmlFor="pdf-file-input-create"
                  className="flex items-center justify-center w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                    hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-medium">
                    Choose PDF File
                  </span>
                </label>
              </div>
              
              {/* PDF Preview */}
              {pdfFile && <PdfPreview file={pdfFile} onRemove={handlePdfRemove} />}
            </div>

            {/* 🔻 Footer */}
            <DialogFooter className="pt-5 flex justify-between items-center border-t border-border/50">

              <span className="text-xs text-muted-foreground">
                * Required fields
              </span>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={submitting}
                  className="rounded-xl px-5"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90 
            shadow-lg shadow-primary/20 transition-all"
                >
                  {submitting ? "Creating..." : "Create Class"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="sm:max-w-[520px] max-h-[85vh] rounded-3xl border border-white/10 
    bg-gradient-to-br from-background via-background/95 to-background/90 
    backdrop-blur-2xl p-0 shadow-2xl overflow-hidden flex flex-col"
        >

          {/* 🔥 Header */}
          <div className="flex-shrink-0 p-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Update Class Details
              </DialogTitle>

              <DialogDescription className="text-sm text-muted-foreground">
                Modify class attributes directly.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* 📄 Form */}
          <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* ❌ Error */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                {formError}
              </div>
            )}

            {/* 🏷 Class Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Class Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                placeholder="e.g. Intro to Arrays"
                disabled={submitting}
                className="w-full pt-1 h-11 rounded-2xl bg-muted/30 border border-border/40 
          focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
              />
            </div>

            {/* 📝 Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                placeholder="Optional details about this class."
                className="w-full h-24 px-3 py-2 rounded-2xl border border-border/40 
          bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            {/* ⏱ Duration + 📅 Date */}
            <div className="flex justify-between">

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration <span className="text-xs text-muted-foreground">(min)</span>{" "}
                  <span className="text-destructive">*</span>
                </label>

                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="90"
                  disabled={submitting}
                  className=" pt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
            focus:ring-2 focus:ring-primary/40 px-4"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </label>

                <div className="relative">
                  <Input
                    type="date"
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    required
                    disabled={submitting}
                    className="pt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
              focus:ring-2 focus:ring-primary/40 px-4 pr-10 appearance-none"
                  />

                </div>
              </div>
            </div>

            {/* 📄 PDF */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                PDF Content{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>

              {/* Show existing PDF info without preview */}
              {selectedClass?.pdf_url && !pdfFile && !pdfUrl && (
                <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isS3Pdf(selectedClass.pdf_url) ? (
                        <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                          <span className="text-red-500 text-xs font-bold">PDF</span>
                        </div>
                      ) : (
                        <LinkIcon className="w-4 h-4 text-blue-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {isS3Pdf(selectedClass.pdf_url) ? 'Current PDF' : 'External Link'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isS3Pdf(selectedClass.pdf_url) ? 'Stored in S3' : 'External URL'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(selectedClass.pdf_url, '_blank')}
                        className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded hover:bg-blue-500/20"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReplaceInputs(true);
                        }}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDeletePdfOpen(true);
                        }}
                        className="text-xs bg-destructive/10 text-destructive p-2 rounded hover:bg-destructive/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Show inputs only when Replace is clicked or no existing PDF */}
              {(!selectedClass?.pdf_url || showReplaceInputs || pdfFile || pdfUrl) && (
                <div className="space-y-3">
                  {/* URL Input */}
                  <div>
                    <Input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => {
                        setPdfUrl(e.target.value);
                        setPdfFile(null); // Clear file when URL is entered
                      }}
                      placeholder="Enter PDF URL (Google Drive, etc.)"
                      disabled={submitting}
                      className="w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                        focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  
                  {/* OR text */}
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground font-medium">OR</span>
                  </div>
                  
                  {/* File Upload Button */}
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfFileChange}
                      disabled={submitting}
                      id="pdf-file-input-edit"
                      className="hidden"
                    />
                    <label
                      htmlFor="pdf-file-input-edit"
                      className="flex items-center justify-center w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                        hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-medium">
                        Choose PDF File
                      </span>
                    </label>
                  </div>
                </div>
              )}
              
              {/* New PDF Preview */}
              {pdfFile && <PdfPreview file={pdfFile} onRemove={handlePdfRemove} />}
              
              {/* New URL Preview */}
              {pdfUrl && !pdfFile && (
                <div className="mt-3 p-3 bg-muted/20 rounded-xl border border-border/40">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-4 h-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">External Link</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {pdfUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(pdfUrl, '_blank')}
                      className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded hover:bg-blue-500/20"
                    >
                      Open
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 🔻 Footer */}
            <DialogFooter className="pt-5 flex justify-between items-center border-t border-border/50">

              <span className="text-xs text-muted-foreground">
                * Required fields
              </span>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                  disabled={submitting}
                  className="rounded-xl px-5"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90 
            shadow-lg shadow-primary/20 transition-all"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
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
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-muted/40 p-4">

            <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>

            <div className="space-y-1 ">
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

      {/* Delete PDF Confirmation Modal */}
      <Dialog open={isDeletePdfOpen} onOpenChange={setIsDeletePdfOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Remove PDF
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                Are you sure you want to remove this PDF?
              </p>
              <p className="text-xs text-muted-foreground">
                This action will remove the PDF from the class and cannot be undone.
              </p>
            </div>

            {/* Error */}
            {formError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                {formError}
              </div>
            )}

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeletePdfOpen(false)}
                disabled={submitting}
                className="rounded-xl px-5"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDeletePdfSubmit}
                disabled={submitting}
                className="rounded-xl px-6 shadow-sm hover:shadow-md transition"
              >
                {submitting ? "Removing..." : "Remove PDF"}
              </Button>
            </DialogFooter>
          </div>
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
