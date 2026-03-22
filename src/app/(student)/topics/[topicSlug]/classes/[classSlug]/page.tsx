"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { studentClassService } from '@/services/student/class.service';
import { QuestionRow } from '@/components/student/questions/QuestionRow';
import { ProgressBar } from '@/components/student/shared/ProgressBar';
import Link from 'next/link';
import { Badge } from '@/components/student/shared/Badge';
import { Calendar, Clock, FileText } from 'lucide-react';

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
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
      
      {/* Back nav */}
      <Link 
        href={`/topics/${topicSlug}`}
        className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mb-6 w-fit"
      >
        <span>←</span> Back to {classData.topic?.topic_name || "Topic"}
      </Link>

      {/* Header Info */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-2.5 py-1">
            CLASS DETAILS
          </Badge>
          {formattedDate && <span className="text-[13px] text-muted-foreground font-mono flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formattedDate}</span>}
          {classData.duration_minutes && <span className="text-[13px] text-muted-foreground font-mono flex items-center gap-1.5"><Clock className="w-4 h-4" /> {classData.duration_minutes} min</span>}
        </div>
        
        <h1 className="font-serif italic text-3xl sm:text-[38px] font-bold text-foreground mb-4">
          {classData.class_name}
        </h1>
        
        {classData.description && (
          <p className="text-[14.5px] text-muted-foreground mb-6 max-w-3xl leading-relaxed">
            {classData.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-6 pt-6 border-t border-border">
          <div className="sm:w-[280px]">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1.5 uppercase tracking-widest">
              <span>Class Progress</span>
              <span className={solvedQuestions === totalQuestions && totalQuestions > 0 ? "text-emerald-500" : ""}>
                {solvedQuestions} / {totalQuestions}
              </span>
            </div>
            <ProgressBar progress={progress} showLabel />
          </div>

          {classData.pdf_url && (
            <div className="sm:ml-auto">
              <a 
                href={classData.pdf_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border-2 border-primary/30 text-primary rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/50 transition-all text-[13.5px]"
              >
                <FileText className="w-4 h-4" /> Open Class Notes
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div>
        <h2 className="text-[14px] font-mono font-medium text-muted-foreground tracking-widest uppercase mb-6 flex items-center gap-3 after:flex-1 after:h-[1px] after:bg-border">
          Assigned Questions
        </h2>
        
        <div className="flex flex-col gap-3">
          {questions.length > 0 ? (
            questions.map((q: any, idx: number) => (
              <div 
                key={q.id}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
              >
                <QuestionRow 
                  questionName={q.questionName || 'Unknown Question'}
                  platform={q.platform || 'Unknown'}
                  level={q.level || 'EASY'}
                  type={q.type || 'CLASSWORK'}
                  isSolved={q.isSolved || false}
                  link={q.questionLink || ''}
                />
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
              No questions assigned to this class yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
