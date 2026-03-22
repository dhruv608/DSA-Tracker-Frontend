"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  User,
  Medal,
  Award,
  Globe,
  MapPin,
  Calendar,
  Box,
  Brain,
  Hash,
  Github,
  Linkedin,
  Link as LinkIcon,
  CheckCircle2,
  Flame,
  Activity,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';

export default function AdminStudentProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMs, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        console.log("Fetching username:", username);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/students/profile/${username}`);
        
        if (!res.ok) {
           throw new Error("Failed to fetch profile");
        }
        
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
         console.error("Profile fetch error:", err);
         setError(err.message || 'Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);


  if (loading) {
     return <Skeletons />;
  }

  if (errorMs) {
    return (
       <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 bg-destructive/5 rounded-xl text-destructive mt-10">
         <User className="w-12 h-12 opacity-50 mb-4" />
         <h3 className="text-xl font-semibold mb-2">Profile Unreachable</h3>
         <p className="text-sm">{errorMs}</p>
         <Button variant="outline" className="mt-4" asChild>
           <Link href="/admin/students">Return to Directory</Link>
         </Button>
       </div>
    );
  }

  if (!profile) return null;

  const { student, codingStats, streak, leaderboard, heatmap, recentActivity } = profile;

  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/admin/students" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
      </div>

      {/* HEADER SECTION */}
      <Card className="border-border shadow-sm overflow-hidden bg-card/50">
         <CardContent className="p-0">
            {/* Top Banner Accent */}
            <div className="h-24 md:h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent w-full"></div>
            
            <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end -mt-12 md:-mt-16">
               {/* Avatar */}
               <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-background bg-card flex items-center justify-center text-primary text-4xl md:text-5xl font-bold shadow-lg overflow-hidden shrink-0">
                  {student.profileImageUrl ? (
                    <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    student.name?.charAt(0).toUpperCase() || <User className="w-12 h-12" />
                  )}
               </div>

               {/* Identity */}
               <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{student.name}</h1>
                        <p className="text-muted-foreground font-mono text-sm mt-1">@{student.username}</p>
                     </div>
                     
                     <div className="flex flex-wrap gap-2">
                        {student.batch && (
                           <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                             <Globe className="w-3.5 h-3.5 mr-1.5" />
                             {student.batch} {student.year ? `(${student.year})` : ''}
                           </div>
                        )}
                        {student.city && (
                           <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border">
                             <MapPin className="w-3.5 h-3.5 mr-1.5" />
                             {student.city}
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border/50">
                     {student.leetcode && (
                       <a href={`https://leetcode.com/${student.leetcode}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <LinkIcon className="w-4 h-4" /> LeetCode
                       </a>
                     )}
                     {student.gfg && (
                       <a href={`https://auth.geeksforgeeks.org/user/${student.gfg}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <LinkIcon className="w-4 h-4" /> GFG
                       </a>
                     )}
                     {student.github && (
                       <a href={student.github.startsWith('http') ? student.github : `https://github.com/${student.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Github className="w-4 h-4" /> GitHub
                       </a>
                     )}
                     {student.linkedin && (
                       <a href={student.linkedin.startsWith('http') ? student.linkedin : `https://linkedin.com/in/${student.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                       </a>
                     )}
                  </div>
               </div>

            </div>
         </CardContent>
      </Card>

      {/* HIGHLIGHT STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatBox icon={<CheckCircle2 className="w-6 h-6" />} label="Total Solved" value={codingStats.totalSolved} sub={`${Math.round((codingStats.totalSolved / Math.max(codingStats.totalAssigned, 1)) * 100)}% completion`} />
         <StatBox icon={<Flame className="w-6 h-6 text-orange-500" />} label="Max Streak" value={streak.maxStreak} sub={`Current: ${streak.currentStreak}`} />
         <StatBox icon={<Trophy className="w-6 h-6 text-yellow-500" />} label="City Rank" value={leaderboard.cityRank || '-'} sub="All-time scope" />
         <StatBox icon={<Globe className="w-6 h-6 text-blue-500" />} label="Global Rank" value={leaderboard.globalRank || '-'} sub="All-time scope" />
      </div>

      {/* CODING STATS & HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Coding Cards */}
         <Card className="border-border shadow-sm lg:col-span-1 flex flex-col">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-2 flex-1 flex flex-col justify-center">
               <DifficultyRow label="Easy" solved={codingStats.easy.solved} total={codingStats.easy.assigned} color="bg-emerald-500" text="text-emerald-500" bg="bg-emerald-500/10" />
               <DifficultyRow label="Medium" solved={codingStats.medium.solved} total={codingStats.medium.assigned} color="bg-amber-500" text="text-amber-500" bg="bg-amber-500/10" />
               <DifficultyRow label="Hard" solved={codingStats.hard.solved} total={codingStats.hard.assigned} color="bg-rose-500" text="text-rose-500" bg="bg-rose-500/10" />
            </CardContent>
         </Card>

         {/* Heatmap */}
         <Card className="border-border shadow-sm lg:col-span-2 overflow-hidden">
            <CardHeader className="pb-4">
               <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Activity Heatmap</CardTitle>
               <CardDescription>Daily problem solving consistency over the last year.</CardDescription>
            </CardHeader>
            <CardContent>
               <HeatmapGrid heatmapData={heatmap || []} />
            </CardContent>
         </Card>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <Card className="border-border shadow-sm">
         <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
         </CardHeader>
         <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
               <div className="rounded-md border border-border overflow-hidden">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                        <tr>
                           <th className="px-4 py-3">Problem</th>
                           <th className="px-4 py-3">Difficulty</th>
                           <th className="px-4 py-3">Solved At</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {recentActivity.map((activity: any, idx: number) => {
                           // Define pill colors using theme-compliant variables
                           let pillClass = "bg-muted text-foreground";
                           if (activity.difficulty === 'EASY') pillClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                           if (activity.difficulty === 'MEDIUM') pillClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                           if (activity.difficulty === 'HARD') pillClass = "bg-rose-500/10 text-rose-500 border-rose-500/20";

                           return (
                             <tr key={idx} className="hover:bg-muted/50 transition-colors">
                               <td className="px-4 py-3 font-medium text-foreground">{activity.problemTitle}</td>
                               <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${pillClass}`}>
                                    {activity.difficulty}
                                  </span>
                               </td>
                               <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                  {new Date(activity.solvedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                               </td>
                             </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            ) : (
               <p className="text-sm text-muted-foreground text-center py-10 bg-muted/30 rounded-xl border border-dashed border-border/50">No recent submissions found.</p>
            )}
         </CardContent>
      </Card>
      
    </div>
  );
}

function StatBox({ icon, label, value, sub }: { icon: any, label: string, value: string | number, sub?: string }) {
  return (
    <Card className="border-border shadow-sm">
       <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
               <p className="text-sm font-medium text-muted-foreground">{label}</p>
               <p className="text-3xl font-extrabold text-foreground tracking-tight mt-1">{value}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 opacity-80">
               {icon}
            </div>
          </div>
          {sub && <p className="text-xs text-muted-foreground mt-3 font-medium">{sub}</p>}
       </CardContent>
    </Card>
  );
}

function DifficultyRow({ label, solved, total, color, text, bg }: { label: string, solved: number, total: number, color: string, text: string, bg: string }) {
  const percentage = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-4">
       <div className={`w-16 shrink-0 font-medium text-sm text-right ${text}`}>{label}</div>
       <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
       </div>
       <div className="w-16 shrink-0 text-sm tracking-tight font-semibold text-right">
         {solved} <span className="text-muted-foreground font-normal text-xs">/ {total}</span>
       </div>
    </div>
  );
}

