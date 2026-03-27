"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { BookOpen } from 'lucide-react';

interface TopicsSectionProps {
  topics: any[];
}

export function TopicsSection({ topics }: TopicsSectionProps) {
  const displayTopics = topics.slice(0, 8);

  return (
    <section className="mx-auto max-w-[1200px] w-full px-6 lg:px-10 py-16">
      {/* Section with subtle gradient background */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[18px] sm:text-2xl font-bold text-foreground mb-1.5 font-serif italic">
              Your Learning Path
            </h2>
            <p className="text-[13px] text-muted-foreground">Jump back into your assigned topics</p>
          </div>
          <Link
            href="/topics"
            className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors hidden sm:flex items-center gap-1"
          >
            View all <span>→</span>
          </Link>
        </div>
      </div>

      {displayTopics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayTopics.map((topic: any, idx) => (
            <div key={topic.slug} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
              <TopicCard
                topicSlug={topic.slug}
                topicName={topic.topic_name}
                photoUrl={topic.photo_url}
                totalQuestions={topic.batchSpecificData?.totalQuestions || 0}
                solvedQuestions={topic.batchSpecificData?.solvedQuestions || 0}
                totalClasses={topic.batchSpecificData?.totalClasses || 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass hover-glow border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 font-serif italic">No topics assigned yet</h3>
          <p className="text-[14px] text-muted-foreground max-w-sm mb-6">
            When you join a batch and topics are assigned, they will appear right here.
          </p>
          <Button asChild variant="outline">
            <Link href="/practice">Go to Practice Area</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="ghost" className="w-full text-primary">
          <Link href="/topics">View all topics →</Link>
        </Button>
      </div>
    </section>
  );
}
