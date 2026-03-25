"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Filter,
  X,
  Loader2
} from 'lucide-react';

interface Topic {
  id: number;
  topic_name: string;
  slug: string;
  photo_url: string;
  totalAssigned: number;
  totalSolved: number;
}

interface TopicProgressData {
  username: string;
  studentName: string;
  batchName: string;
  topics: Topic[];
  totalTopics: number;
  totalAssigned: number;
  totalSolved: number;
}

interface TopicProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export function TopicProgressModal({ isOpen, onClose, username }: TopicProgressModalProps) {
  const [topicData, setTopicData] = useState<TopicProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'solved' | 'assigned' | 'name'>('solved');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'inprogress'>('all');

  const fetchTopicProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/topicprogress/${username}?sortBy=${sortBy}`);
      setTopicData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && username) fetchTopicProgress();
  }, [isOpen, username, sortBy]);

  const getFilteredTopics = () => {
    if (!topicData) return [];

    return topicData.topics.filter(topic => {
      if (filterStatus === 'completed') return topic.totalSolved === topic.totalAssigned && topic.totalAssigned > 0;
      if (filterStatus === 'inprogress') return topic.totalSolved < topic.totalAssigned && topic.totalSolved > 0;
      return true;
    });
  };

  const getStatusBadge = (topic: Topic) => {
    if (topic.totalAssigned === 0) return { label: 'Not Started', variant: 'secondary' as const };
    if (topic.totalSolved === topic.totalAssigned) return { label: 'Completed', variant: 'default' as const };
    return { label: 'In Progress', variant: 'outline' as const };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* MODAL */}
      <div className="relative w-[95vw] max-w-[1100px] h-[85vh] bg-background border rounded-2xl shadow-lg flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Topic Progress
            </div>
            <p className="text-sm text-muted-foreground">
              {topicData?.studentName} • {topicData?.batchName}
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-col flex-1 overflow-hidden p-6 gap-6">

          {/* STATS */}
          {topicData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={<BookOpen />} label="Topics" value={topicData.totalTopics} />
              <Stat icon={<Target />} label="Assigned" value={topicData.totalAssigned} />
              <Stat icon={<TrendingUp />} label="Solved" value={topicData.totalSolved} />
              <Stat
                icon={<Award />}
                label="Completion"
                value={
                  topicData.totalAssigned > 0
                    ? `${Math.round((topicData.totalSolved / topicData.totalAssigned) * 100)}%`
                    : "0%"
                }
              />
            </div>
          )}

          {/* FILTERS */}
          <div className="flex gap-3 items-center">
            <Filter className="w-4 h-4" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="solved">Solved</option>
              <option value="assigned">Assigned</option>
              <option value="name">Name</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="inprogress">In Progress</option>
            </select>
          </div>

          {/* LIST */}
          {/* LIST */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {loading ? (
              <div className="col-span-full flex justify-center items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500">{error}</div>
            ) : (
              getFilteredTopics().map(topic => {
                const progress = topic.totalAssigned > 0
                  ? Math.round((topic.totalSolved / topic.totalAssigned) * 100)
                  : 0;

                const status = getStatusBadge(topic);

                return (
                  <div key={topic.id} className="border rounded-xl p-4">

                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">{topic.topic_name}</h3>
                      <Badge>{status.label}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      {topic.totalSolved}/{topic.totalAssigned}
                    </div>

                    <div className="w-full bg-muted h-2 rounded">
                      <div
                        className="bg-primary h-2 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* SMALL STAT COMPONENT */
function Stat({ icon, label, value }: any) {
  return (
    <div className="border rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}