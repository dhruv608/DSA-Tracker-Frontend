"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { studentTopicService } from '@/services/student/topic.service';
import { studentProfileService } from '@/services/student/profile.service';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { StatCard } from '@/components/student/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Compass, PenTool, Zap, Target, Flame, Trophy, BookOpen } from 'lucide-react';

export default function StudentHomePage() {
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState({
    solved: 0,
    streak: 0,
    rank: '-',
    topicsActive: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileData = await studentProfileService.getProfile().catch(e => {
          console.error("Failed to fetch profile", e);
          return null;
        });

        const topicsData = profileData ? await studentTopicService.getTopics().catch(e => {
          console.warn("Failed to fetch topics (potentially missing batch)", e);
          return [];
        }) : [];
        
        console.log("Token:", localStorage.getItem('accessToken'));
        console.log("Profile:", profileData);
        console.log("Topics:", topicsData);

        setTopics(topicsData);

        const totalSolved = profileData ? ((profileData.codingStats?.totalSolved || 0)) : 0;
        const activeTopics = topicsData.filter((t: any) => (t.batchSpecificData?.solvedQuestions || 0) > 0).length;

        setStats({
          solved: totalSolved,
          streak: profileData?.streak?.currentStreak || 0,
          rank: profileData?.leaderboard?.globalRank || '-',
          topicsActive: activeTopics
        });
      } catch (e) {
        console.error("Dashboard data fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get top 4 topics for the showcase
  const displayTopics = topics.slice(0, 4);

  return (
    <div className="flex flex-col w-full pb-12">
      
      {/* FULL WIDTH HERO */}
      <section className="relative w-full border-b border-border bg-card/30 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        
        <div className="mx-auto max-w-[1200px] w-full px-6 lg:px-10 py-20 lg:py-28 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[12px] font-bold text-primary tracking-widest uppercase mb-6">
              <Zap className="w-3.5 h-3.5" />
              Your coding portal
            </div>
            
            <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[1.1]">
              BruteForce <br />
              <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">
                Outwork. Outsolve. Outrank.
              </span>
            </h1>
            
            <p className="text-[15px] sm:text-[17px] text-muted-foreground mb-10 max-w-xl leading-relaxed mx-auto md:mx-0">
              Master core concepts, practice intensely, and climb the leaderboards. Everything you need to conquer technical interviews in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-lg shadow-primary/20 w-full sm:w-auto">
                <Link href="/topics">
                  <Compass className="w-[18px] h-[18px] mr-2" />
                  Explore Topics
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-[14px] font-semibold tracking-wide w-full sm:w-auto bg-card border-2 hover:bg-secondary">
                <Link href="/practice">
                  <PenTool className="w-[18px] h-[18px] mr-2" />
                  Practice Now
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-end">
            {/* Abstract Graphic / Stats Board */}
            <div className="relative w-full max-w-[420px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-card to-background rounded-[40px] border border-border shadow-2xl rotate-3 transition-transform hover:rotate-6 duration-700"></div>
              <div className="absolute inset-0 bg-card rounded-[40px] border border-border shadow-xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Live Metrics</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="text-[12px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Total Solved</div>
                      <div className="text-4xl font-black text-foreground font-serif italic">{stats.solved}</div>
                    </div>
                    <div className="h-[1px] w-full bg-border"></div>
                    <div>
                      <div className="text-[12px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Global Rank</div>
                      <div className="text-4xl font-black text-primary font-serif italic">#{stats.rank}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[13px] font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20">
                  <Flame className="w-5 h-5" />
                  <span>{stats.streak} Day Learning Streak</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS BAR (Mobile/Tablet) */}
      <section className="md:hidden mx-auto max-w-[1200px] w-full px-6 lg:px-10 -mt-6 relative z-20 mb-12">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-5 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono mb-1 flex items-center gap-1"><Target className="w-3 h-3"/> Solved</div>
            <div className="text-2xl font-bold font-serif italic">{stats.solved}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono mb-1 flex items-center gap-1"><Trophy className="w-3 h-3"/> Rank</div>
            <div className="text-2xl font-bold font-serif italic text-primary">#{stats.rank}</div>
          </div>
          <div className="col-span-2 bg-emerald-500/10 rounded-xl px-4 py-2 flex items-center justify-between border border-emerald-500/20">
            <div className="text-[12px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Current Streak
            </div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400">{stats.streak} Days</div>
          </div>
        </div>
      </section>

      {/* RECENT TOPICS */}
      <section className="mx-auto max-w-[1200px] w-full px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-8">
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
          <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
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

    </div>
  );
}
