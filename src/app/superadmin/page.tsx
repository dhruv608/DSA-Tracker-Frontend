"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/superadmin.service';
import { Map, Target, LayoutGrid, UserCog, Activity, MapPin } from 'lucide-react';
import { DashboardShimmer } from '@/components/superadmin/DashboardShimmer';
import { Stats } from '@/types/superadmin/index.types';
import { DashboardHeader } from '@/components/superadmin/dashboard/DashboardHeader';
import { StatCard } from '@/components/superadmin/dashboard/StatCard';
import { CityBreakdownChart } from '@/components/superadmin/dashboard/CityBreakdownChart';
import { QuickActionsPanel } from '@/components/superadmin/dashboard/QuickActionsPanel';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [cityBreakdown, setCityBreakdown] = useState<{ name: string, count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getStats();

        setStats({
          totalCities: statsData?.totalCities || 0,
          totalBatches: statsData?.totalBatches || 0,
          totalAdmins: statsData?.totalAdmins || 0,
        });

        setCityBreakdown(statsData?.cityBreakdown || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <DashboardShimmer />;
  }

  return (
    <div className="space-y-8 pb-10  min-h-screen p-6">
      <DashboardHeader />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Cities"
          value={stats?.totalCities || 0}
          icon={Map}
          subtitle="Active locations"
          onClick={() => router.push('/superadmin/cities')}
          ringColor="focus:ring-chart-2/40"
          chartColor="chart-2"
        />
        <StatCard
          title="Batches"
          value={stats?.totalBatches || 0}
          icon={LayoutGrid}
          subtitle="Learning groups"
          onClick={() => router.push('/superadmin/batches')}
          ringColor="focus:ring-chart-3/40"
          chartColor="chart-3"
        />
        <StatCard
          title="Admins"
          value={stats?.totalAdmins || 0}
          icon={UserCog}
          subtitle="Team members"
          onClick={() => router.push('/superadmin/admins')}
          ringColor="focus:ring-chart-5/40"
          chartColor="chart-5"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        <CityBreakdownChart cityBreakdown={cityBreakdown} />
        <QuickActionsPanel />
      </div>
    </div>
  );
}
