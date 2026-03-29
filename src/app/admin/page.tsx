"use client";

// 🌟 Code by Ayush Chaurasiya — Eat 💻 Sleep 😴 Code ⚡ Repeat 💪

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
} from "lucide-react";
import DifficultyChart from "@/components/admin/charts/DifficultyChart";
import PlatformChart from "@/components/admin/charts/PlatformChart";
import TypeChart from "@/components/admin/charts/Type";
import { handleToastError } from "@/utils/toast-system";

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

  if (isLoadingContext) return <Skeleton />;

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {selectedBatch.name} Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
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
    <div className="glass card-premium hover-glow rounded-2xl p-6 flex items-center gap-4">

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
    <div className="glass card-premium hover-glow rounded-2xl overflow-hidden">

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

function PlatformGrid({ data }: any) {
  if (!data) return null;

  const items = [
    { label: "LeetCode", value: data.leetcode },
    { label: "GFG", value: data.gfg },
    { label: "Interview", value: data.interviewbit },
    { label: "Other", value: data.other },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="glass rounded-xl p-4 text-center hover-glow"
        >
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-xs text-muted-foreground mt-1 uppercase">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-1/4 bg-muted rounded" />

      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 rounded-2xl bg-muted" />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
