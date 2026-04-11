"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { apiClient } from '@/api';
import {
   removeQuestionFromClass
} from '@/services/admin.service';
import AssignQuestionsModal from '@/components/admin/topics/classSlug/AssignQuestionsModal';
import EditQuestionTypeModal from '@/components/admin/topics/classSlug/EditQuestionTypeModal';
import ClassDetailHeader from '@/components/admin/topics/classSlug/ClassDetailHeader';
import ClassDetailFilter from '@/components/admin/topics/classSlug/ClassDetailFilter';
import ClassDetailTable from '@/components/admin/topics/classSlug/ClassDetailTable';
import ClassDetailShimmer from '@/components/admin/topics/classSlug/ClassDetailShimmer';
import {
   BookOpen,
} from 'lucide-react';
import { Pagination } from '@/components/Pagination';
import { DeleteModal } from '@/components/DeleteModal';
import { ClassAssignedQuestion, ApiError } from '@/types/admin/index.types';


export default function AdminClassDetailsPage() {
   const params = useParams();
   const router = useRouter();
   const topicSlug = decodeURIComponent(params.topicSlug as string);
   const classSlug = decodeURIComponent(params.classSlug as string);

   const { selectedBatch, isLoadingContext } = useAdminStore();

   // Assigned Questions Data
   const [assignedQuestions, setAssignedQuestions] = useState<ClassAssignedQuestion[]>([]);
   const [loading, setLoading] = useState(false);
   const [search, setSearch] = useState('');
   const [assignedPage, setAssignedPage] = useState(1);
   const [assignedTotalPages, setAssignedTotalPages] = useState(1);
   const [assignedTotalCount, setAssignedTotalCount] = useState(0);
   const [limit, setLimit] = useState(10);

   // Assign Modal States
   const [isAssignOpen, setIsAssignOpen] = useState(false);

   // Edit Type Modal States
   const [isEditTypeOpen, setIsEditTypeOpen] = useState(false);
   const [editingQuestion, setEditingQuestion] = useState<ClassAssignedQuestion | null>(null);

   // Delete Modal States
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [deletingQuestion, setDeletingQuestion] = useState<ClassAssignedQuestion | null>(null);
   const [submitting, setSubmitting] = useState(false);
   
   // Refs for preventing double API calls
   const isFetchingAssigned = useRef(false);
   const lastFetchAssignedParams = useRef<{ topicSlug?: string; classSlug?: string; page: number; limit: number; search: string }>({
      page: 1,
      limit: 10,
      search: ''
   });
   

   const fetchAssigned = async (page: number = 1, searchQuery: string = search) => {
      if (!selectedBatch) return;

      // Skip if already fetching
      if (isFetchingAssigned.current) {
         console.log("Already fetching assigned questions, skipping duplicate call");
         return;
      }

      // Check if same params were already used
      const currentParams = { topicSlug, classSlug, page, limit, search: searchQuery };
      const sameParams = 
         lastFetchAssignedParams.current.topicSlug === topicSlug &&
         lastFetchAssignedParams.current.classSlug === classSlug &&
         lastFetchAssignedParams.current.page === page &&
         lastFetchAssignedParams.current.limit === limit &&
         lastFetchAssignedParams.current.search === searchQuery;

      if (sameParams) {
         console.log("Same assigned questions params already fetched, skipping");
         return;
      }

      isFetchingAssigned.current = true;
      lastFetchAssignedParams.current = currentParams;
      setLoading(true);
      try {
         const params: { page: number; limit: number; search?: string } = { page, limit };
         if (searchQuery) params.search = searchQuery;

         const response = await apiClient.get(`/api/admin/${selectedBatch.slug}/topics/${topicSlug}/classes/${classSlug}/questions`, { params });
         const data = response.data;
         // Backend returns { message: "...", data: [...], pagination: {...} }
         setAssignedQuestions(data.data || []);
         setAssignedTotalPages(data.pagination?.totalPages || 1);
         setAssignedTotalCount(data.pagination?.total || 0);
      } catch (err: unknown) {
         // Error is handled by API client interceptor
         console.error("Failed to fetch assigned questions", err);
         // If current deeply tracked class does not exist in active batch context, redirect out safely.
         const error = err as ApiError;
         if (error.response?.status === 400 || error.response?.status === 404) {
            router.push('/admin/topics');
         }
      } finally {
         setLoading(false);
         isFetchingAssigned.current = false;
      }
   };


   useEffect(() => {
      fetchAssigned(assignedPage, search);
   }, [selectedBatch, topicSlug, classSlug, assignedPage, search, limit]);


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
         lastFetchAssignedParams.current = { page: 0, limit: 0, search: '', topicSlug: '', classSlug: '' }; // Reset to force refetch
         fetchAssigned();
         setIsDeleteOpen(false);
         setDeletingQuestion(null);
      } catch (err: unknown) {
         // Error is handled by API client interceptor
         const error = err as ApiError;
         alert(error.response?.data?.error || "Failed to remove question");
      } finally {
         setSubmitting(false);
      }
   };

   const handleOpenEditType = (question: any) => {
      setEditingQuestion(question);
      setIsEditTypeOpen(true);
   };


   if (isLoadingContext) {
      return <ClassDetailShimmer />;
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
      <div className="flex flex-col mx-auto  w-full pb-12  -mt-4  ">

         <ClassDetailHeader
            selectedBatch={selectedBatch}
            topicSlug={topicSlug}
            classSlug={classSlug}
            onAssignClick={() => setIsAssignOpen(true)}
         />

         <ClassDetailFilter
            search={search}
            onSearchChange={(value) => { setSearch(value); setAssignedPage(1); }}
            assignedTotalCount={assignedTotalCount}
         />

         <ClassDetailTable
            assignedQuestions={assignedQuestions}
            loading={loading}
            onEditType={handleOpenEditType}
            onRemoveQuestion={handleRemoveQuestion}
         />

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

         <AssignQuestionsModal
         isOpen={isAssignOpen}
         onClose={() => setIsAssignOpen(false)}
         onSuccess={() => {
            lastFetchAssignedParams.current = { page: 0, limit: 0, search: '', topicSlug: '', classSlug: '' }; // Reset to force refetch
            fetchAssigned();
         }}
         batchSlug={selectedBatch!.slug}
         topicSlug={topicSlug}
         classSlug={classSlug}
         assignedQuestions={assignedQuestions}
      />

         <EditQuestionTypeModal
         isOpen={isEditTypeOpen}
         onClose={() => setIsEditTypeOpen(false)}
         onSuccess={() => {
            lastFetchAssignedParams.current = { page: 0, limit: 0, search: '', topicSlug: '', classSlug: '' }; // Reset to force refetch
            fetchAssigned();
         }}
         batchSlug={selectedBatch!.slug}
         topicSlug={topicSlug}
         classSlug={classSlug}
         question={editingQuestion}
      />

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
            itemName={deletingQuestion?.question?.question_name || 'this question'}
            warningText="This will detach the question from this class. Students will no longer see this question in their class assignments."
         />
      </div>
   );
}

