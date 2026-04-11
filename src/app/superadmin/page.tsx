"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/superadmin.service';
import { Layers, Activity, MapPin, Users2, ArrowUpRight, Sparkles, Globe, Target, Map, LayoutGrid, UserCog, BarChart3, UserPlus, FolderPlus } from 'lucide-react';
import { DashboardShimmer } from '@/components/superadmin/DashboardShimmer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { motion } from "framer-motion";
import { CustomTooltipProps, Stats } from '@/types/superadmin/index.types';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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

        // Use cityBreakdown from stats API (includes all cities sorted by batch count)
        setCityBreakdown(statsData?.cityBreakdown || []);
      } catch (err) {
        // Error is handled by API client interceptor
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


        {/* Cities  */}
        <div
          onClick={() => router.push('/superadmin/cities')}
          onKeyDown={(e) => e.key === 'Enter' && router.push('/superadmin/cities')}
          tabIndex={0}
          className=" cursor-pointer glass p-4 rounded-2xl  backdrop-blur-2xl
  transition-all duration-300 border border-border/20 
  relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-chart-2/40"
        >
          {/* subtle hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-chart-2/10 to-transparent" />

          <div className="flex items-center justify-between mb-2 relative">
            <h3 className="text-xl font-bold text-muted-foreground">Cities</h3>

            <div className="p-2 rounded bg-primary/5 border border-primary/10 
    group-hover:scale-110 transition">
              <Map className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-foreground 
  group-hover:text-chart-2 transition relative">
            {stats?.totalCities || 0}
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <MapPin className="h-3 w-3" />
            <span>Active locations</span>
          </div>
        </div>


        {/* Batches */}
        <div
          onClick={() => router.push('/superadmin/batches')}
          onKeyDown={(e) => e.key === 'Enter' && router.push('/superadmin/batches')}
          tabIndex={0}
          className="backdrop-blur-2xl cursor-pointer glass p-4 rounded-2xl 
  transition-all duration-300 border border-border/20 
  relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-chart-3/40"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-chart-3/10 to-transparent" />

          <div className="flex items-center justify-between mb-2 relative">
            <h3 className="text-xl font-bold text-muted-foreground">Batches</h3>

            <div className="p-2 rounded bg-primary/5 border border-primary/10 
    group-hover:scale-110 transition">
              <LayoutGrid className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-foreground 
  group-hover:text-chart-3 transition relative">
            {stats?.totalBatches || 0}
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <Target className="h-3 w-3" />
            <span>Learning groups</span>
          </div>
        </div>


        {/* Admins */}
        <div
          onClick={() => router.push('/superadmin/admins')}
          onKeyDown={(e) => e.key === 'Enter' && router.push('/superadmin/admins')}
          tabIndex={0}
          className="backdrop-blur-2xl cursor-pointer glass p-4 rounded-2xl 
  transition-all duration-300 border border-border/20 
  hover:border-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20
  relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-chart-5/40"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-chart-5/10 to-transparent" />

          <div className="flex items-center justify-between mb-2 relative">
            <h3 className="text-xl font-bold text-muted-foreground">Admins</h3>

            <div className="p-2 rounded bg-primary/5 border border-primary/10 
    group-hover:scale-110 transition">
              <UserCog className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-foreground 
  group-hover:text-chart-5 transition relative">
            {stats?.totalAdmins || 0}
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
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
  transition={{ duration: 0.4 }}
  className="md:col-span-2 glass rounded-2xl backdrop-blur-2xl p-3  border border-border/20"
>
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
      <BarChart3 className="h-4 w-4 text-chart-1" />
      City Overview
    </h3>

    <span className="text-xs text-muted-foreground">
      All cities data
    </span>
  </div>

  {/* Chart */}
  <div className="h-[220px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={cityBreakdown} // ✅ ALL cities
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        barSize={28}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          vertical={false}
          opacity={0.2}
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          width={28}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--chart-2)", fillOpacity: 0.08 }}
        />

        {/* ✅ SINGLE COLOR BAR */}
        <Bar
          dataKey="count"
          radius={[6, 6, 0, 0]}
          fill="var(--chart-1)"
          animationDuration={700}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Footer */}
  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/10">
    <div className="w-3 h-3 rounded-sm bg-chart-1"></div>
    <span className="text-xs text-muted-foreground/50">
      Batches per city
    </span>
  </div>
</motion.div>

        {/* Quick Actions Panel */}
        
<div className="glass backdrop-blur-2xl h-full rounded-2xl p-5 border border-border/20">

  <h3 className="text-base font-semibold text-foreground mb-7 flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
    <Sparkles className="h-4 w-4 text-chart-1" />
    Quick Actions
  </h3>

  <div className="space-y-3">

    {/* Add Admin */}
   <button
  onClick={() => router.push('/superadmin/admins')}
  className=" w-full flex items-center justify-between px-4 py-3 rounded-2xl 
  border border-border hover:border-chart-5/40 transition-all"
>
  {/* Left */}
  <div className="flex items-center gap-3">
    
    {/* Icon Box */}
    <div className="flex items-center justify-center w-8 h-8 
    border border-primary/20 bg-primary/5 rounded">
      <UserPlus className="h-4 w-4 text-primary" />
    </div>

    {/* Text */}
    <span className="text-xl mt-2  font-medium text-muted-foreground">
      Add Admin
    </span>
  </div>

  {/* Arrow */}
  <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
</button>

    {/* Add City */}
    <button
      onClick={() => router.push('/superadmin/cities')}
      className=" w-full flex items-center justify-between px-4 py-4 rounded-2xl 
      border border-border hover:border-chart-2/40 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 
    border border-primary/20 bg-primary/5 rounded">
          <MapPin className="h-4 w-4 text-primary " />
        </div>
        <span className="text-xl text-muted-foreground mt-2">Add City</span>
      </div>
      <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition" />
    </button>

    {/* Add Batch */}
    <button
      onClick={() => router.push('/superadmin/batches')}
      className=" w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-border/60
       hover:border-chart-3/40 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 
    border border-primary/20 bg-primary/5 rounded">
        <FolderPlus className="h-4 w-4 text-primary " />
        </div>
        <span className="text-xl text-muted-foreground mt-2 ">Add Batch</span>
      </div>
      <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition" />
    </button>

  </div>
</div>
      </div>

    </div>
  );
}
