"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Admin } from '@/types/common/api.types';
import { getAdminStats } from "@/services/admin.service";
import Header from "@/components/admin/dashboard/Header";
import Stats from "@/components/admin/dashboard/Stats";
import Graph from "@/components/admin/dashboard/Graph";
import QuickAction from "@/components/admin/dashboard/QuickAction";
import DashboardShimmer from "@/components/admin/dashboard/Shimmer";
import { AdminStats, ApiError } from '@/types/admin/index.types';

export default function AdminDashboardPage() {
  const { selectedBatch, isLoadingContext } = useAdminStore();

  const [stats, setStats] = useState<AdminStats | null>(null);
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
      } catch (err: unknown) {
        // Error is handled by API client interceptor
        if (isMounted) {
          const error = err as ApiError;
          setError(error.response?.data?.message || "Failed to fetch stats");
        }
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
    return <DashboardShimmer />;
  }

  if (!selectedBatch) {
    return <QuickAction />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Header selectedBatch={selectedBatch} />
      <Stats stats={stats} />
      <Graph stats={stats} />
    </div>
  );
}


