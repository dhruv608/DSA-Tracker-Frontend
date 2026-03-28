"use client";

import { Batch } from '@/services/batch.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionButtons } from '@/components/ActionButtons';
import { TableSkeleton } from '@/components/TableSkeleton';

interface BatchTableProps {
  batches: Batch[];
  loading: boolean;
  cities: { id: number; city_name: string }[];
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}

import { MapPin, Users, Calendar } from "lucide-react";

export function BatchTable({ batches, loading, cities, onEdit, onDelete }: BatchTableProps) {
  const getCityName = (id: number) =>
    cities.find(c => c.id === id)?.city_name || "Unknown";

  return (
    <div className="
      glass hover-glow
      rounded
      border border-border/30
      overflow-hidden
      relative group
    ">

      {/* ✨ Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-chart-3/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-chart-3/10 blur-3xl rounded-full"></div>
      </div>

      <Table className="relative z-10 ">

        {/* 🔹 HEADER */}
        <TableHeader className="bg-accent/40 backdrop-blur border-b border-border/40">
          <TableRow>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Batch
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Year
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              City
            </TableHead>
            <TableHead className="text-center text-xs font-semibold text-muted-foreground">
              Students
            </TableHead>
            <TableHead className="text-right text-xs font-semibold text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {/* 🔸 LOADING */}
          {loading && (
            <TableSkeleton
              row={
                <TableRow className="hover:bg-accent/30 transition">
                  <TableCell><Skeleton className="h-5 w-[140px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[60px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-[30px] mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              }
            />
          )}

          {/* 🔸 EMPTY */}
          {!loading && batches.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <span>No batches found</span>
                  <span className="text-xs opacity-60">
                    Try adjusting filters
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* 🔸 DATA */}
          {!loading && batches.map((batch) => (
            <TableRow
              key={batch.id}
              className="
                border-b border-border/30
                hover:bg-accent/30
                transition-all
              "
            >
              {/* Batch Name */}
              <TableCell className="font-semibold text-foreground">
                {batch.batch_name}
              </TableCell>

              {/* Year */}
              <TableCell>
                <span className="
                  inline-flex items-center gap-1
                  px-3 py-1
                  rounded-full text-[10px] font-medium
                  bg-chart-3/20 text-chart-3
                  border border-chart-3/30
                ">
                  <Calendar className="w-3 h-3" />
                  {batch.year}
                </span>
              </TableCell>

              {/* City */}
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {batch.city?.city_name || getCityName(batch.city_id)}
                </div>
              </TableCell>

              {/* Students */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground font-medium">
                  <Users className="w-3.5 h-3.5" />
                  {batch._count?.students || 0}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ActionButtons
                    onEdit={() => onEdit(batch)}
                    onDelete={() => onDelete(batch)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}