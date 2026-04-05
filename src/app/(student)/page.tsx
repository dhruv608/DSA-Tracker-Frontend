"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentTopicService } from '@/services/student/topic.service';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { Button } from '@/components/ui/button';
import { Target, Flame, Trophy } from 'lucide-react';
import { HeroSection } from '@/components/student/home/HeroSection';
import { TopicsSection } from '@/components/student/home/TopicsSection';
import { TopicsSectionShimmer } from '@/components/student/home/TopicsSectionShimmer';
import { handleToastError } from "@/utils/toast-system";


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
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [studentResponse, setStudentResponse] = useState<StudentDataResponse | null>(null);
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

      const topicsData = await studentTopicService.getTopics({ limit: 8 }).catch((e: any) => {
        console.warn("Failed to fetch topics (potentially missing batch)", e);
        return { topics: [] };
      });

      setStudentResponse(studentData);
      setUser(studentData?.data);
      setTopics(topicsData.topics || []);

      // For now, set basic stats - can be enhanced later if needed
      const activeTopics = (topicsData.topics || []).filter((t: any) => (t.batchSpecificData?.solvedQuestions || 0) > 0).length;

      setStats({
        solved: 0, // Will be updated if we add stats to /me endpoint
        rank: '-',
        topicsActive: activeTopics
      });
    } catch (e) {
      handleToastError(e);
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
        handleToastError(e);
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

  // Get top 4 topics for the showcase
  const displayTopics = topics.slice(0, 8);

  return (
   
      <div className="flex flex-col w-full pb-12">
        {/* HERO SECTION - Always render immediately */}
        <HeroSection />

        {/* TOPICS SECTION - Always render header, show shimmer only for topic cards */}
        <TopicsSection topics={topics} loading={loading} />
      </div>
    
  );
}
