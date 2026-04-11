"use client";

import { ReactNode } from "react";
import { Users, BookOpen, Layers, HelpCircle } from "lucide-react";
import { AdminStats } from "@/types/admin/dashboard.types";

interface StatsProps {
  stats: AdminStats | null;
}

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  icon: ReactNode;
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Students" value={stats?.total_students} icon={<Users />} />
      <StatCard title="Topics" value={stats?.total_topics_discussed} icon={<BookOpen />} />
      <StatCard title="Classes" value={stats?.total_classes} icon={<Layers />} />
      <StatCard title="Questions" value={stats?.total_questions} icon={<HelpCircle />} />
    </div>
  );
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="glass  hover-glow rounded-2xl p-6 flex items-center gap-4">

      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>

    </div>
  );
}
