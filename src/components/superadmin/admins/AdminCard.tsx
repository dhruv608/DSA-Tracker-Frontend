"use client";

import { Admin } from '@/services/admin.service';
import { ActionButtons } from '@/components/ActionButtons';

interface AdminCardProps {
  admin: Admin;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export function AdminCard({ admin, onEdit, onDelete }: AdminCardProps) {
  const adminBatch = admin.batch;
  const adminCity = admin.city;

 return (
  <div className="
    glass hover-glow
    rounded-2xl p-5
    border border-border/30
    relative overflow-hidden
    group
  ">
    
    {/* ✨ Top Glow Effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
    </div>

    {/* 🔹 Header */}
    <div className="flex items-start justify-between mb-4 relative z-10">
      
      {/* Left */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm tracking-wide truncate">
          {admin.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate mt-1">
          {admin.email}
        </p>
      </div>

      {/* Right Badge */}
      <div className="ml-3">
        <span className="
          px-3 py-1
          text-[10px] font-semibold tracking-wide
          rounded-full
          bg-primary/20 text-primary
          border border-primary/30
          backdrop-blur
        ">
          {admin.role}
        </span>
      </div>
    </div>

    {/* 🔸 Divider */}
    <div className="h-px bg-border/40 mb-4"></div>

    {/* 🔹 Info Grid */}
    <div className="grid grid-cols-2 gap-4 mb-4 text-xs relative z-10">
      
      {/* City */}
      <div>
        <span className="text-muted-foreground text-[11px]">
          City
        </span>
        <p className="text-foreground font-medium mt-1">
          {admin.role === 'SUPERADMIN' ? (
            <span className="opacity-40">—</span>
          ) : (
            adminCity?.city_name || (
              <span className="opacity-40">Unassigned</span>
            )
          )}
        </p>
      </div>

      {/* Batch */}
      <div>
        <span className="text-muted-foreground text-[11px]">
          Batch
        </span>
        <p className="text-foreground font-medium mt-1">
          {admin.role === 'SUPERADMIN' ? (
            <span className="opacity-40">—</span>
          ) : (
            adminBatch?.batch_name || (
              <span className="opacity-40">Unassigned</span>
            )
          )}
        </p>
      </div>
    </div>

    {/* 🔸 Bottom Divider */}
    <div className="h-px bg-border/40 mb-3"></div>

    {/* 🔹 Actions */}
    <div className="flex justify-end relative z-10">
      <ActionButtons
        onEdit={() => onEdit(admin)}
        onDelete={() => onDelete(admin)}
      />
    </div>
  </div>
);
}
