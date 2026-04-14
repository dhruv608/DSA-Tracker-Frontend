"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from '@/api';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Filter,
  GitBranch,
  Database,
  Network,
  Brain,
  Box,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { BatchSelection } from '@/types/student/index.types';

interface Topic {
  id: number;
  topic_name: string;
  totalQuestions: number;
  solvedQuestions: number;
  progressPercentage: number;
}

interface TopicProgressData {
  success: boolean;
  student: {
    id: number;
    name: string;
    username: string;
    batch?: BatchSelection;
  };
  topics: Topic[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function TopicProgressModal({
  isOpen,
  onClose,
  username,
}: Props) {
  const [data, setData] = useState<TopicProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"weak" | "strong" | "name">("weak");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/topicprogress/${username}`);
      console.log('Topic Progress API Response:', res.data);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching topic progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && username) fetchData();
  }, [isOpen, username]);

  const getSortedTopics = () => {
    if (!data) return [];

    let topics = [...data.topics];

    if (sortBy === "weak") {
      topics.sort(
        (a, b) =>
          a.progressPercentage - b.progressPercentage
      );
    }

    if (sortBy === "strong") {
      topics.sort(
        (a, b) =>
          b.progressPercentage - a.progressPercentage
      );
    }

    if (sortBy === "name") {
      topics.sort((a, b) => a.topic_name.localeCompare(b.topic_name));
    }

    return topics;
  };

 const colorMap: Record<string, string> = {
  hard: "bg-hard",
  medium: "bg-medium",
  easy: "bg-easy",
};

const getColor = (progress: number) => {
  if (progress < 30) return "hard";
  if (progress < 70) return "medium";
  return "easy";
};

  const getTopicIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("graph")) return <Network className="w-4 h-4" />;
    if (n.includes("tree")) return <GitBranch className="w-4 h-4" />;
    if (n.includes("dp") || n.includes("dynamic")) return <Brain className="w-4 h-4" />;
    if (n.includes("array")) return <Box className="w-4 h-4" />;
    return <Database className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[50%]! h-[90vh] max-h-[85vh] backdrop-blur-3xl p-0 overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Topic Progress
              </DialogTitle>
              {loading ? (
                <Skeleton className="h-4 w-48 rounded-md mt-1" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {data?.student?.name} • {data?.student?.batch?.name || data?.student?.batch?.batch_name || 'No batch'}
                </p>
              )}
            </div>
            <DialogClose />
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex flex-col flex-1 overflow-hidden p-6 gap-6">

          {/* STATS */}
          {data ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
              <Stat icon={<BookOpen />} label="Topics" value={data.topics.length} />
              <Stat 
                icon={<Target />} 
                label="Assigned" 
                value={data.topics.reduce((sum, topic) => sum + topic.totalQuestions, 0)} 
              />
              <Stat 
                icon={<TrendingUp />} 
                label="Solved" 
                value={data.topics.reduce((sum, topic) => sum + topic.solvedQuestions, 0)} 
              />
              <Stat
                icon={<Award />}
                label="Completion"
                value={
                  data.topics.reduce((sum, topic) => sum + topic.totalQuestions, 0) > 0
                    ? `${Math.round(
                      (data.topics.reduce((sum, topic) => sum + topic.solvedQuestions, 0) / 
                       data.topics.reduce((sum, topic) => sum + topic.totalQuestions, 0)) * 100
                    )}%`
                    : "0%"
                }
              />
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`stat-skeleton-${index}`} className="rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm border border-border/60">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-12 rounded-md" />
                    <Skeleton className="h-4 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "weak" | "strong" | "name")}>
              <SelectTrigger className=" h-10 px-4 rounded-2xl border border-border  ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weak">Weakest First</SelectItem>
                <SelectItem value="strong">Strongest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto scrollbar-none pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">

            {loading ? (
              // Skeleton loading that matches the topic card layout
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="p-4 rounded-2xl backdrop-blur-sm border border-border/60"
                >
                  {/* TOP SECTION - Icon, title, and percentage */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Icon skeleton */}
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      
                      {/* Title and subtitle skeleton */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-3 w-16 rounded-md" />
                      </div>
                    </div>
                    
                    {/* Percentage skeleton */}
                    <Skeleton className="h-4 w-8 rounded-md" />
                  </div>

                  {/* PROGRESS BAR SKELETON */}
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <Skeleton className="h-full w-full rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              getSortedTopics().map((topic) => {
                const progress = topic.progressPercentage || 0;

                return (
                  <div
                    key={topic.id}
                    className="backdrop-blur-sm glass p-4 rounded-2xl   hover:border-primary/30 transition-all hover:shadow-md"
                  >
                    {/* TOP */}
                    <div className=" flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getTopicIcon(topic.topic_name)}
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">
                            {topic.topic_name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {topic.solvedQuestions} / {topic.totalQuestions}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-primary">
                        {progress}%
                      </span>
                    </div>

                    {/* PROGRESS */}
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorMap[getColor(progress)]} transition-all duration-700`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* STAT CARD */
interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="rounded-2xl glass p-4 flex items-center gap-3 backdrop-blur-sm  hover:border-primary/30 transition-all">
      <div className="p-2 bg-primary/10 rounded text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
