"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { studentTopicService } from '@/services/student/topic.service';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { Button } from '@/components/ui/button';
import { Target, Flame, Trophy } from 'lucide-react';
import { OnboardingModal } from '@/components/student/onboarding/OnboardingModal';
import { HeroSection } from '@/components/student/home/HeroSection';
import { TopicsSection } from '@/components/student/home/TopicsSection';

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
    // Check if we have a student token before making API calls
    if (!isStudentToken()) {
      console.log("No student token found, skipping API calls");
      return;
    }

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
        {/* HERO SECTION */}
        <HeroSection />
        {/* TOPICS SECTION */}
        <TopicsSection topics={topics} />
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