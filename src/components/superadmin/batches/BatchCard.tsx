"use client";

import { Batch } from '@/services/batch.service';
import { ActionButtons } from '@/components/ActionButtons';
import { Calendar, Layers, MapPin, Users } from 'lucide-react';

interface BatchCardProps {
  batch: Batch;
  cityName: string;
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}


export function BatchCard({ batch, cityName, onEdit, onDelete }: BatchCardProps) {
  return (
    <div className="
      glass hover-glow
      rounded-2xl p-5
      border border-border/30
      relative overflow-hidden
      group
    ">

      {/* ✨ Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-chart-3/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-3/10 blur-3xl rounded-full"></div>
      </div>

      {/* 🔹 HEADER */}
      <div className="flex items-start justify-between mb-4 relative z-10">

        <div className="flex items-start gap-3 min-w-0">

          {/* Icon */}
          <div className="
            p-2 rounded-xl
            bg-chart-3/20
            border border-chart-3/30
          ">
            <Layers className="w-4 h-4 text-chart-3" />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate text-sm">
              {batch.batch_name}
            </h3>

            {/* Year Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className="
                inline-flex items-center gap-1
                px-2.5 py-0.5
                rounded-full text-[10px] font-medium
                bg-chart-3/20 text-chart-3
                border border-chart-3/30
              ">
                <Calendar className="w-3 h-3" />
                {batch.year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔸 Divider */}
      <div className="h-px bg-border/40 mb-4"></div>

      {/* 🔹 INFO */}
      <div className="space-y-3 text-xs relative z-10">

        {/* City */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">City</span>
          <span className="text-foreground font-medium truncate">
            {cityName}
          </span>
        </div>

        {/* Students */}
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Students</span>
          <span className="text-foreground font-semibold">
            {batch._count?.students || 0}
          </span>
        </div>
      </div>

      {/* 🔸 Bottom Divider */}
      <div className="h-px bg-border/40 my-4"></div>

      {/* 🔹 ACTIONS */}
      <div className="flex justify-end relative z-10">
        <ActionButtons
          onEdit={() => onEdit(batch)}
          onDelete={() => onDelete(batch)}
        />
      </div>
    </div>
  );
}
