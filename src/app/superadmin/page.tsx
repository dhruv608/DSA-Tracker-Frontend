"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/superadmin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Building2, Layers, Users, TrendingUp, Activity, MapPin, Users2, BarChart3, ArrowUpRight, Sparkles, Globe, Target } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Stats {
  totalCities: number;
  totalBatches: number;
  totalAdmins: number;
}

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

        const [citiesResp, batchesResp] = await Promise.all([
          getAllCities().catch(() => []),
          getAllBatches().catch(() => [])
        ]);

        const batchesArray = Array.isArray(batchesResp) ? batchesResp : [];
        const citiesArray = Array.isArray(citiesResp) ? citiesResp : [];

        const breakdown = citiesArray.map((city: City) => {
          const count = batchesArray.filter((b: Batch) => b.city_id === city.id).length;
          return { name: city.city_name, count };
        }).sort((a, b) => b.count - a.count).slice(0, 5); // top 5

        setCityBreakdown(breakdown);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 bg-card rounded p-6">
            <div className="flex items-center justify-between pb-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded p-6">
            <Skeleton className="h-4 w-24 mb-6" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 hero-gradient min-h-screen p-6">

      <div className="grid gap-6 md:grid-cols-3">
        {/* Cities */}
        <div
          onClick={() => router.push('/superadmin/cities')}
          className="cursor-pointer glass card-premium p-6 rounded-2xl group  transition-all duration-300 border border-border/20  relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-chart-2/5 rounded-full -mr-10 -mt-10  transition-transform duration-500"></div>

          <div className="flex items-center justify-between pb-4 relative">
            <h3 className="text-sm font-medium text-muted-foreground">Total Cities</h3>
            <div className="p-2.5 rounded-xl bg-chart-2/10 border border-chart-2/20 group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-5 text-chart-2 rounded" />
            </div>
          </div>

          <div className="text-4xl font-bold text-foreground group-hover:text-chart-2 transition-colors duration-300 relative">
            {stats?.totalCities || 0}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
            <MapPin className="h-3 w-3" />
            <span>Active locations</span>
          </div>
        </div>

        {/* Batches */}
        <div
          onClick={() => router.push('/superadmin/batches')}
          className="cursor-pointer glass card-premium p-6 rounded-2xl group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-border/20 hover:border-primary/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-chart-3/5 rounded-full -mr-10 -mt-10  transition-transform duration-500"></div>

          <div className="flex items-center justify-between pb-4 relative">
            <h3 className="text-sm font-medium text-muted-foreground">Total Batches</h3>
            <div className="p-2.5 rounded-xl bg-chart-3/10 border border-chart-3/20 group-hover:scale-110 transition-transform">
              <Layers className="h-5 w-5 text-chart-3" />
            </div>
          </div>

          <div className="text-4xl font-bold text-foreground group-hover:text-chart-3 transition-colors duration-300 relative">
            {stats?.totalBatches || 0}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
            <Target className="h-3 w-3" />
            <span>Learning groups</span>
          </div>
        </div>

        {/* Admins */}
        <div
          onClick={() => router.push('/superadmin/admins')}
          className="cursor-pointer glass card-premium p-6 rounded-2xl group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-border/20 hover:border-primary/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-chart-5/5 rounded-full -mr-10 -mt-10  transition-transform duration-500"></div>

          <div className="flex items-center justify-between pb-4 relative">
            <h3 className="text-sm font-medium text-muted-foreground">Total Admins</h3>
            <div className="p-2.5 rounded-xl bg-chart-5/10 border border-chart-5/20 group-hover:scale-110 transition-transform">
              <Users2 className="h-5 w-5 text-chart-5" />
            </div>
          </div>

          <div className="text-4xl font-bold text-foreground group-hover:text-chart-5 transition-colors duration-300 relative">
            {stats?.totalAdmins || 0}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
            <Activity className="h-3 w-3" />
            <span>Team members</span>
          </div>
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* City Breakdown Panel */}
      <div className="md:col-span-2 glass rounded-2xl p-6 border border-border/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="text-primary" />
            City Breakdown
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityBreakdown}>
                <CartesianGrid strokeDasharray="3 6" vertical={false} />

                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="count" radius={[10, 10, 5, 5]}>
                  {cityBreakdown.map((_, i) => (
                    <Cell key={i} fill="hsl(var(--chart-3))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass h-[423px] card-premium rounded-2xl p-6 border border-border/20 ">

          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
            <Sparkles className="h-5 w-5 text-chart-1" />
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/superadmin/admins')}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-5/10 to-transparent border border-chart-5/20 hover:border-chart-5/40 px-4 py-3 text-left transition-all duration-300 hover:shadow-lg hover:shadow-chart-5/10"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-chart-5/10 group-hover:scale-110 transition-transform">
                    <Users2 className="h-4 w-4 text-chart-5" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-chart-5 transition-colors">
                    Add Admin
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-chart-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chart-5/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => router.push('/superadmin/cities')}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-2/10 to-transparent border border-chart-2/20 hover:border-chart-2/40 px-4 py-3 text-left transition-all duration-300 hover:shadow-lg hover:shadow-chart-2/10"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-chart-2/10 group-hover:scale-110 transition-transform">
                    <Globe className="h-4 w-4 text-chart-2" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-chart-2 transition-colors">
                    Add City
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-chart-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chart-2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => router.push('/superadmin/batches')}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-3/10 to-transparent border border-chart-3/20 hover:border-chart-3/40 px-4 py-3 text-left transition-all duration-300 hover:shadow-lg hover:shadow-chart-3/10"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-chart-3/10 group-hover:scale-110 transition-transform">
                    <Layers className="h-4 w-4 text-chart-3" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-chart-3 transition-colors">
                    Add Batch
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-chart-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chart-3/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}