"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/services/superadmin.service';
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Building2, Layers, Users } from 'lucide-react';

interface Stats {
  totalCities: number;
  totalBatches: number;
  totalAdmins: number;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [cityBreakdown, setCityBreakdown] = useState<{name: string, count: number}[]>([]);
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
          getAllCities().catch(()=>[]),
          getAllBatches().catch(()=>[])
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
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      <div className="grid gap-6 md:grid-cols-3">
        <div onClick={() => router.push('/superadmin/cities')} className="cursor-pointer group relative overflow-hidden bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-border/80">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Total Cities</h3>
            <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform text-primary">
              <Building2 size={24} />
            </div>
          </div>
          <div className="text-4xl font-mono font-medium text-foreground">{stats?.totalCities || 0}</div>
          <div className="text-xs font-mono text-primary mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">View details &rarr;</div>
        </div>

        <div onClick={() => router.push('/superadmin/batches')} className="cursor-pointer group relative overflow-hidden bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-border/80">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Total Batches</h3>
            <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform text-primary">
              <Layers size={24} />
            </div>
          </div>
          <div className="text-4xl font-mono font-medium text-foreground">{stats?.totalBatches || 0}</div>
          <div className="text-xs font-mono text-primary mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">View details &rarr;</div>
        </div>

        <div onClick={() => router.push('/superadmin/admins')} className="cursor-pointer group relative overflow-hidden bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-border/80">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Total Admins</h3>
            <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform text-primary">
              <Users size={24} />
            </div>
          </div>
          <div className="text-4xl font-mono font-medium text-foreground">{stats?.totalAdmins || 0}</div>
          <div className="text-xs font-mono text-primary mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">View details &rarr;</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* City Breakdown Panel */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-[14px] font-semibold text-foreground mb-6 flex items-center justify-between">
            City Breakdown
            <span className="text-xs font-normal text-muted-foreground bg-accent/50 px-2 py-1 rounded">Top Active</span>
          </h2>
          <div className="space-y-5">
            {cityBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No batch data available yet.</p>
            ) : (
              cityBreakdown.map((item, idx) => {
                const max = Math.max(...cityBreakdown.map(c => c.count)) || 1;
                const percentage = (item.count / max) * 100;
                return (
                  <div key={idx} className="flex items-center gap-4 text-sm group">
                    <span className="w-24 text-muted-foreground font-medium truncate group-hover:text-foreground transition-colors">{item.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-primary font-medium">{item.count} batches</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-[14px] font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <button onClick={() => router.push('/superadmin/admins')} className="flex items-center gap-2 w-full px-4 py-3 bg-background hover:bg-muted border border-transparent hover:border-border rounded-xl text-[13.5px] font-semibold transition-all">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm shrink-0">+</span> Add Admin
            </button>
            <button onClick={() => router.push('/superadmin/cities')} className="flex items-center gap-2 w-full px-4 py-3 bg-background hover:bg-muted border border-transparent hover:border-border rounded-xl text-[13.5px] font-semibold transition-all">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm shrink-0">+</span> Add City
            </button>
            <button onClick={() => router.push('/superadmin/batches')} className="flex items-center gap-2 w-full px-4 py-3 bg-background hover:bg-muted border border-transparent hover:border-border rounded-xl text-[13.5px] font-semibold transition-all">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm shrink-0">+</span> Add Batch
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}