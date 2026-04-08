"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';
import api from '@/lib/api';
import {
   getAdminClassQuestions,
   assignQuestionsToClass,
   removeQuestionFromClass,
   getAdminQuestions,
   updateQuestionVisibilityType
} from '@/services/admin.service';
import {
   Plus,
   Search,
   Trash2,
   ArrowLeft,
   BookOpen,
   Filter,
   ExternalLink,
   FolderEdit,
   CheckCircle2,
   Circle,
   AlertTriangle,
   Pencil,
   GraduationCap,
   Home
} from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

import { Pagination } from '@/components/Pagination';
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
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { handleToastError } from "@/utils/toast-system";
import { DeleteModal } from '@/components/DeleteModal';

function BadgeByLevel({ level }: { level: string }) {
   return <span className="px-2 py-0.5 rounded text-xs font-semibold text-muted-foreground">{level}</span>;
}

function AssignBadgeByLevel({ level }: { level: string }) {
   const cn = level === 'EASY' ? 'bg-green-500/10 text-green-600' :
      level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600' :
         'bg-red-500/10 text-red-500';
   return <span className={`px-2 py-1 rounded text-xs font-semibold ${cn}`}>{level}</span>;
}

export default function AdminClassDetailsPage() {
   const params = useParams();
   const router = useRouter();
   const topicSlug = decodeURIComponent(params.topicSlug as string);
   const classSlug = decodeURIComponent(params.classSlug as string);

   const { selectedBatch, isLoadingContext } = useAdminStore();

   // Assigned Questions Data
   const [assignedQuestions, setAssignedQuestions] = useState<any[]>([]);
   const [loading, setLoading] = useState(false);
   const [search, setSearch] = useState('');
   const [assignedPage, setAssignedPage] = useState(1);
   const [assignedTotalPages, setAssignedTotalPages] = useState(1);
   const [assignedTotalCount, setAssignedTotalCount] = useState(0);
   const [limit, setLimit] = useState(10);

   // Assign Modal States
   const [isAssignOpen, setIsAssignOpen] = useState(false);
   const [bankQuestions, setBankQuestions] = useState<any[]>([]);
   const [bankLoading, setBankLoading] = useState(false);
   const [bankSearch, setBankSearch] = useState('');
   const [bankLevel, setBankLevel] = useState('all');
   const [bankPlatform, setBankPlatform] = useState('all');
   const [bankPage, setBankPage] = useState(1);
   const [bankTotalPages, setBankTotalPages] = useState(1);
   // New format: each question has id and type (HOMEWORK/CLASSWORK)
   const [selectedQuestions, setSelectedQuestions] = useState<Array<{ id: number; type: 'HOMEWORK' | 'CLASSWORK' }>>([]);

   // Edit Type Modal States
   const [isEditTypeOpen, setIsEditTypeOpen] = useState(false);
   const [editingQuestion, setEditingQuestion] = useState<any>(null);
   const [editType, setEditType] = useState<'HOMEWORK' | 'CLASSWORK'>('HOMEWORK');

   // Delete Modal States
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [deletingQuestion, setDeletingQuestion] = useState<any>(null);
   const [submitting, setSubmitting] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');

   const fetchAssigned = async (page: number = 1, searchQuery: string = search) => {
      if (!selectedBatch) return;
      setLoading(true);
      try {
         const params: any = { page, limit };
         if (searchQuery) params.search = searchQuery;

         const response = await api.get(`/api/admin/${selectedBatch.slug}/topics/${topicSlug}/classes/${classSlug}/questions`, { params });
         const data = response.data;
         // Backend returns { message: "...", data: [...], pagination: {...} }
         setAssignedQuestions(data.data || []);
         setAssignedTotalPages(data.pagination?.totalPages || 1);
         setAssignedTotalCount(data.pagination?.total || 0);
      } catch (err: any) {
         handleToastError(err);
         console.error("Failed to fetch assigned questions", err);
         // If current deeply tracked class does not exist in active batch context, redirect out safely.
         if (err.response?.status === 400 || err.response?.status === 404) {
            router.push('/admin/topics');
         }
      } finally {
         setLoading(false);
      }
   };

   const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setAssignedPage(1); // Reset to first page when limit changes
   };

   useEffect(() => {
      fetchAssigned(assignedPage, search);
   }, [selectedBatch, topicSlug, classSlug, assignedPage, search, limit]);

   // Modal Bank querying
   const fetchBankQuestions = async () => {
      setBankLoading(true);
      try {
         const params: any = { page: bankPage, limit: 50 };
         if (bankSearch && bankSearch !== 'all') params.search = bankSearch;
         if (bankLevel && bankLevel !== 'all') params.level = bankLevel;
         if (bankPlatform && bankPlatform !== 'all') params.platform = bankPlatform;
         params.topicSlug = topicSlug; // Only search questions mapped to this topic by default?
         //  The backend supports cross-topic querying if topicSlug is omitted. Let's force topic-scope to prevent confusion.

         const res = await getAdminQuestions(params);
         setBankQuestions(res.data);
         setBankTotalPages(res.pagination.totalPages);
      } catch (err) {
         handleToastError(err);
         console.error("Failed to fetch bank questions", err);
      } finally {
         setBankLoading(false);
      }
   };

   useEffect(() => {
      if (isAssignOpen) {
         fetchBankQuestions();
      }
   }, [isAssignOpen, bankPage, bankSearch, bankLevel, bankPlatform]);

   const toggleSelection = (id: number) => {
      setSelectedQuestions(prev => {
         const exists = prev.find(q => q.id === id);
         if (exists) {
            return prev.filter(q => q.id !== id);
         }
         // Default type is HOMEWORK when selecting
         return [...prev, { id, type: 'HOMEWORK' as const }];
      });
   };

   const updateSelectedType = (id: number, type: 'HOMEWORK' | 'CLASSWORK') => {
      setSelectedQuestions(prev =>
         prev.map(q => q.id === id ? { ...q, type } : q)
      );
   };

   const handleAssignSubmit = async () => {
      if (selectedQuestions.length === 0) return;
      setErrorMsg('');
      setSubmitting(true);
      try {
         await assignQuestionsToClass(selectedBatch!.slug, topicSlug, classSlug, {
            questions: selectedQuestions.map(q => ({ question_id: q.id, type: q.type }))
         });
         setIsAssignOpen(false);
         setSelectedQuestions([]);
         fetchAssigned();
      } catch (err: any) {
         handleToastError(err);
         setErrorMsg(err.response?.data?.error || 'Failed to assign questions');
      } finally {
         setSubmitting(false);
      }
   };

   const handleRemoveQuestion = async (questionId: number) => {
      const questionObj = assignedQuestions.find(q => {
         const questionData = q.question || q;
         return questionData.id === questionId;
      });

      if (questionObj) {
         setDeletingQuestion(questionObj);
         setIsDeleteOpen(true);
      }
   };

   const handleConfirmDelete = async () => {
      if (!deletingQuestion) return;

      try {
         setSubmitting(true);
         const q = deletingQuestion.question || deletingQuestion;
         await removeQuestionFromClass(selectedBatch!.slug, topicSlug, classSlug, q.id);
         fetchAssigned();
         setIsDeleteOpen(false);
         setDeletingQuestion(null);
      } catch (err: any) {
         handleToastError(err);
         alert(err.response?.data?.error || "Failed to remove question");
      } finally {
         setSubmitting(false);
      }
   };

   // Open edit type modal
   const handleOpenEditType = (question: any) => {
      setEditingQuestion(question);
      setEditType(question.type || 'HOMEWORK');
      setIsEditTypeOpen(true);
   };

   // Submit edit type
   const handleEditTypeSubmit = async () => {
      if (!editingQuestion) return;
      setSubmitting(true);
      try {
         await updateQuestionVisibilityType(
            selectedBatch!.slug,
            topicSlug,
            classSlug,
            editingQuestion.visibility_id || editingQuestion.id,
            editType
         );
         setIsEditTypeOpen(false);
         setEditingQuestion(null);
         fetchAssigned();
      } catch (err: any) {
         handleToastError(err);
         alert(err.response?.data?.error || "Failed to update question type");
      } finally {
         setSubmitting(false);
      }
   };


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
            <Link href={`/admin/topics/${topicSlug}`} className="hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium">
               <ArrowLeft className="w-4 h-4" /> Back to Classes
            </Link>
         </div>

         <div className="flex items-end justify-between">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" /> Class Questions
               </h2>
               <p className="text-muted-foreground mt-1 text-sm font-mono bg-muted inline-block px-2 py-0.5 rounded-2xl border border-border mt-2">
                  {selectedBatch.name} / {topicSlug} / {classSlug}
               </p>
            </div>
            <Button onClick={() => { setIsAssignOpen(true); setSelectedQuestions([]); setErrorMsg(''); }} className="gap-2">
               <Plus className="w-4 h-4" /> Assign Questions
            </Button>
         </div>

         <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
            <div className="
  glass rounded-xl overflow-hidden
  border border-[var(--glass-border)]
  shadow-sm
