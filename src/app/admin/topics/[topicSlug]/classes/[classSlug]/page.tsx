"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';
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
  CheckCircle2,
  Circle
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

  // Assign Modal States
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [bankLevel, setBankLevel] = useState('');
  const [bankPlatform, setBankPlatform] = useState('');
  const [bankPage, setBankPage] = useState(1);
  const [bankTotalPages, setBankTotalPages] = useState(1);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAssigned = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const data = await getAdminClassQuestions(selectedBatch.slug, topicSlug, classSlug);
      // Backend returns either direct array or { questions: [] }
      setAssignedQuestions(Array.isArray(data) ? data : (data.questions || []));
    } catch (err: any) {
      console.error("Failed to fetch assigned questions", err);
      // If the current deeply tracked class does not exist in the active batch context, redirect out safely.
      if (err.response?.status === 400 || err.response?.status === 404) {
          router.push('/admin/topics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [selectedBatch, topicSlug, classSlug]);

  // Modal Bank querying
  const fetchBankQuestions = async () => {
    setBankLoading(true);
    try {
      const params: any = { page: bankPage, limit: 10 };
      if (bankSearch) params.search = bankSearch;
      if (bankLevel) params.level = bankLevel;
      if (bankPlatform) params.platform = bankPlatform;
      params.topicSlug = topicSlug; // Only search questions mapped to this topic by default? The backend supports cross-topic querying if topicSlug is omitted. Let's force topic-scope to prevent confusion.
      
      const res = await getAdminQuestions(params);
      setBankQuestions(res.data);
      setBankTotalPages(res.pagination.totalPages);
    } catch (err) {
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
        questionIds: selectedQuestionIds
      });
      setIsAssignOpen(false);
      setSelectedQuestionIds([]);
      fetchAssigned();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to assign questions');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    if(!confirm("Are you sure you want to detach this question from the class?")) return;
    try {
      await removeQuestionFromClass(selectedBatch!.slug, topicSlug, classSlug, questionId);
      fetchAssigned();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to remove question");
    }
  };

  const filteredAssigned = assignedQuestions.filter(q => {
     // Account for possible nested vs flat structure based on arbitrary backend mappings.
     const name = q.question?.question_name || q.question_name || "";
     return name.toLowerCase().includes(search.toLowerCase());
  });

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
           <p className="text-muted-foreground mt-1 text-sm font-mono bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
             {selectedBatch.name} / {topicSlug} / {classSlug}
           </p>
         </div>
         <Button onClick={() => { setIsAssignOpen(true); setSelectedQuestionIds([]); setErrorMsg(''); }} className="gap-2">
           <Plus className="w-4 h-4" /> Assign Questions
         </Button>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
         <div className="p-4 border-b border-border flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                 placeholder="Search assigned questions..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9 bg-background focus-visible:ring-1"
              />
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md font-medium">
               {assignedQuestions.length} Total Assigned
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                 <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Question Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {loading ? (
                    <TableRow>
                       <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Loading assignments...
                       </TableCell>
                    </TableRow>
                 ) : filteredAssigned.length === 0 ? (
                    <TableRow>
                       <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                          No questions have been attached to this class.
                       </TableCell>
                    </TableRow>
                 ) : (
                    filteredAssigned.map((qObj) => {
                       const q = qObj.question || qObj; // Flatten potential nested structure
                       return (
                       <TableRow key={q.id} className="group">
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <a href={q.question_link} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                                   {q.question_name} <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                </a>
                             </div>
                          </TableCell>
                          <TableCell>
                             <span className="text-xs font-semibold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {q.platform}
                             </span>
                          </TableCell>
                          <TableCell>
                             <BadgeByLevel level={q.level} />
                          </TableCell>
                          <TableCell>
                             <span className="text-xs italic text-muted-foreground capitalize">
                                {q.type?.toLowerCase() || 'Homework'}
                             </span>
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveQuestion(q.id)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                          </TableCell>
                       </TableRow>
                       );
                    })
                 )}
               </TableBody>
            </Table>
         </div>
      </div>

      {/* ASSIGN QUESTIONS MODAL */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-[700px] max-h-[90vh] flex flex-col p-0">
          <div className="p-6 border-b border-border shrink-0">
             <DialogHeader>
               <DialogTitle>Assign Questions</DialogTitle>
               <DialogDescription>Search the Global Question Bank to append assignments to this class block.</DialogDescription>
             </DialogHeader>
             {errorMsg && <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{errorMsg}</div>}
             
             <div className="mt-4 flex gap-3">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                 <Input 
                    placeholder="Search query..." 
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="pl-9 h-9"
                 />
               </div>
               <Select 
                 value={bankLevel} 
                 onChange={(v) => setBankLevel(v as string)}
                 options={[
                   {label: 'All Levels', value: ''},
                   {label: 'Easy', value: 'EASY'},
                   {label: 'Medium', value: 'MEDIUM'},
                   {label: 'Hard', value: 'HARD'},
                 ]}
                 placeholder="Difficulty"
                 className="w-32 h-9 text-sm"
               />
               <Select 
                 value={bankPlatform} 
                 onChange={(v) => setBankPlatform(v as string)}
                 options={[
                   {label: 'All Platforms', value: ''},
                   {label: 'LeetCode', value: 'LEETCODE'},
                   {label: 'GeeksForGeeks', value: 'GFG'},
                   {label: 'Other', value: 'OTHER'},
                 ]}
                 placeholder="Platform"
                 className="w-36 h-9 text-sm"
               />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0 min-h-[300px]">
             <Table>
               <TableBody>
                 {bankLoading ? (
                    <TableRow>
                       <TableCell className="h-48 text-center text-muted-foreground">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Searching bank...
                       </TableCell>
                    </TableRow>
                 ) : bankQuestions.length === 0 ? (
                    <TableRow>
                       <TableCell className="h-48 text-center text-muted-foreground">
                          No questions matched your search criteria.
                       </TableCell>
                    </TableRow>
                 ) : (
                    bankQuestions.map((q) => {
                       const isAssigned = assignedQuestions.some(aq => (aq.question?.id || aq.id) === q.id);
                       const isSelected = selectedQuestionIds.includes(q.id);
                       return (
                       <TableRow key={q.id} className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : ''} ${isAssigned ? 'opacity-50 pointer-events-none' : 'hover:bg-muted/50'}`} onClick={() => !isAssigned && toggleSelection(q.id)}>
                          <TableCell className="w-[40px] pl-6">
                             {isAssigned ? (
                                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                             ) : isSelected ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                             ) : (
                                <Circle className="w-5 h-5 text-muted-foreground/30 border-dashed" />
                             )}
                          </TableCell>
                          <TableCell>
                             <div className="font-medium text-foreground">{q.question_name}</div>
                             <div className="text-xs text-muted-foreground line-clamp-1">{q.question_link}</div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2 justify-end pr-4">
                               <BadgeByLevel level={q.level} />
                               <span className="text-xs uppercase bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded">{q.platform}</span>
                             </div>
                          </TableCell>
                       </TableRow>
                       );
                    })
                 )}
               </TableBody>
             </Table>
          </div>

          <div className="p-4 border-t border-border shrink-0 flex items-center justify-between bg-muted/20">
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setBankPage(p => Math.max(1, p - 1))} disabled={bankPage === 1 || bankLoading}>Prev</Button>
                <span className="text-sm font-medium text-muted-foreground px-2">Page {bankPage} of {bankTotalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setBankPage(p => Math.min(bankTotalPages, p + 1))} disabled={bankPage === bankTotalPages || bankLoading}>Next</Button>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{selectedQuestionIds.length} Selected</span>
                <Button type="button" variant="ghost" onClick={() => setIsAssignOpen(false)} disabled={submitting}>Cancel</Button>
                <Button type="button" onClick={handleAssignSubmit} disabled={submitting || selectedQuestionIds.length === 0}>
                   {submitting ? 'Assigning...' : 'Add Selected'}
                </Button>
             </div>
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
