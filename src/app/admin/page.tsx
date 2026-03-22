"use client";

import React, { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { getAdminStats } from '@/services/admin.service';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  BarChart3, 
  Target, 
  Globe 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { selectedBatch, isLoadingContext } = useAdminStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      if (!selectedBatch) {
        setStats(null);
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const data = await getAdminStats(selectedBatch.id);
        if (isMounted) {
          setStats(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to fetch batch statistics');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    
    return () => {
      isMounted = false;
    };
  }, [selectedBatch]);

  if (isLoadingContext) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground">No Batch Selected</h2>
        <p className="text-muted-foreground max-w-sm">
          Please select a city and batch from the top right dropdown menus to view statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {selectedBatch.name} Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Overview and statistics for the selected batch.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 h-64"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-center">
          {error}
        </div>
      ) : stats ? (
        <>
          {/* Top Level KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Students" 
              value={stats.total_students} 
              icon={<Users className="w-5 h-5" />} 
            />
            <StatCard 
              title="Topics Discussed" 
              value={stats.total_topics_discussed} 
              icon={<BookOpen className="w-5 h-5" />} 
            />
            <StatCard 
              title="Total Classes" 
              value={stats.total_classes} 
              icon={<Layers className="w-5 h-5" />} 
            />
            <StatCard 
              title="Total Questions" 
              value={stats.total_questions} 
              icon={<HelpCircle className="w-5 h-5" />} 
            />
          </div>

          {/* Breakdown Charts/KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* By Level */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex flex-row items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">By Difficulty</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                <BreakdownRow label="Easy" value={stats.questions_by_level.easy} total={stats.total_questions} color="bg-green-500" />
                <BreakdownRow label="Medium" value={stats.questions_by_level.medium} total={stats.total_questions} color="bg-yellow-500" />
                <BreakdownRow label="Hard" value={stats.questions_by_level.hard} total={stats.total_questions} color="bg-red-500" />
              </div>
            </div>

            {/* By Type */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex flex-row items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">By Type</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                <BreakdownRow label="Classwork" value={stats.questions_by_type.classwork} total={stats.total_questions} color="bg-primary" />
                <BreakdownRow label="Homework" value={stats.questions_by_type.homework} total={stats.total_questions} color="bg-accent-foreground" />
              </div>
            </div>

            {/* By Platform */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex flex-row items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">By Platform</h3>
              </div>
              <div className="p-6 flex-1 grid grid-cols-2 gap-4 place-items-center text-center">
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight">{stats.questions_by_platform.leetcode}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">LeetCode</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight">{stats.questions_by_platform.gfg}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">GeeksForGeeks</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight">{stats.questions_by_platform.interviewbit}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Interviews</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight">{stats.questions_by_platform.other}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Other</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold text-foreground mt-1">{value}</h3>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5 hover:opacity-80 transition-opacity">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="text-right">
          <span className="text-sm border border-border px-2 py-0.5 rounded-md font-bold mr-2">{value}</span>
          <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
        <div className={`${color} h-2 rounded-full transition-all duration-1000 ease-out relative`} style={{ width: `${percentage}%` }}>
          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
