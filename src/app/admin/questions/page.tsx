"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion
} from '@/services/admin.service';
import { handleToastError } from "@/utils/toast-system";
import QuestionsHeader from '@/components/admin/questions/QuestionsHeader';
import QuestionsFilter from '@/components/admin/questions/QuestionsFilter';
import QuestionsTable from '@/components/admin/questions/QuestionsTable';
import QuestionsModals from '@/components/admin/questions/QuestionsModals';


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
      handleToastError(err);
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
      handleToastError(err);
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

  const openDelete = (question: any) => {
    setSelectedQ(question);
    setIsDeleteOpen(true);
  };


  return (
    <div className="flex flex-col space-y-6">
      <QuestionsHeader totalRecords={totalRecords} />
      
      <QuestionsFilter
        qSearch={qSearch}
        setQSearch={setQSearch}
        qLevel={qLevel}
        setQLevel={setQLevel}
        qPlatform={qPlatform}
        setQPlatform={setQPlatform}
        setIsCreateOpen={setIsCreateOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
        setPage={setPage}
      />

      <QuestionsTable
        questions={questions}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalRecords={totalRecords}
        setPage={setPage}
        setLimit={setLimit}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <QuestionsModals
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        isBulkUploadOpen={isBulkUploadOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
        selectedQ={selectedQ}
        loadQuestions={loadQuestions}
        topicsForBulkUpload={topicsForBulkUpload}
      />
    </div>
  );
}
