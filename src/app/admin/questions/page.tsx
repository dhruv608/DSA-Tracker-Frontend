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
  Pencil,
  Trash2,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Code,
  BookOpen,
  Brain,
  X,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/Pagination';
import CreateQuestion from './components/createQuestion';
import UpdateQuestion from './components/updateQuestion';
import DeleteQuestion from './components/deleteQuestion';
import BulkUploadModal from './components/BulkUploadModal';
import { handleError } from "@/utils/handleError";

function BadgeByLevel({ level }: { level: string }) {
  const variant = level === 'EASY' ? 'default' :
    level === 'MEDIUM' ? 'secondary' :
      'destructive';
  const colorClass = level === 'EASY' ? 'bg-green-100 text-green-800 border-green-200' :
    level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
      'bg-red-100 text-red-800 border-red-200';

  return (
    <Badge className={colorClass} variant="outline">
      {level}
    </Badge>
  );
}

function BadgeByType({ type }: { type: string }) {
  const variant = type === 'HOMEWORK' ? 'default' : 'secondary';
  return <Badge variant={variant}>{type.toLowerCase()}</Badge>;
}
// console.log(process.env.NEXT_PUBLIC_MY_LINK);
function PlatformIcon({ platform }: { platform: string }) {
  const Icon = platform === 'LEETCODE' ? Code :
    platform === 'GFG' ? BookOpen :
      platform === 'INTERVIEWBIT' ? Brain :
        HelpCircle;

  return <Icon className="w-4 h-4 mr-2" />;
}

