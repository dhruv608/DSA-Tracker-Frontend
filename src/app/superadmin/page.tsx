"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/superadmin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Layers, Activity, MapPin, Users2,  ArrowUpRight, Sparkles, Globe, Target } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart,Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { handleToastError } from "@/utils/toast-system";

import { motion } from "framer-motion";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
      {/* Header  */}
      <div className="flex items-center justify-between glass  mb-5 p-5 -mt-9 backdrop-blur-2xl rounded-2xl ">
        <div>
          <h2 className="text-3xl font-bold">
           Institutional  <span className="text-primary" >Analytics</span>
          </h2>
          <p className="text-muted-foreground mt-1 p-0 m-0">
            Oversee and manage cities, batches, and administrators across the platform.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cities */}
        <div
          onClick={() => router.push('/superadmin/cities')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              router.push('/superadmin/cities');
            }
          }}
          tabIndex={0}
          className="cursor-pointer  glass  p-6 rounded-2xl   transition-all duration-300 border border-border/20  relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-chart-2/50"
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              router.push('/superadmin/batches');
            }
          }}
          tabIndex={0}
          className="cursor-pointer glass  p-6 rounded-2xl  transition-all duration-300 border border-border/20 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-chart-3/50"
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              router.push('/superadmin/admins');
            }
          }}
          tabIndex={0}
          className="cursor-pointer glass  p-6 rounded-2xl  transition-all duration-300 border border-border/20 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-chart-5/50"
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
          className="md:col-span-2 glass  rounded-2xl p-6 border border-border/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-[15px] font-medium text-foreground flex items-center gap-2.5">
              {/* Bar chart icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="text-chart-3"
              >
                <rect x="2" y="8" width="3" height="8" rx="1" fill="currentColor" />
                <rect x="6" y="5" width="3" height="11" rx="1" fill="currentColor" />
                <rect x="10" y="3" width="3" height="13" rx="1" fill="currentColor" />
                <rect x="14" y="6" width="3" height="10" rx="1" fill="currentColor" />
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
              <BarChart
                data={cityBreakdown}
                margin={{ top: 20, right: 20, left: -4, bottom: 0 }}
                barGap={8}
                barSize={40}
              >
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  vertical={false}
                  opacity={0.3}
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
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }}
                  tickCount={5}
                  width={28}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "var(--chart-3)",
                    fillOpacity: 0.1,
                  }}
                />

                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {cityBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[
                        'var(--chart-1)', // Primary lime
                        'var(--chart-2)', // Cyan  
                        'var(--chart-3)', // Blue
                        'var(--chart-5)', // Green
                        'var(--chart-4)', // Red (for contrast)
                      ][index % 5]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer legend */}
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-chart-1"></div>
                <div className="w-3 h-3 rounded-sm bg-chart-2"></div>
                <div className="w-3 h-3 rounded-sm bg-chart-3"></div>
              </div>
              Batches per city
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <div className="w-3 h-3 rounded-sm bg-chart-3"></div>
              City data
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <div className="glass h-96  rounded-2xl p-6 border border-border/20 ">

          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
            <Sparkles className="h-5 w-5 text-chart-1" />
            Quick Actions
          </h3>

          <div className="space-y-3  pt-3">
            <button
              onClick={() => router.push('/superadmin/admins')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push('/superadmin/admins');
                }
              }}
              className="w-full mb-4  relative overflow-hidden rounded-xl  border border-border hover:border-foreground/50 px-4 py-5 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-chart-5/50"
            >
              <div className="relative z-10 flex items-center justify-between  ">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg hover:scale-110 transition-transform">
                    <Users2 className="h-4 w-4 " />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-chart-5 transition-colors">
                    Add Admin
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4  opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chart-5/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => router.push('/superadmin/cities')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push('/superadmin/cities');
                }
              }}
              className="w-full mb-4  relative overflow-hidden rounded-xl  to-transparent border border-border hover:border-foreground/50 px-4 py-5 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-chart-2/50"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg  group-hover:scale-110 transition-transform">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-chart-2 transition-colors">
                    Add City
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4  opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chart-2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => router.push('/superadmin/batches')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push('/superadmin/batches');
                }
              }}
              className="w-full  relative overflow-hidden rounded-xl  to-transparent border border-border hover:border-foreground/50 px-4 py-5 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-chart-3/50"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg  group-hover:scale-110 transition-transform">
                    <Layers className="h-4 w-4 " />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-chart-3 transition-colors">
                    Add Batch 
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chart-3/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
