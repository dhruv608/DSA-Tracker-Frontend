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
   getAdminQuestions
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
   AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { DeleteModal } from '@/components/DeleteModal';
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
import { handleError } from "@/utils/handleError";

function BadgeByLevel({ level }: { level: string }) {
   const cn = level === 'EASY' ? 'bg-green-500/10 text-green-500' :
      level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600' :
         'bg-red-500/10 text-red-500';
   return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cn}`}>{level}</span>;
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
   const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

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
       handleError(err);
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
       handleError(err);
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
      setSelectedQuestionIds(prev =>
         prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
   };

   const handleAssignSubmit = async () => {
      if (selectedQuestionIds.length === 0) return;
      setErrorMsg('');
      setSubmitting(true);
      try {
         await assignQuestionsToClass(selectedBatch!.slug, topicSlug, classSlug, {
            question_ids: selectedQuestionIds
         });
         setIsAssignOpen(false);
         setSelectedQuestionIds([]);
         fetchAssigned();
      } catch (err: any) {
       handleError(err);
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
       handleError(err);
         alert(err.response?.data?.error || "Failed to remove question");
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
            <Button onClick={() => { setIsAssignOpen(true); setSelectedQuestionIds([]); setErrorMsg(''); }} className="gap-2">
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
                        className="h-10 !pl-9 !pr-9 rounded-full bg-accent/40   border-0 focus:ring-2 focus:ring-primary/20 focus:bg-accent/60   transition-all    "
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
                              className="
            group border-0

            bg-accent/30
            hover:bg-accent/50

            backdrop-blur-md

            rounded-xl
            transition-all duration-200
          "
                           >

                              {/* QUESTION */}
                              <TableCell className="rounded-l-xl py-3">
                                 <a
                                    href={q.question_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                font-medium text-foreground
                hover:text-primary
                transition-colors
                flex items-center gap-1.5
              "
                                 >
                                    {q.question_name}
                                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                 </a>
                              </TableCell>

                              {/* PLATFORM */}
                              <TableCell>
                                 <span className="
              text-xs font-semibold tracking-wide
              text-muted-foreground
              bg-muted px-2 py-1 rounded-full
            ">
                                    {q.platform}
                                 </span>
                              </TableCell>

                              {/* DIFFICULTY */}
                              <TableCell>
                                 <BadgeByLevel level={q.level} />
                              </TableCell>

                              {/* TYPE */}
                              <TableCell>
                                 <span className="text-xs italic text-muted-foreground capitalize">
                                    {q.type?.toLowerCase() || 'Homework'}
                                 </span>
                              </TableCell>

                              {/* DATE */}
                              <TableCell>
                                 <span className="text-xs text-muted-foreground">
                                    {qObj.assigned_at
                                       ? new Date(qObj.assigned_at).toLocaleDateString('en-GB')
                                       : 'N/A'}
                                 </span>
                              </TableCell>

                              {/* ACTION */}
                              <TableCell className="text-right rounded-r-xl">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveQuestion(q.id)}
                                    className="
                h-8 w-8 rounded-full

                text-muted-foreground
                hover:text-destructive
                hover:bg-destructive/10

                transition-all
              "
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </Button>
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
            <DialogContent className="max-w-[760px] max-h-[90vh] flex flex-col p-0 rounded-2xl border border-border bg-background/95 backdrop-blur-xl">

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
                        className="pl-12 h-12 rounded-xl text-base focus-visible:ring-2 focus-visible:ring-primary/40 transition"
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
                        <SelectTrigger className="h-10 rounded-xl w-[180px]">
                           <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="all">All Platforms</SelectItem>
                           <SelectItem value="LEETCODE">LeetCode</SelectItem>
                           <SelectItem value="GFG">GeeksForGeeks</SelectItem>
                           <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                     <p className="text-sm text-primary font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Showing questions only for this topic
                     </p>
                  </div>
               </div>

               {/* List */}
               <div className="flex-1 overflow-y-auto min-h-[320px]">
                  <div className="grid gap-3 p-4">

                     {bankLoading ? (
                        <div className="flex items-center justify-center h-32">
                           <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                           const isSelected = selectedQuestionIds.includes(q.id);

                           return (
                              <div
                                 key={q.id}
                                 className={`p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                                    ? "bg-primary/10 border-primary/30"
                                    : isAssigned
                                       ? "bg-muted/50 border-border/50 opacity-60 cursor-not-allowed"
                                       : "bg-card border-border hover:border-primary/40 hover:bg-muted/40"
                                    }`}
                                 onClick={() => !isAssigned && toggleSelection(q.id)}
                              >
                                 <div className="flex justify-between gap-4">
                                    <div className="flex-1 min-w-0 space-y-2">

                                       {/* Tags */}
                                       <div className="flex flex-wrap gap-2">
                                          <BadgeByLevel level={q.level} />
                                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                             {q.type?.toLowerCase() === "classwork"
                                                ? "Classwork"
                                                : "Homework"}
                                          </span>
                                          <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-600">
                                             {q.platform === "LEETCODE"
                                                ? "LeetCode"
                                                : q.platform === "GFG"
                                                   ? "GeeksForGeeks"
                                                   : q.platform || "Other"}
                                          </span>
                                       </div>

                                       {/* Title */}
                                       <h4 className="font-semibold text-base line-clamp-2">
                                          {q.question_name}
                                       </h4>

                                       {/* Link */}
                                       <a
                                          href={q.question_link}
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-sm text-primary flex items-center gap-1 hover:underline"
                                       >
                                          View Question <ExternalLink className="w-3 h-3" />
                                       </a>
                                    </div>
                                 </div>

                                 {/* Status */}
                                 <div className="flex items-center gap-2 mt-3">
                                    {!isAssigned ? (
                                       isSelected ? (
                                          <CheckCircle2 className="w-5 h-5 text-primary" />
                                       ) : (
                                          <Circle className="w-5 h-5 text-muted-foreground/30 border-2 border-dashed" />
                                       )
                                    ) : (
                                       <span className="text-xs bg-muted px-2 py-1 rounded">
                                          Already Assigned
                                       </span>
                                    )}
                                 </div>
                              </div>
                           );
                        })
                     )}
                  </div>
               </div>

               {/* Pagination */}
               <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
                  <span className="text-sm text-muted-foreground">
                     {bankQuestions.length > 0 && `${bankQuestions.length} questions found`}
                  </span>

                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        className="h-9 rounded-xl"
                        onClick={() => setBankPage((p) => Math.max(1, p - 1))}
                        disabled={bankPage === 1 || bankLoading}
                     >
                        Previous
                     </Button>

                     <Button
                        variant="outline"
                        className="h-9 rounded-xl"
                        onClick={() => setBankPage((p) => Math.min(bankTotalPages, p + 1))}
                        disabled={bankPage === bankTotalPages || bankLoading}
                     >
                        Next
                     </Button>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium">
                     {selectedQuestionIds.length} Selected
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
                        className="rounded-xl px-6 shadow-sm hover:shadow-md transition"
                        onClick={handleAssignSubmit}
                        disabled={submitting || selectedQuestionIds.length === 0}
                     >
                        {submitting ? "Assigning..." : "Add Selected"}
                     </Button>
                  </div>
               </div>
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
