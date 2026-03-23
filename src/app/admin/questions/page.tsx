"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion
} from '@/services/admin.service';
import {
  Plus,
  Search,
  FolderEdit,
  Trash2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/Select';
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

function BadgeByLevel({ level }: { level: string }) {
  const cn = level === 'EASY' ? 'bg-green-500/10 text-green-500' :
    level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600' :
      'bg-red-500/10 text-red-500';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cn}`}>{level}</span>;
}

export default function AdminQuestionsBankPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters mapping directly from URL if possible, fallback to defaults
  const [qSearch, setQSearch] = useState(searchParams.get('search') || '');
  const [qLevel, setQLevel] = useState(searchParams.get('level') || '');
  const [qPlatform, setQPlatform] = useState(searchParams.get('platform') || '');
  const [qType, setQType] = useState(searchParams.get('type') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQ, setSelectedQ] = useState<any>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [formLevel, setFormLevel] = useState('MEDIUM');
  const [formPlatform, setFormPlatform] = useState('LEETCODE');
  const [formType, setFormType] = useState('HOMEWORK');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  //Pagination
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10)

  // Note: For assigning topic_id, in a fully polished app we'd fetch all topics here for a dropdown.
  // For simplicity based on requirements, we'll use a number string input or assume the user knows the ID,
  // or we can fetch the topics array and build a dropdown. Let's fetch all global topics.
  const [allTopics, setAllTopics] = useState<{ label: string, value: string }[]>([]);

  const fetchTopics = useCallback(async () => {
    try {
      // Import api locally here to hit the topics endpoint
      const { default: api } = await import('@/lib/api');
      const res = await api.get('/api/admin/topics');
      setAllTopics(res.data.map((t: any) => ({ label: t.topic_name, value: t.id.toString() })));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (qSearch) params.set('search', qSearch);
    if (qLevel) params.set('level', qLevel);
    if (qPlatform) params.set('platform', qPlatform);
    if (qType) params.set('type', qType);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    router.replace(`/admin/questions?${params.toString()}`);
  }, [qSearch, qLevel, qPlatform, qType, page, limit, router]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const p: any = { page, limit };
      if (qSearch) p.search = qSearch;
      if (qLevel) p.level = qLevel;
      if (qPlatform) p.platform = qPlatform;
      if (qType) p.type = qType;

      const res = await getAdminQuestions(p);
      setQuestions(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  }, [qSearch, qLevel, qPlatform, qType, page]);

  useEffect(() => {
    updateUrl();
    loadQuestions();
  }, [updateUrl, loadQuestions]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Form Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      await createAdminQuestion({
        question_name: formName,
        question_link: formLink,
        topic_id: Number(formTopicId),
        level: formLevel,
        platform: formPlatform,
        type: formType
      });
      setIsCreateOpen(false);
      loadQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      await updateAdminQuestion(selectedQ.id, {
        question_name: formName,
        question_link: formLink,
        topic_id: Number(formTopicId),
        level: formLevel,
        platform: formPlatform,
        type: formType
      });
      setIsEditOpen(false);
      loadQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to update question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setFormError(''); setSubmitting(true);
    try {
      await deleteAdminQuestion(selectedQ.id);
      setIsDeleteOpen(false);
      loadQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Cannot delete a question that is bound to classes or student progress.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForms = () => {
    setFormName('');
    setFormLink('');
    setFormTopicId(allTopics[0]?.value || '');
    setFormLevel('MEDIUM');
    setFormPlatform('LEETCODE');
    setFormType('HOMEWORK');
    setFormError('');
  };

  const openEdit = (q: any) => {
    setSelectedQ(q);
    setFormName(q.question_name);
    setFormLink(q.question_link);
    setFormTopicId(q.topic_id?.toString() || '');
    setFormLevel(q.level);
    setFormPlatform(q.platform);
    setFormType(q.type);
    setFormError('');
    setIsEditOpen(true);
  };

  return (
    <div className="flex flex-col space-y-6">

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" /> Global Question Bank
          </h2>
          <p className="text-muted-foreground mt-1 text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
            {totalRecords} Total Questions
          </p>
        </div>
        <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Question
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-muted/20">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name..."
              value={qSearch}
              onChange={(e) => { setQSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9"
            />
          </div>

          <Select
            value={qLevel}
            onChange={(v) => { setQLevel(v as string); setPage(1); }}
            options={[
              { label: 'All Difficulties', value: '' },
              { label: 'Easy', value: 'EASY' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Hard', value: 'HARD' },
            ]}
            className="w-[140px] h-9 text-sm"
            placeholder="Difficulty"
          />

          <Select
            value={qPlatform}
            onChange={(v) => { setQPlatform(v as string); setPage(1); }}
            options={[
              { label: 'All Platforms', value: '' },
              { label: 'LeetCode', value: 'LEETCODE' },
              { label: 'GeeksForGeeks', value: 'GFG' },
              { label: 'InterviewBit', value: 'INTERVIEWBIT' },
              { label: 'Other', value: 'OTHER' },
            ]}
            className="w-[160px] h-9 text-sm"
            placeholder="Platform"
          />
        </div>

        <div className="overflow-x-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Subject</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Categorization</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-[400px] text-center text-muted-foreground">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Querying bank...
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-[400px] text-center text-muted-foreground">
                    No criteria found matching search filters.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q) => (
                  <TableRow key={q.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <a href={q.question_link} target="_blank" rel="noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 mb-1">
                        {q.question_name} <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </a>
                      <div className="text-xs text-muted-foreground line-clamp-1">{q.question_link}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="text-xs uppercase bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded border border-border">{q.platform}</span>
                        <BadgeByLevel level={q.level} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
                        <span className="capitalize">Topic: <span className="text-foreground">{q.topic?.topic_name || `ID:${q.topic_id}`}</span></span>
                        <span>Designation: {q.type === 'CLASSWORK' ? 'Class Module' : 'Homework Task'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(q)} className="h-8 w-8 hover:bg-muted text-muted-foreground">
                          <FolderEdit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedQ(q); setIsDeleteOpen(true); }} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
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
        { open: isCreateOpen, setOpen: setIsCreateOpen, title: "Add to Question Bank", submit: handleCreateSubmit, isEdit: false },
        { open: isEditOpen, setOpen: setIsEditOpen, title: "Edit Question", submit: handleEditSubmit, isEdit: true }
      ].map((modalProps, idx) => (
        <Dialog key={idx} open={modalProps.open} onOpenChange={modalProps.setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{modalProps.title}</DialogTitle>
              <DialogDescription>Define the details of this specific learning challenge.</DialogDescription>
            </DialogHeader>
            <form onSubmit={modalProps.submit} className="space-y-4">
              {formError && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Question Title <span className="text-destructive">*</span></label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} required placeholder="e.g. Two Sum" disabled={submitting} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URI Anchor <span className="text-destructive">*</span></label>
                <Input type="url" value={formLink} onChange={e => setFormLink(e.target.value)} required placeholder="https://leetcode.com/..." disabled={submitting} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mapped Topic <span className="text-destructive">*</span></label>
                  <Select
                    value={formTopicId}
                    onChange={(v) => setFormTopicId(v as string)}
                    options={allTopics}
                    placeholder={allTopics.length > 0 ? "Select Topic" : "Loading..."}
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level <span className="text-destructive">*</span></label>
                  <Select
                    value={formLevel}
                    onChange={(v) => setFormLevel(v as string)}
                    options={[
                      { label: 'Easy', value: 'EASY' }, { label: 'Medium', value: 'MEDIUM' }, { label: 'Hard', value: 'HARD' }
                    ]}
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Variant <span className="text-destructive">*</span></label>
                  <Select
                    value={formPlatform}
                    onChange={(v) => setFormPlatform(v as string)}
                    options={[
                      { label: 'LeetCode', value: 'LEETCODE' }, { label: 'GeeksForGeeks', value: 'GFG' }, { label: 'InterviewBit', value: 'INTERVIEWBIT' }, { label: 'Other', value: 'OTHER' }
                    ]}
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distribution <span className="text-destructive">*</span></label>
                  <Select
                    value={formType}
                    onChange={(v) => setFormType(v as string)}
                    options={[
                      { label: 'Homework', value: 'HOMEWORK' }, { label: 'Classwork', value: 'CLASSWORK' }
                    ]}
                    disabled={submitting}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => modalProps.setOpen(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting || !formTopicId}>{submitting ? 'Saving...' : modalProps.isEdit ? 'Save Changes' : 'Create Question'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ))}

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Global Question</DialogTitle>
            <DialogDescription>This action inherently violates dependencies if assigned elsewhere. Only unused questions can be safely destroyed.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 bg-muted/50 border border-border p-4 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold">{selectedQ?.question_name}</p>
              <p className="text-xs text-muted-foreground">Difficulty: {selectedQ?.level}</p>
            </div>
          </div>
          {formError && <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
          <DialogFooter className="mt-6 border-t border-border pt-4">
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
