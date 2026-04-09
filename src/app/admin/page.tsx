"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { getAdminStats } from "@/services/admin.service";
import {
  Users,
  BookOpen,
  HelpCircle,
  Layers,
  BarChart3,
  Target,
  Globe,
  TrendingUp,
  Calendar,
  Clock
} from "lucide-react";
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import DifficultyChart from "@/components/admin/charts/DifficultyChart";
import PlatformChart from "@/components/admin/charts/PlatformChart";
import TypeChart from "@/components/admin/charts/Type";
import { handleToastError } from "@/utils/toast-system";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { selectedBatch, isLoadingContext } = useAdminStore();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      if (!selectedBatch) return;

      setLoading(true);
      try {
        const data = await getAdminStats(selectedBatch.id);
        if (isMounted) setStats(data);
      } catch (err: any) {
        handleToastError(err);
        if (isMounted)
          setError(err?.response?.data?.message || "Failed to fetch stats");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [selectedBatch]);

  if (isLoadingContext || loading) {
    return <AdminDashboardSkeleton />;
  }

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Layers className="w-10 h-10 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No Batch Selected</h2>
        <p className="text-muted-foreground">
          Select batch from top to view stats
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
    
      {/* HEADER */}
      <div className="flex items-center justify-between glass  mb-5 p-5 -mt-3 backdrop-blur-2xl rounded-2xl ">
        <div>
          <h2 className="text-3xl font-bold">
            {selectedBatch.name} <span className="text-primary" >Dashboard</span>
          </h2>
          <p className="text-muted-foreground mt-1 p-0 m-0">
            Premium analytics overview
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Students" value={stats?.total_students} icon={<Users />} />
        <StatCard title="Topics" value={stats?.total_topics_discussed} icon={<BookOpen />} />
        <StatCard title="Classes" value={stats?.total_classes} icon={<Layers />} />
        <StatCard title="Questions" value={stats?.total_questions} icon={<HelpCircle />} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* DIFFICULTY */}
        <Card title="Difficulty" icon={<BarChart3 />}>
          <DifficultyChart data={stats?.questions_by_level} />
        </Card>

        {/* TYPE */}
        <Card title="Type" icon={<Target />}>
          <TypeChart data={stats?.questions_by_type} />
        </Card>

        {/* PLATFORM */}
        <Card title="Platform" icon={<Globe />}>
          <PlatformChart data={stats?.questions_by_platform} />
        </Card>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon }: any) {
  return (
    <div className="glass  hover-glow rounded-2xl p-6 flex items-center gap-4">

      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>

    </div>
  );
}

function Card({ title, icon, children }: any) {
  return (
    <div className="glass  hover-glow rounded-2xl overflow-hidden">

      <div className="px-6 py-4 flex items-center gap-3 border-b border-border/40">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="p-6 space-y-5">
        {children}
      </div>

    </div>
  );
}

function BreakdownRow({ label, value, total, color }: any) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value} • {percentage}%
        </span>
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`${color} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="glass backdrop-blur-2xl mb-5 p-5 -mt-3 rounded-2xl space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-3 border-b border-border/40">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformGrid({ data }: any) {
  if (!data) return null;

  const items = [
    { label: "LeetCode", value: data.leetcode, icon: <LeetCodeIcon className="w-4 h-4 text-leetcode" /> },
    { label: "GFG", value: data.gfg, icon: <GeeksforGeeksIcon className="w-4 h-4 text-gfg" /> },
    { label: "Interview", value: data.interviewbit, icon: <div className="w-4 h-4 bg-[#3B82F6] rounded" /> },
    { label: "Other", value: data.other, icon: <div className="w-4 h-4 bg-muted rounded" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="glass rounded-xl p-4 text-center hover-glow"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {item.icon}
            <div className="text-2xl font-bold">{item.value}</div>
          </div>
          <div className="text-xs text-muted-foreground uppercase">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}


