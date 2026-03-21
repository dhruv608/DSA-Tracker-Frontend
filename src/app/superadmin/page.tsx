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
      
      <div className="grid gap-4 md:grid-cols-3">
        <div onClick={() => router.push('/superadmin/cities')} className="cursor-pointer bg-card border rounded-xl p-6 transition-colors hover:bg-muted/50">
          <div className="flex items-center justify-between space-y-0 text-muted-foreground pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Cities</h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalCities || 0}</div>
        </div>

        <div onClick={() => router.push('/superadmin/batches')} className="cursor-pointer bg-card border rounded-xl p-6 transition-colors hover:bg-muted/50">
          <div className="flex items-center justify-between space-y-0 text-muted-foreground pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Batches</h3>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalBatches || 0}</div>
        </div>

        <div onClick={() => router.push('/superadmin/admins')} className="cursor-pointer bg-card border rounded-xl p-6 transition-colors hover:bg-muted/50">
          <div className="flex items-center justify-between space-y-0 text-muted-foreground pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Admins</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalAdmins || 0}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* City Breakdown Panel */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between space-y-0 pb-6 text-foreground">
            <h3 className="tracking-tight text-sm font-semibold">City Breakdown</h3>
            <span className="text-xs font-normal text-muted-foreground">Top Active</span>
          </div>
          <div className="space-y-6">
            {cityBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No batch data available yet.</p>
            ) : (
              cityBreakdown.map((item, idx) => {
                const max = Math.max(...cityBreakdown.map(c => c.count)) || 1;
                const percentage = (item.count / max) * 100;
                return (
                  <div key={idx} className="flex flex-col gap-2 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-muted-foreground">{item.count} batches</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="tracking-tight text-sm font-semibold text-foreground mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/superadmin/admins')} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full">
              Add Admin
            </button>
            <button onClick={() => router.push('/superadmin/cities')} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full">
              Add City
            </button>
            <button onClick={() => router.push('/superadmin/batches')} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full">
              Add Batch
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}