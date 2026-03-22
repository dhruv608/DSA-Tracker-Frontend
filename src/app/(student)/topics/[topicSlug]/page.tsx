"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentTopicService } from '@/services/student/topic.service';
import { ClassCard } from '@/components/student/classes/ClassCard';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';

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
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) return null;

  const progress = (topic.overallProgress?.totalQuestions || 0) === 0 
    ? 0 
    : (topic.overallProgress.solvedQuestions / topic.overallProgress.totalQuestions) * 100;

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      
      {/* Back nav */}
      <Link 
        href="/topics"
        className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mb-6 w-fit"
      >
        <span>←</span> Back to Topics
      </Link>

      {/* Header Card */}
      <div className="bg-card border border-border/80 rounded-[24px] overflow-hidden shadow-sm mb-10 flex flex-col md:flex-row relative">
        <div className="md:w-1/3 h-[180px] md:h-auto relative bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={topic.photo_url || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=75"} 
            alt={topic.topic_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
        </div>
        
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
          <h1 className="font-serif italic text-3xl font-bold text-foreground mb-3">
            {topic.topic_name}
          </h1>
          {topic.description && (
            <p className="text-[14px] text-muted-foreground mb-6 max-w-2xl leading-relaxed">
              {topic.description}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Classes</div>
                <div className="font-semibold text-lg">{topic.classes?.length || 0}</div>
              </div>
              <div className="w-[1px] h-8 bg-border" />
              <div className="text-center">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Questions</div>
                <div className="font-semibold text-lg">{topic.overallProgress?.totalQuestions || 0}</div>
              </div>
            </div>

            <div className="flex-1 sm:ml-auto w-full sm:max-w-[200px]">
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span>{topic.overallProgress?.solvedQuestions || 0} / {topic.overallProgress?.totalQuestions || 0}</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div>
        <h2 className="text-[14px] font-mono font-medium text-muted-foreground tracking-widest uppercase mb-5">
          Classes
        </h2>
        <div className="flex flex-col gap-3">
          {topic.classes?.length > 0 ? (
            topic.classes.map((cls: any, idx: number) => (
              <div 
                key={cls.slug} 
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
              >
                <ClassCard 
                  topicSlug={topic.slug}
                  classSlug={cls.slug}
                  index={idx}
                  classNameTitle={cls.class_name}
                  duration={cls.duration_minutes}
                  date={cls.class_date}
                  totalQuestions={cls.totalQuestions || 0}
                  solvedQuestions={cls.solvedQuestions || 0}
                  pdfUrl={cls.pdf_url}
                />
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
              No classes assigned to this topic yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