">

               <div className="flex items-center justify-between  px-5 py-4  border-border/60  ">

                  <div className="relative flex-1 max-w-sm group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none transition group-focus-within:text-primary " />
                     <Input
                        placeholder="Search classes..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setAssignedPage(1); }}
                        className="h-10 w-full !pl-9 pr-9 rounded-full bg-accent/40   border-0 focus:ring-2 focus:ring-primary/20 focus:bg-accent/60   transition-all    "
                     />
                  </div>

                  {/* COUNT BADGE */}
                  <div className="  text-xs font-semibold tracking-wide  px-3 py-1.5 rounded-full   bg-primary/10 text-primary  border border-primary/20    shadow-[0_0_10px_var(--hover-glow)]   ">
                     {assignedTotalCount} Assigned
                  </div>

               </div>
            </div>

            <div className="overflow-x-auto ">
               <Table className="border-separate border-spacing-y-2">

                  {/* HEADER */}
                  <TableHeader>
                     <TableRow className="border-0">
                        <TableHead className="text-muted-foreground font-medium text-xs tracking-wide">
                           Question Name
                        </TableHead>
                        <TableHead className="text-muted-foreground font-medium text-xs">
                           Platform
                        </TableHead>
                        <TableHead className="text-muted-foreground font-medium text-xs">
                           Difficulty
                        </TableHead>
                        <TableHead className="text-muted-foreground font-medium text-xs">
                           Type
                        </TableHead>
                        <TableHead className="text-muted-foreground font-medium text-xs">
                           Assigned Date
                        </TableHead>
                        <TableHead className="text-right text-muted-foreground font-medium text-xs">
                           Actions
                        </TableHead>
                     </TableRow>
                  </TableHeader>

                  {/* BODY */}
                  <TableBody>

                     {assignedQuestions.map((qObj: any) => {
                        const q = qObj.question || qObj;

                        return (
                           <TableRow
                              key={q.id}
                              className="group border-0  bg-accent/30  hover:bg-accent/50   backdrop-blur-md   rounded-xl  transition-all duration-200   "
                           >

                              {/* QUESTION */}
                              <TableCell className="rounded-l-xl py-3">
                                 <a
                                    href={q.question_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className=" font-medium text-foreground hover:text-primary  transition-colors  flex items-center gap-1.5  "
                                 >
                                    {q.question_name}
                                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                 </a>
                              </TableCell>

                              {/* PLATFORM */}
                              <TableCell>
                                 <div className="flex items-center gap-2">
                                    {q.platform?.toLowerCase().includes('leetcode') ? (
                                       <LeetCodeIcon className="w-4 h-4 text-leetcode" />
                                    ) : q.platform?.toLowerCase().includes('gfg') ? (
                                       <GeeksforGeeksIcon className="w-4 h-4 text-gfg" />
                                    ) : (
                                       <div className="w-4 h-4 bg-muted rounded" />
                                    )}
                                    <span className="text-xs font-semibold tracking-wide text-muted-foreground   py-1 rounded-full">
                                       {q.platform}
                                    </span>
                                 </div>
                              </TableCell>

                              {/* DIFFICULTY */}
                              <TableCell>
                                 <BadgeByLevel level={q.level} />
                              </TableCell>

                              {/* TYPE - from visibility */}
                              <TableCell>
                                 <button
                                    onClick={() => handleOpenEditType(qObj)}
                                    className={`text-xs px-2 py-1 rounded-full font-medium transition-colors hover:opacity-80 ${
                                       qObj.type === 'CLASSWORK'
                                          ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                                          : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
                                    }`}
                                 >
                                    {qObj.type === 'CLASSWORK' ? 'Classwork' : 'Homework'}
                                 </button>
                              </TableCell>

                              {/* DATE */}
                              <TableCell>
                                 <span className="text-xs text-muted-foreground">
                                    {q.created_at
                                       ? new Date(q.created_at).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                       })
                                       : 'N/A'}
                                 </span>
                              </TableCell>

                              {/* ACTION */}
                              <TableCell className="text-right rounded-r-xl">
                                 <div className="flex items-center justify-end gap-1">
                                    {/* EDIT TYPE BUTTON */}
                                    <Button
                                       variant="ghost"
                                       size="icon"
                                       onClick={() => handleOpenEditType(qObj)}
                                       className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                       title="Edit Type"
                                    >
                                       <Pencil className="w-4 h-4" />
                                    </Button>
                                    
                                    {/* DELETE BUTTON */}
                                    <Button
                                       variant="ghost"
                                       size="icon"
                                       onClick={() => handleRemoveQuestion(q.id)}
                                       className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </Button>
                                 </div>
                              </TableCell>

                           </TableRow>
                        );
                     })}

                  </TableBody>
               </Table>
            </div>
         </div>

         {/* PAGINATION FOR ASSIGNED QUESTIONS */}
         <Pagination
            currentPage={assignedPage}
            totalItems={assignedTotalCount}
            limit={limit}
            onPageChange={setAssignedPage}
            onLimitChange={(newLimit: number) => {
               setLimit(newLimit);
               setAssignedPage(1);
            }}
            showLimitSelector={true}
            loading={loading}
         />

         {/* ASSIGN QUESTIONS MODAL */}
         <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogContent className="max-w-150! max-h-[90vh] overflow-auto no-scrollbar flex flex-col p-0 rounded-2xl border border-border bg-background/95 backdrop-blur-xl">

               {/* Header */}
               <div className="p-6 border-border shrink-0 space-y-4">
                  <DialogHeader className="space-y-1">
                     <DialogTitle className="text-xl font-semibold">
                        Assign Questions
                     </DialogTitle>
                     <DialogDescription className="text-sm text-muted-foreground">
                        Search the Global Question Bank to append assignments to this class block.
                     </DialogDescription>
                  </DialogHeader>

                  {errorMsg && (
                     <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                        {errorMsg}
                     </div>
                  )}

                  {/* Search */}
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                     <Input
                        placeholder="Search questions by name..."
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="!pl-12 w-full h-12 rounded-xl text-base focus-visible:ring-2 focus-visible:ring-primary/40 transition"
                     />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                     <Select value={bankLevel} onValueChange={(v) => setBankLevel(v)}>
                        <SelectTrigger className="h-10 rounded-xl w-[160px]">
                           <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="all">All Levels</SelectItem>
                           <SelectItem value="EASY">Easy</SelectItem>
                           <SelectItem value="MEDIUM">Medium</SelectItem>
                           <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                     </Select>

                     <Select value={bankPlatform} onValueChange={(v) => setBankPlatform(v)}>
                        <SelectTrigger className="h-10 rounded-2xl ">
                           <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl w-full">
                           <SelectItem value="all">All Platforms</SelectItem>
                           <SelectItem value="LEETCODE" className="flex items-center gap-2">
                              LeetCode
                           </SelectItem>
                           <SelectItem value="GFG" className="flex items-center gap-2">
                              GeeksForGeeks
                           </SelectItem>
                           <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl">
                     <p className="text-sm text-primary font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Showing questions only for this topic
                     </p>
                  </div>
               </div>

               {/* List */}
               <div className="flex-1 overflow-y-auto no-scrollbar min-h-[320px]">
                  <div className="grid gap-3 p-4">

                     {bankLoading ? (
                        <div className="flex items-center justify-center h-32">
                           {/* <BruteForceLoader size="sm" /> */}
                           <span className="ml-2 text-sm text-muted-foreground">
                              Loading questions...
                           </span>
                        </div>
                     ) : bankQuestions.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                           <p className="text-muted-foreground">
                              No questions found matching your criteria.
                           </p>
                        </div>
                     ) : (
                        bankQuestions.map((q) => {
                           const isAssigned = assignedQuestions.some(
                              (aq) => (aq.question?.id || aq.id) === q.id
                           );
                           const selectedQ = selectedQuestions.find(sq => sq.id === q.id);
                           const isSelected = !!selectedQ;

                           return (
                              <div
                                 key={q.id}
                                 className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${isSelected
                                    ? "bg-primary/10 border-primary/30"
                                    : isAssigned
                                       ? "bg-muted/50 border-border/50 opacity-60 cursor-not-allowed"
                                       : "bg-card border-border hover:border-primary/40 hover:bg-muted/40"
                                    }`}
                                 onClick={() => !isAssigned && toggleSelection(q.id)}
                              >
                                 {/* ✅ Checkbox TOP RIGHT */}
                                 <div className="absolute top-4 right-4">
                                    {!isAssigned ? (
                                       isSelected ? (
                                          <CheckCircle2 className="w-5 h-5 text-primary" />
                                       ) : (
                                          <Circle className="w-5 h-5 text-muted-foreground/30" />
                                       )
                                    ) : (
                                       <span className="text-[10px] bg-muted px-2 py-1 rounded">
                                          Assigned
                                       </span>
                                    )}
                                 </div>

                                 {/* CONTENT */}
                                 <div className="flex flex-col gap-3 pr-8">

                                    {/* TYPE TOGGLE - Show only when selected */}
                                    {isSelected && !isAssigned && (
                                       <div className="flex items-center gap-2 mb-2">
                                          <span className="text-xs text-muted-foreground">Type:</span>
                                          <div className="flex rounded-lg border border-border overflow-hidden">
                                             <button
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   updateSelectedType(q.id, 'HOMEWORK');
                                                }}
                                                className={`px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${selectedQ?.type === 'HOMEWORK'
                                                   ? 'bg-primary text-primary-foreground'
                                                   : 'bg-muted hover:bg-muted/80'
                                                   }`}
                                             >
                                                <Home className="w-3 h-3" />
                                                Homework
                                             </button>
                                             <button
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   updateSelectedType(q.id, 'CLASSWORK');
                                                }}
                                                className={`px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${selectedQ?.type === 'CLASSWORK'
                                                   ? 'bg-primary text-primary-foreground'
                                                   : 'bg-muted hover:bg-muted/80'
                                                   }`}
                                             >
                                                <GraduationCap className="w-3 h-3" />
                                                Classwork
                                             </button>
                                          </div>
                                       </div>
                                    )}

                                    {/* ALIGNMENT NAME AT TOP */}
                                    <div
                                       className="flex items-center gap-2 font-semibold text-base hover:text-primary transition cursor-pointer"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          if (q.question_link) {
                                             window.open(q.question_link, "_blank", "noopener,noreferrer");
                                          }
                                       }}
                                    >
                                       <span className="line-clamp-2">{q.question_name}</span>
                                       <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 shrink-0" />
                                    </div>

                                    {/* LEVEL & PLATFORM BADGES */}
                                    <div className="flex flex-wrap items-center gap-2">
                                       <BadgeByLevel level={q.level} />
                                       <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                          {q.platform === "LEETCODE" ? "LeetCode" :
                                             q.platform === "GFG" ? "GeeksForGeeks" :
                                                q.platform || "Other"}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           );
                        })
                     )}
                  </div>
               </div>

               {/* Footer */}
               <div className="p-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium">
                     {selectedQuestions.length} Selected
                  </span>

                  <div className="flex gap-3">
                     <Button
                        variant="outline"
                        className="rounded-xl px-5"
                        onClick={() => setIsAssignOpen(false)}
                        disabled={submitting}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={handleAssignSubmit}
                        disabled={selectedQuestions.length === 0 || submitting}
                        className="rounded-xl px-5"
                     >
                        {submitting ? 'Assigning...' : `Assign ${selectedQuestions.length} Question${selectedQuestions.length !== 1 ? 's' : ''}`}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>

         {/* EDIT TYPE MODAL */}
         <Dialog open={isEditTypeOpen} onOpenChange={setIsEditTypeOpen}>
            <DialogContent className="max-w-md rounded-2xl">
               <DialogHeader>
                  <DialogTitle>Edit Question Type</DialogTitle>
                  <DialogDescription>
                     Change the type for <strong>{editingQuestion?.question?.question_name || editingQuestion?.question_name}</strong>
                  </DialogDescription>
               </DialogHeader>

               <div className="py-6">
                  <div className="flex rounded-xl border border-border overflow-hidden">
                     <button
                        onClick={() => setEditType('HOMEWORK')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${editType === 'HOMEWORK'
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-muted hover:bg-muted/80'
                           }`}
                     >
                        <Home className="w-4 h-4" />
                        Homework
                     </button>
                     <button
                        onClick={() => setEditType('CLASSWORK')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${editType === 'CLASSWORK'
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-muted hover:bg-muted/80'
                           }`}
                     >
                        <GraduationCap className="w-4 h-4" />
                        Classwork
                     </button>
                  </div>
               </div>

               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setIsEditTypeOpen(false)}
                     disabled={submitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleEditTypeSubmit}
                     disabled={submitting}
                  >
                     {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* DELETE QUESTION MODAL */}
         <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => {
               setIsDeleteOpen(false);
               setDeletingQuestion(null);
            }}
            onConfirm={handleConfirmDelete}
            submitting={submitting}
            title="Remove Question"
            itemName={deletingQuestion?.question?.question_name || deletingQuestion?.question_name || 'this question'}
            warningText="This will detach the question from this class. Students will no longer see this question in their class assignments."
         />
      </div>
   );
}

// Skeleton loading component
function Skeletons() {
   return (
      <div className="space-y-6 animate-pulse">
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <div className="h-4 w-32 bg-muted rounded-md shrink-0 mb-4"></div>
               <div className="h-8 w-64 bg-muted rounded-md shrink-0"></div>
               <div className="h-4 w-96 bg-muted/60 rounded-md shrink-0"></div>
            </div>
            <div className="h-10 w-32 bg-muted rounded-md shrink-0"></div>
         </div>
         <div className="h-[400px] w-full bg-card border border-border rounded-xl"></div>
      </div>
   );
}
