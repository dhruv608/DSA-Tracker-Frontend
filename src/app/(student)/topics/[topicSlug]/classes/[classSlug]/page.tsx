"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentClassService } from '@/services/student/class.service';
import { QuestionRow } from '@/components/student/questions/QuestionRow';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';
import { Badge } from '@/components/student/shared/Badge';
import { Calendar, Clock, FileText } from 'lucide-react';
import { ClassBackNav } from '@/components/student/classes/ClassBackNav';
import { ClassHeader } from '@/components/student/classes/ClassHeader';
import { ClassQuestions } from '@/components/student/classes/ClassQuestions';
import { ClassLoading } from '@/components/student/classes/ClassLoading';

export default function ClassDetailsPage() {
  const { topicSlug, classSlug } = useParams() as { topicSlug: string; classSlug: string };
  const router = useRouter();

  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const data = await studentClassService.getClassDetails(topicSlug, classSlug);
        setClassData(data);
      } catch (e) {
        console.error("Class detail fetch error", e);
        router.push(`/topics/${topicSlug}`);
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [topicSlug, classSlug, router]);

  if (loading) {
    return <ClassLoading />;
  }

  if (!classData) return null;

  const questions = classData.questions || [];
  const totalQuestions = classData.totalQuestions || 0;
  const solvedQuestions = classData.solvedQuestions || 0;
  const progress = totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  const formattedDate = classData.class_date
    ? new Date(classData.class_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      <ClassBackNav
        topicSlug={topicSlug}
        topicName={classData.topic?.topic_name}
      />

      <ClassHeader
        classData={classData}
        progress={progress}
        solvedQuestions={solvedQuestions}
        totalQuestions={totalQuestions}
        formattedDate={formattedDate}
      />

      <ClassQuestions questions={questions} />
    </div>
  );
}
