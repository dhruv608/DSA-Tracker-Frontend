/**
 * Dashboard-related types for admin
 */

import { BatchSelection } from '../common/index.types';

export interface AdminStats {
  total_students: number;
  total_questions: number;
  total_topics_discussed: number;
  total_classes: number;
  questions_by_level?: Record<string, number>;
  questions_by_type?: Record<string, number>;
  questions_by_platform?: Record<string, number>;
}

export interface DashboardHeaderProps {
  selectedBatch: BatchSelection | null;
}

export interface DashboardStatsProps {
  stats: AdminStats | null;
}

export interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export interface StatCardProps {
  title: string;
  value: number | string | undefined;
  icon: React.ReactNode;
}

export interface QuickActionProps {
  // No props needed
}

export interface DashboardShimmerProps {
  // No props needed
}