const HeatmapGrid = ({ heatmapData }: { heatmapData: { date: string, count: number }[] }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[150px] bg-muted/20 animate-pulse rounded-md"></div>;
  }

  // Map data to O(1) dictionary 
  const safeHeatmapData = heatmapData || [];
  const dataMap = safeHeatmapData.reduce((acc, curr) => {
    if (!curr?.date) return acc;
    const d = new Date(curr.date).toISOString().split('T')[0];
    acc[d] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  // Target exactly Last 365 Days
  const days = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
     const d = new Date(today);
     d.setDate(today.getDate() - i);
     days.push(d);
  }

  // Pad the first week so Sunday is at index 0
  const firstDay = days[0].getDay(); 
  const paddedDays = Array(firstDay).fill(null).concat(days);

  // Chunk into 7-day columns
  const weeks = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
     weeks.push(paddedDays.slice(i, i + 7));
  }

  const getColor = (count: number) => {
     if (!count) return 'bg-muted/40 hover:bg-muted/60';
     if (count === 1) return 'bg-primary/30 hover:bg-primary/40';
     if (count === 2) return 'bg-primary/50 hover:bg-primary/60';
     if (count === 3) return 'bg-primary/70 hover:bg-primary/80';
     return 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // We approximate the month labels by placing them roughly every 4-5 columns where the month changes
  let currentMonth = -1;

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
       <div className="min-w-[750px]">
          {/* Month Labels row */}
          <div className="flex mb-2 ml-6 text-xs text-muted-foreground font-medium h-4 relative">
             {weeks.map((week, wIdx) => {
                const head = week.find(d => d);
                if (head) {
                   const m = head.getMonth();
                   if (m !== currentMonth) {
                      currentMonth = m;
                      if (head.getDate() <= 14) { 
                         return <span key={wIdx} className="absolute" style={{ left: `${wIdx * 14}px` }}>{months[m]}</span>;
                      }
                   }
                }
                return null;
             })}
          </div>
          
          <div className="flex gap-2">
            {/* Days of week axis */}
            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground font-medium pt-1 w-5 tracking-tighter">
               <span className="h-3"></span>
               <span className="h-3 leading-3">Mon</span>
               <span className="h-3"></span>
               <span className="h-3 leading-3">Wed</span>
               <span className="h-3"></span>
               <span className="h-3 leading-3">Fri</span>
               <span className="h-3"></span>
            </div>

            {/* Matrix */}
            <div className="flex gap-1">
               {weeks.map((week, wIdx) => (
                 <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day, dIdx) => {
                       if (!day) return <div key={dIdx} className="w-3 h-3 rounded-[2px]" />;
                       const dateStr = day.toISOString().split('T')[0];
                       const count = dataMap[dateStr] || 0;
                       return (
                         <div 
                           key={dIdx} 
                           className={`w-3 h-3 rounded-[2px] cursor-pointer transition-colors ${getColor(count)}`} 
                           title={`${new Date(day).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric'})}: ${count} submissions`}
                         />
                       );
                    })}
                 </div>
               ))}
            </div>
          </div>
       </div>
    </div>
  )
}

function Skeletons() {
  return (
     <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-6 w-32 bg-muted rounded-md mb-4"></div>
        <div className="h-64 w-full bg-card border border-border rounded-xl"></div>
        <div className="grid grid-cols-4 gap-4">
           {[...Array(4)].map((_,i) => <div key={i} className="h-28 bg-card border border-border rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-3 gap-6">
           <div className="h-48 bg-card border border-border rounded-xl col-span-1"></div>
           <div className="h-48 bg-card border border-border rounded-xl col-span-2"></div>
        </div>
     </div>
  );
}