export default function AdminQuestionsBankPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    const topic = searchParams.get('topic');
    return (
      qSearch ||
      qLevel ||
      qPlatform ||
      qType ||
      (topic && topic !== 'all')
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQSearch('');
    setQLevel('');
    setQPlatform('');
    setQType('');
    setPage(1);
    // Clear all URL parameters
    const params = new URLSearchParams();
    params.set('page', '1');
    router.replace(`/admin/questions?${params.toString()}`);
  };

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
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
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
  const [topicsForBulkUpload, setTopicsForBulkUpload] = useState<{ label: string; value: string }[]>([]);

  const fetchTopics = useCallback(async () => {
    try {
      // Import api locally here to hit the topics endpoint
      const { default: api } = await import('@/lib/api');
      const res = await api.get('/api/admin/topics');
      setAllTopics(res.data.map((t: any) => ({ label: t.topic_name, value: t.slug })));
      setTopicsForBulkUpload(res.data.map((t: any) => ({ label: t.topic_name, value: t.id.toString() })));
    } catch (err) {
      handleError(err);
      console.error(err);
    }
  }, []);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (qSearch) params.set('search', qSearch);
    if (qLevel) params.set('level', qLevel);
    if (qPlatform) params.set('platform', qPlatform);
    if (qType) params.set('type', qType);
    const topic = searchParams.get('topic');
    if (topic && topic !== 'all') params.set('topic', topic);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    router.replace(`/admin/questions?${params.toString()}`);
  }, [qSearch, qLevel, qPlatform, qType, page, limit, searchParams.get('topic'), router]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const p: any = { page, limit };
      if (qSearch) p.search = qSearch;
      if (qLevel) p.level = qLevel;
      if (qPlatform) p.platform = qPlatform;
      if (qType) p.type = qType;
      if (searchParams.get('topic') && searchParams.get('topic') !== 'all') p.topicSlug = searchParams.get('topic');

      const res = await getAdminQuestions(p);
      setQuestions(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      handleError(err);
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  }, [qSearch, qLevel, qPlatform, qType, page, searchParams.get('topic')]);

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
      handleError(err);
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
      handleError(err);
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
      handleError(err);
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

  const openEdit = (question: any) => {
    setSelectedQ(question);
    setIsEditOpen(true);
  };

  // Bulk Upload Handlers
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setBulkValidationError('Please select a CSV file');
        return;
      }
      setBulkFile(selectedFile);
      validateBulkCSV(selectedFile);
    }
  };

  const validateBulkCSV = (file: File) => {
    setBulkValidationError('');
    setBulkUploadError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setBulkValidationError('CSV file is empty or invalid');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length === headers.length) {
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            rows.push(row);
          }
        }

        if (rows.length === 0) {
          setBulkValidationError('CSV file is empty or invalid');
          return;
        }

        // Check required columns
        const firstRow = rows[0];
        const requiredColumns = ['question_name', 'question_link', 'level', 'type'];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          setBulkValidationError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        // Validate each row
        const validLevels = ['EASY', 'MEDIUM', 'HARD'];
        const validTypes = ['HOMEWORK', 'CLASSWORK'];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          if (!row.question_name?.trim()) {
            setBulkValidationError(`Row ${i + 1}: Question name is required`);
            return;
          }

          if (!row.question_link?.trim()) {
            setBulkValidationError(`Row ${i + 1}: Question link is required`);
            return;
          }

          if (!validLevels.includes(row.level?.toUpperCase())) {
            setBulkValidationError(`Row ${i + 1}: Level must be EASY, MEDIUM, or HARD`);
            return;
          }

          if (!validTypes.includes(row.type?.toUpperCase())) {
            setBulkValidationError(`Row ${i + 1}: Type must be HOMEWORK or CLASSWORK`);
            return;
          }
        }

        setBulkCsvData(rows);
      } catch (error) {
        handleError(error);
        setBulkValidationError('Failed to parse CSV file');
      }
    };

    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile || bulkValidationError || !bulkSelectedTopic) return;

    setBulkLoading(true);
    setBulkUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', bulkFile);
      formData.append('topicId', bulkSelectedTopic);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/questions/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      // Show success message using alert for now
      alert(`Successfully uploaded ${result.inserted} out of ${result.totalRows} questions`);

      setIsBulkUploadOpen(false);
      setBulkFile(null);
      setBulkSelectedTopic('');
      setBulkValidationError('');
      setBulkUploadError('');
      setBulkCsvData([]);
      loadQuestions();
    } catch (error: any) {
      handleError(error);
      setBulkUploadError(error.message || 'Upload failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkClose = () => {
    if (!bulkLoading) {
      setIsBulkUploadOpen(false);
      setBulkFile(null);
      setBulkSelectedTopic('');
      setBulkValidationError('');
      setBulkUploadError('');
      setBulkCsvData([]);
    }
  };

  // Bulk Upload Modal State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkSelectedTopic, setBulkSelectedTopic] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkValidationError, setBulkValidationError] = useState('');
  const [bulkUploadError, setBulkUploadError] = useState('');
  const [bulkCsvData, setBulkCsvData] = useState<any[]>([]);

  const isBulkUploadDisabled = !bulkFile || !!bulkValidationError || bulkLoading || !bulkSelectedTopic;
  function TypeBadge({ type }: { type: string }) {
    const isHomework = type === "HOMEWORK";

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit
      ${isHomework
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-muted/40 text-muted-foreground border border-border"
          }`}
      >
        {isHomework ? (
          <BookOpen className="w-3.5 h-3.5" />
        ) : (
          <Code className="w-3.5 h-3.5" />
        )}

        {type}
      </div>
    );
  }

  function DifficultyBadge({ level }: { level: string }) {
    const config = {
      EASY: {
        color: "bg-green-500/10 text-green-400 border-green-500/20",
        
      },
      MEDIUM: {
        color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        
      },
      HARD: {
        color: "bg-red-500/10 text-red-400 border-red-500/20",
        
      },
    };

    const item = config[level as keyof typeof config];

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${item.color}`}
      >
        {level}
      </div>
    );
  }

  function PlatformBadge({ platform }: { platform: string }) {
    const config: any = {
      LEETCODE: {
        icon: Code,
        color: "bg-[#FFA116]/10 text-[#FFA116] border-[#FFA116]/20",
      },
      GFG: {
        icon: BookOpen,
        color: "bg-[#2F8D46]/10 text-[#2F8D46] border-[#2F8D46]/20",
      },
      INTERVIEWBIT: {
        icon: Brain,
        color: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
      },
      OTHER: {
        icon: HelpCircle,
        color: "bg-muted/40 text-muted-foreground border-border",
      },
    };

    const item = config[platform] || config.OTHER;
    const Icon = item.icon;

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${item.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {platform}
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-6">

      {/* ================= HEADER ================= */}
      <div className="glass card-premium rounded-2xl p-6 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Global Question Bank
            </h2>

          </div>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {totalRecords} Questions
        </div>
      </div>

      <div className="glass card-premium rounded-2xl p-4 flex flex-col gap-4">

        {/* TOP ROW → SEARCH + BUTTONS */}
        <div className="flex flex-col sm:flex-row  justify-between items-center">

          {/* SEARCH */}
          <div className="  relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search questions..."
              value={qSearch}
              onChange={(e) => {
                setQSearch(e.target.value);
                setPage(1);
              }}
              className="!pl-9 w-full h-11 rounded-xl bg-background/50"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 flex-wrap">

            <Button
              onClick={() => setIsBulkUploadOpen(true)}
              variant="outline"
              className="h-11 rounded-xl px-4 border-border hover:bg-muted/40"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-11 rounded-xl px-5 bg-primary text-black font-semibold hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>

          </div>
        </div>

        {/* BOTTOM ROW → FILTERS */}
        <div className='flex  justify-between'>

          <div className="flex flex-wrap gap-3 items-center ">
            <Select
              value={qLevel}
              onChange={(v) => { setQLevel(v as string); setPage(1); }}
              options={[
                { label: 'All Difficulties', value: '' },
                { label: 'Easy', value: 'EASY' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'Hard', value: 'HARD' },
              ]}
              className="w-[150px] border"
            />

            <Select
              value={qPlatform}
              onChange={(v) => { setQPlatform(v as string); setPage(1); }}
              options={[
                { label: 'All Platforms', value: '' },
                { label: 'LeetCode', value: 'LEETCODE' },
                { label: 'GFG', value: 'GFG' },
                { label: 'InterviewBit', value: 'INTERVIEWBIT' },
              ]}
              className="w-[170px] border"
            />

            <Select
              value={searchParams.get('topic') || 'all'}
              onChange={(v) => {
                const params = new URLSearchParams(searchParams.toString());
                if (v && v !== 'all') params.set('topic', v.toString());
                else params.delete('topic');
                params.set('page', '1');
                router.replace(`/admin/questions?${params.toString()}`);
              }}
              options={[
                { label: 'All Topics', value: 'all' },
                ...allTopics
              ]}
              className="w-[200px] border"
            />
          </div>
          <div>
            {/* CLEAR FILTER */}
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="h-10 p-4 py-5 fw-bold text-sm border border-border"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

          </div>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="glass card-premium rounded-2xl overflow-hidden">

        <div className="glass card-premium rounded-2xl overflow-hidden">

          <ScrollArea className="max-h-[600px]">

            <Table className='border-0'>

              {/* HEADER */}
              <TableHeader>
                <TableRow className="bg-muted/30 border-b border-border/40 p-6 ">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Question
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Type
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Difficulty
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Topic
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Platform
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* BODY */}
              <TableBody>

                {/* LOADING */}
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <TableRow key={i} className="border-b border-border/20">
                      <TableCell><Skeleton className="h-4 w-[220px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    </TableRow>
                  ))
                ) : questions.length === 0 ? (

                  /* EMPTY STATE */
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center text-muted-foreground">
                      No questions found
                    </TableCell>
                  </TableRow>

                ) : (

                  questions.map((q) => (
                    <TableRow
                      key={q.id}
                      className="group border-b border-border/20 hover:bg-muted/30 transition-all duration-200"
                    >

                      {/* QUESTION */}
                      <TableCell className="font-medium">
                        <a
                          href={q.question_link}
                          target="_blank"
                          className="flex items-center gap-2 hover:text-primary transition"
                        >
                          <span className="line-clamp-1">
                            {q.question_name}
                          </span>

                          <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition" />
                        </a>
                      </TableCell>

                      <TableCell>
                        <TypeBadge type={q.type} />
                      </TableCell>

                      <TableCell>
                        <DifficultyBadge level={q.level} />
                      </TableCell>


                      {/* TOPIC */}
                      <TableCell className="text-muted-foreground text-sm">
                        {q.topic?.topic_name}
                      </TableCell>

                      {/* PLATFORM */}

                      <TableCell>
                        <PlatformBadge platform={q.platform} />
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition">

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(q)}
                            className="h-8 w-8 rounded-lg hover:bg-primary/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedQ(q);
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

          </ScrollArea>

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

      {/* ================= MODALS ================= */}
      <CreateQuestion open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadQuestions} />
      <BulkUploadModal open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen} onSuccess={loadQuestions} topics={topicsForBulkUpload} />
      <UpdateQuestion open={isEditOpen} onOpenChange={setIsEditOpen} question={selectedQ} onSuccess={loadQuestions} />
      <DeleteQuestion open={isDeleteOpen} onOpenChange={setIsDeleteOpen} question={selectedQ} onSuccess={loadQuestions} />

    </div>
  );
}