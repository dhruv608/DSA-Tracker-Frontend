"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentTopicService } from '@/services/student/topic.service';
import { ClassCard } from '@/components/student/classes/ClassCard';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';
import { SubtopicBackNav } from '@/components/student/subtopics/SubtopicBackNav';
import { SubtopicHeader } from '@/components/student/subtopics/SubtopicHeader';
import { SubtopicClasses } from '@/components/student/subtopics/SubtopicClasses';
import { SubtopicLoading } from '@/components/student/subtopics/SubtopicLoading';

export default function TopicDetailsPage() {
  const { topicSlug } = useParams() as { topicSlug: string };
  const router = useRouter();

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const data = await studentTopicService.getTopicOverview(topicSlug);
        setTopic(data);
      } catch (e) {
        console.error("Topic fetch error", e);
        router.push('/topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicSlug, router]);

  if (loading) {
    return <SubtopicLoading />;
  }

  if (!topic) return null;

  const progress = (topic.overallProgress?.totalQuestions || 0) === 0
    ? 0
    : (topic.overallProgress.solvedQuestions / topic.overallProgress.totalQuestions) * 100;

return (
  <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
    <SubtopicBackNav />
    <SubtopicHeader topic={topic} progress={progress} />
    <SubtopicClasses topic={topic} />
  </div>
);
}
