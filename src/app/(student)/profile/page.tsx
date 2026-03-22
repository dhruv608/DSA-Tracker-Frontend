"use client";

import React, { useEffect, useState, useRef } from 'react';
import { studentProfileService } from '@/services/student/profile.service';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Flame, Trophy, CheckCircle2, Link as LinkIcon, Camera } from 'lucide-react';

export default function StudentProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await studentProfileService.getProfile();
      setProfileData(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      await studentProfileService.updateProfileImage(file);
      await fetchProfile(); // refresh data to get new image URL
    } catch (err) {
      console.error("Image upload failed", err);
      // Toast notification would be nice here
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData || !profileData.student) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <h2>Failed to load profile data.</h2>
      </div>
    );
  }

  const { student, codingStats, streak, leaderboard, recentActivity, heatmap } = profileData;
  const initials = student.name ? student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'ME';

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-16">
      
      {/* HEADER SECTION */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mb-8 relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-amber-600/20 to-primary/10 w-full" />
        
        <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 relative z-10">
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden shadow-xl">
              {student.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 text-white flex items-center justify-center font-serif">
                  {initials}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black font-serif italic text-foreground tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1 mb-3">@{student.username}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[13px] font-medium text-muted-foreground">
              {student.batch && (
                <span className="bg-secondary px-3 py-1 rounded-full border border-border/50">
                  Batch: {student.batch} {student.year && `(${student.year})`}
                </span>
              )}
              {student.city && (
                <span className="bg-secondary px-3 py-1 rounded-full border border-border/50">
                  {student.city}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: STATS & SOCIAL */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* OVERVIEW STATS */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-5 text-[15px] uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl">
                <span className="text-[13px] font-medium text-muted-foreground">Global Rank</span>
                <span className="font-bold text-foreground font-mono text-lg">#{leaderboard?.globalRank || '-'}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl">
                <span className="text-[13px] font-medium text-muted-foreground">City Rank</span>
                <span className="font-bold text-primary font-mono text-lg">#{leaderboard?.cityRank || '-'}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <span className="text-[13px] font-medium text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Max Streak
                </span>
                <span className="font-bold text-orange-700 dark:text-orange-400 font-mono text-lg">{streak?.maxStreak || 0}</span>
              </div>
            </div>
          </div>

          {/* PLATFORMS & SOCIALS */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-5 text-[15px] uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Connect
            </h3>
            
            <div className="space-y-3">
              <a href={student.github || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${student.github ? 'bg-secondary/50 border-border hover:border-primary/50' : 'bg-muted/30 border-dashed border-border opacity-60 pointer-events-none'}`}>
                <Github className="w-5 h-5 text-foreground" />
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-foreground">GitHub</div>
                  <div className="text-[11px] text-muted-foreground truncate">{student.github ? 'Connected' : 'Not linked'}</div>
                </div>
              </a>
              
              <a href={student.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${student.linkedin ? 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-600 dark:text-blue-400' : 'bg-muted/30 border-dashed border-border opacity-60 pointer-events-none'}`}>
                <Linkedin className="w-5 h-5" />
                <div className="flex-1">
                  <div className="text-[13px] font-bold">LinkedIn</div>
                  <div className="text-[11px] opacity-80 truncate">{student.linkedin ? 'Connected' : 'Not linked'}</div>
                </div>
              </a>

              <div className={`flex items-center gap-3 p-3 rounded-xl border ${student.leetcode ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500' : 'bg-muted/30 border-dashed border-border opacity-60'}`}>
                <div className="w-5 h-5 bg-current rounded flex items-center justify-center text-white text-[10px] font-bold">LC</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold">LeetCode</div>
                  <div className="text-[11px] opacity-80 truncate">{student.leetcode || 'Not linked'}</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border ${student.gfg ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-500' : 'bg-muted/30 border-dashed border-border opacity-60'}`}>
                <div className="w-5 h-5 bg-current rounded flex items-center justify-center text-white text-[10px] font-bold">GFG</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold">GeeksforGeeks</div>
                  <div className="text-[11px] opacity-80 truncate">{student.gfg || 'Not linked'}</div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4 text-[13px]">Manage Links</Button>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVITY & HEATMAP */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SOLVED ACTIVITY */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold font-serif italic text-foreground mb-1">Problem Solving</h2>
                <p className="text-[13px] text-muted-foreground">Your progress across all assignments.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black font-serif italic text-primary">{codingStats?.totalSolved || 0}</div>
                <div className="text-[11px] uppercase tracking-widest font-mono text-muted-foreground mt-1">Total Solved</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Easy</div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{codingStats?.easy?.solved || 0}</div>
                <div className="text-[10px] text-muted-foreground mt-1">/ {codingStats?.easy?.assigned || 0} assigned</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">Medium</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{codingStats?.medium?.solved || 0}</div>
                <div className="text-[10px] text-muted-foreground mt-1">/ {codingStats?.medium?.assigned || 0} assigned</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">Hard</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{codingStats?.hard?.solved || 0}</div>
                <div className="text-[10px] text-muted-foreground mt-1">/ {codingStats?.hard?.assigned || 0} assigned</div>
              </div>
            </div>

            {/* HEATMAP REPLACEMENT */}
            <div>
              <h3 className="text-[14px] font-bold text-foreground mb-4">Activity Heatmap</h3>
              {heatmap && heatmap.length > 0 ? (
                <div className="w-full flex gap-1 flex-wrap">
                  {Array.from({ length: 90 }).map((_, i) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const date = new Date(today);
                    date.setDate(date.getDate() - (89 - i));
                    
                    const dateStr = date.toISOString().split('T')[0];
                    const dayData = heatmap.find((h: any) => new Date(h.date).toISOString().split('T')[0] === dateStr);
                    
                    const count = dayData ? dayData.count : 0;
                    let colorClass = "bg-secondary";
                    if (count > 0) colorClass = "bg-primary/30";
                    if (count > 2) colorClass = "bg-primary/60";
                    if (count > 5) colorClass = "bg-primary";
                    
                    return (
                      <div 
                        key={i} 
                        className={`w-3.5 h-3.5 rounded-sm ${colorClass}`} 
                        title={`${count} submissions on ${date.toLocaleDateString()}`} 
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="h-24 border border-dashed rounded-xl flex items-center justify-center text-[13px] text-muted-foreground bg-muted/30">
                  No activity data available yet. Start solving!
                </div>
              )}
            </div>
          </div>

          {/* RECENT SUBMISSIONS */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 text-[15px] uppercase tracking-wider">Recent Activity</h3>
            
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity: any, idx: number) => {
                  let levelColor = "text-muted-foreground";
                  if (activity.difficulty === 'EASY') levelColor = "text-emerald-500";
                  if (activity.difficulty === 'MEDIUM') levelColor = "text-amber-500";
                  if (activity.difficulty === 'HARD') levelColor = "text-red-500";

                  return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={`w-5 h-5 ${levelColor}`} />
                        <div>
                          <div className="font-semibold text-[14px] text-foreground">{activity.problemTitle}</div>
                          <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                            Solved on {new Date(activity.solvedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-secondary ${levelColor}`}>
                        {activity.difficulty}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-[14px]">
                No recent submissions.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
