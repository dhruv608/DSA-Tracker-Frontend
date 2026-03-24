"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { studentTopicService } from '@/services/student/topic.service';
import { studentAuthService } from '@/services/student/auth.service';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { Button } from '@/components/ui/button';
import { Compass, PenTool, Zap, Target, Flame, Trophy, BookOpen } from 'lucide-react';
import { OnboardingModal } from '@/components/student/onboarding/OnboardingModal';

interface User {
  username?: string;
  leetcode?: string;
  gfg?: string;
  // Add other user properties based on your API response
  codingStats?: {
    totalSolved?: number;
  };
  leaderboard?: {
    globalRank?: string;
  };
  // Add any other properties your user object has
}

interface StudentDataResponse {
  success: boolean;
  data: User;
}

export default function StudentHomePage() {
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [studentResponse, setStudentResponse] = useState<StudentDataResponse | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [stats, setStats] = useState({
    solved: 0,
    rank: '-',
    topicsActive: 0
  });
  const [loading, setLoading] = useState(true);


  const refreshUserData = async () => {
    try {
      // Use lightweight /me endpoint for basic student info
      console.log("Calling getCurrentStudent...");
      const studentData = await studentAuthService.getCurrentStudent().catch((e: any) => {
        console.error("Failed to fetch student data", e);
        console.error("Error details:", e.response?.data, e.response?.status);
        return null;
      });

      console.log("Student data from /me:", studentData);

      const topicsData = await studentTopicService.getTopics().catch((e: any) => {
        console.warn("Failed to fetch topics (potentially missing batch)", e);
        return [];
      });

      setStudentResponse(studentData);
      setUser(studentData?.data);
      setTopics(topicsData);

      // Check onboarding requirements from clean /me data
      const username = studentData?.data?.username;
      const leetcode = studentData?.data?.leetcode;
      const gfg = studentData?.data?.gfg;

      console.log("Checking onboarding requirements:", {
        username,
        leetcode,
        gfg,
        studentData
      });

      if (studentData?.data && (!username || !leetcode || !gfg)) {
        console.log("Showing onboarding modal - missing required fields");
        setShowOnboarding(true);
      } else {
        console.log("Hiding onboarding modal - all required fields present");
        setShowOnboarding(false);
      }

      // For now, set basic stats - can be enhanced later if needed
      const activeTopics = topicsData.filter((t: any) => (t.batchSpecificData?.solvedQuestions || 0) > 0).length;

      setStats({
        solved: 0, // Will be updated if we add stats to /me endpoint
        rank: '-',
        topicsActive: activeTopics
      });
    } catch (e) {
      console.error("Error refreshing user data", e);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        await refreshUserData();
      } catch (e) {
        console.error("Dashboard data fetch error", e);
        // Handle auth error
        if ((e as any).response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Listen to profile updates (e.g., from onboarding) to refresh dashboard stats dynamically
    window.addEventListener('profileUpdated', refreshUserData);
    return () => window.removeEventListener('profileUpdated', refreshUserData);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get top 4 topics for the showcase
  const displayTopics = topics.slice(0, 8);

  return (
    <>
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

      {/* Onboarding Modal - Only shows if required fields are missing */}
      <OnboardingModal
        isOpen={showOnboarding}
        user={user}
        onClose={() => setShowOnboarding(false)}
      />
    </> 
  ); 
}