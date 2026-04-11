"use client";

import { City } from '@/types/superadmin/city.types';
import { ActionButtons } from '@/components/ActionButtons';
import { Building2, Users, Layers } from 'lucide-react';

interface CityCardProps {
  city: City;
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
}


export function CityCard({ city, onEdit, onDelete }: CityCardProps) {
  return (
    <div className="
      glass hover-glow
      rounded-2xl p-5
      border border-border/30
      relative overflow-hidden
      
    ">

      {/* ✨ Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-chart-2/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-2/10 blur-3xl rounded-full"></div>
      </div>

      {/* 🔹 HEADER */}
      <div className="flex items-start justify-between mb-4 relative z-10">

        <div className="flex items-start gap-3 min-w-0">

          {/* Icon */}
          <div className="
            p-2 rounded-xl
            bg-chart-2/20
            border border-chart-2/30
          ">
            <Building2 className="w-4 h-4 text-chart-2" />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate text-sm">
              {city.city_name}
            </h3>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-1">
              <span className="
                inline-flex items-center gap-1
                px-2.5 py-0.5
                rounded-full text-[10px] font-medium
                bg-chart-2/20 text-chart-2
                border border-chart-2/30
              ">
                <Layers className="w-3 h-3" />
                {city.total_batches ?? 0}
              </span>

              <span className="
                inline-flex items-center gap-1
                px-2.5 py-0.5
                rounded-full text-[10px] font-medium
                bg-primary/10 text-primary
                border border-primary/20
              ">
                <Users className="w-3 h-3" />
                {city.total_students ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔸 Divider */}
      <div className="h-px bg-border/40 mb-4"></div>

      {/* 🔹 INFO */}
      <div className="flex items-center justify-between text-xs relative z-10">

        <div className="flex items-center gap-2 text-muted-foreground">
          <Layers className="w-3.5 h-3.5" />
          <span>{city.total_batches ?? 0} batches</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span>{city.total_students ?? 0} students</span>
        </div>
      </div>

      {/* 🔸 Bottom Divider */}
      <div className="h-px bg-border/40 my-4"></div>

      {/* 🔹 ACTIONS */}
      <div className="flex justify-end relative z-10">
        <ActionButtons
          onEdit={() => onEdit(city)}
          onDelete={() => onDelete(city)}
        />
      </div>
    </div>
  );
}
