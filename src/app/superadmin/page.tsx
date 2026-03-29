"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/superadmin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Layers, Activity, MapPin, Users2,  ArrowUpRight, Sparkles, Globe, Target } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart,Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { handleToastError } from "@/utils/toast-system";

import { motion } from "framer-motion";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        minWidth: "130px",
      }}
    >
      <p
        style={{
          color: "var(--muted-foreground)",
          fontSize: "12px",
          marginBottom: "4px",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: "var(--foreground)",
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.2,
          display: "flex",
          alignItems: "baseline",
          gap: "5px",
        }}
      >
        {payload[0].value}
        <span
          style={{
            fontSize: "12px",
            fontWeight: 400,
            color: "var(--muted-foreground)",
          }}
        >
          batches
        </span>
      </p>
    </div>
  );
};
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
        handleToastError(err);
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
    <div className="space-y-8 pb-10  min-h-screen p-6">

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="md:col-span-2 glass card-premium rounded-2xl p-6 border border-border/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-[15px] font-medium text-foreground flex items-center gap-2.5">
              {/* Wave / area icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="text-chart-3"
              >
                <path
                  d="M1 13 C3 13, 4 7, 6.5 7 C9 7, 9.5 11, 12 11 C14.5 11, 15 5, 17 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M1 13 C3 13, 4 7, 6.5 7 C9 7, 9.5 11, 12 11 C14.5 11, 15 5, 17 5 L17 17 L1 17Z"
                  fill="currentColor"
                  opacity="0.12"
                />
              </svg>
              City breakdown
            </h3>
            <span className="text-xs text-muted-foreground/50 tracking-wide">
              Top {cityBreakdown.length} by batches
            </span>
          </div>

          {/* Chart */}
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cityBreakdown}
                margin={{ top: 20, right: 4, left: -4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.25} />
                    <stop offset="60%" stopColor="#60A5FA" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(100,116,139,0.5)",
                    fontSize: 11,
                  }}
                  tickCount={5}
                  width={28}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "rgba(96,165,250,0.2)",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#60A5FA"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  dot={{
                    r: 4,
                    fill: "#60A5FA",
                    strokeWidth: 2,
                    stroke: "var(--card)",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#60A5FA",
                    strokeWidth: 2,
                    stroke: "var(--card)",
                  }}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Footer legend */}
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <span className="inline-block w-5 h-0.5 rounded bg-chart-3/70"></span>
              Batches per city
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full border-2 bg-chart-3"
                style={{ borderColor: "var(--card)" }}
              ></span>
              Data point
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <div className="glass h-96 card-premium rounded-2xl p-6 border border-border/20 ">

          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
            <Sparkles className="h-5 w-5 text-chart-1" />
            Quick Actions
          </h3>

          <div className="space-y-3  pt-3">
            <button
              onClick={() => router.push('/superadmin/admins')}
              className="w-full mb-4  group relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-5/10 to-transparent border border-chart-5/20 hover:border-chart-5/40 px-4 py-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-chart-5/10"
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
              className="w-full mb-4 group relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-2/10 to-transparent border border-chart-2/20 hover:border-chart-2/40 px-4 py-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-chart-2/10"
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
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-3/10 to-transparent border border-chart-3/20 hover:border-chart-3/40 px-4 py-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-chart-3/10"
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
