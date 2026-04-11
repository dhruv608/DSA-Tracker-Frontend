"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getAdminQuestions, assignQuestionsToClass } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import { Search, AlertTriangle, ExternalLink, CheckCircle2, Circle, Home, GraduationCap } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { AssignQuestionsModalProps } from '@/types/admin/classDetail.types';
import { Question, QuestionFilters } from '@/types/admin/question.types';

function BadgeByLevel({ level }: { level: string }) {
   return <span className="px-2 py-0.5 rounded text-xs font-semibold text-muted-foreground">{level}</span>;
}

export default function AssignQuestionsModal({ isOpen, onClose, onSuccess, batchSlug, topicSlug, classSlug, assignedQuestions }: AssignQuestionsModalProps) {
   const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
   const [bankLoading, setBankLoading] = useState(false);
   const [bankSearch, setBankSearch] = useState('');
   const [bankLevel, setBankLevel] = useState('all');
   const [bankPlatform, setBankPlatform] = useState('all');
   const [bankPage, setBankPage] = useState(1);
   const [bankTotalPages, setBankTotalPages] = useState(1);
   const [selectedQuestions, setSelectedQuestions] = useState<Array<{ id: number; type: 'HOMEWORK' | 'CLASSWORK' }>>([]);
   const [submitting, setSubmitting] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');

   useEffect(() => {
      if (isOpen) {
         setBankPage(1);
         setBankSearch('');
         setBankLevel('all');
         setBankPlatform('all');
         setSelectedQuestions([]);
         setErrorMsg('');
         fetchBankQuestions();
      }
   }, [isOpen]);

   useEffect(() => {
      if (isOpen) {
         fetchBankQuestions();
      }
   }, [bankPage, bankSearch, bankLevel, bankPlatform]);

   // Handle Enter key to trigger submit
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter' && isOpen && !submitting && selectedQuestions.length > 0) {
            e.preventDefault();
            handleSubmit();
         }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, submitting, selectedQuestions]);

   const fetchBankQuestions = async () => {
      setBankLoading(true);
      try {
         const params: QuestionFilters = { page: bankPage, limit: 50 };
         if (bankSearch && bankSearch !== 'all') params.search = bankSearch;
         if (bankLevel && bankLevel !== 'all') params.level = bankLevel;
         if (bankPlatform && bankPlatform !== 'all') params.platform = bankPlatform;
         params.topicSlug = topicSlug;

         const res = await getAdminQuestions(params);
         setBankQuestions(res.data);
         setBankTotalPages(res.pagination.totalPages);
      } catch (err) {
         // Error is handled by API client interceptor
         console.error("Failed to fetch bank questions", err);
      } finally {
         setBankLoading(false);
      }
   };

   const toggleSelection = (id: number) => {
      setSelectedQuestions(prev => {
         const exists = prev.find(q => q.id === id);
         if (exists) {
            return prev.filter(q => q.id !== id);
         }
         return [...prev, { id, type: 'HOMEWORK' as const }];
      });
   };

   const updateSelectedType = (id: number, type: 'HOMEWORK' | 'CLASSWORK') => {
      setSelectedQuestions(prev =>
         prev.map(q => q.id === id ? { ...q, type } : q)
      );
   };

   const handleSubmit = async () => {
      if (selectedQuestions.length === 0) return;
      setErrorMsg('');
      setSubmitting(true);
      try {
         await assignQuestionsToClass(batchSlug, topicSlug, classSlug, {
            questions: selectedQuestions.map(q => ({ question_id: q.id, type: q.type }))
         });
         onClose();
         setSelectedQuestions([]);
         onSuccess();
      } catch (err: any) {
         // Error is handled by API client interceptor
         setErrorMsg(err.response?.data?.error || 'Failed to assign questions');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-[600px] h-[90vh] overflow-auto no-scrollbar flex flex-col p-0 rounded-2xl border border-border bg-background/95 backdrop-blur-xl">
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

               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                     placeholder="Search questions by name..."
                     value={bankSearch}
                     onChange={(e) => setBankSearch(e.target.value)}
                     className="!pl-12 w-full h-12 rounded-xl text-base focus-visible:ring-2 focus-visible:ring-primary/40 transition"
                  />
               </div>

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
                     <SelectTrigger className="h-10 rounded-2xl">
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

               <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl">
                  <p className="text-sm text-primary font-medium flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" />
                     Showing questions only for this topic
                  </p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar min-h-[320px]">
               <div className="grid gap-3 p-4">
                  {bankLoading ? (
                     <div className="flex items-center justify-center h-32">
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

                              <div className="flex flex-col gap-3 pr-8">
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

            <div className="p-4 border-t border-border flex items-center justify-between">
               <span className="text-sm font-medium">
                  {selectedQuestions.length} Selected
               </span>

               <div className="flex gap-3">
                  <Button
                     variant="outline"
                     className="rounded-xl px-5"
                     onClick={onClose}
                     disabled={submitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleSubmit}
                     disabled={selectedQuestions.length === 0 || submitting}
                     className="rounded-xl px-5"
                  >
                     {submitting ? 'Assigning...' : `Assign ${selectedQuestions.length} Question${selectedQuestions.length !== 1 ? 's' : ''}`}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
