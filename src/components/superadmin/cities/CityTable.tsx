"use client";

import { City } from '@/services/city.service';
import { Batch } from '@/services/batch.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionButtons } from '@/components/ActionButtons';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Building2, Layers, Users } from "lucide-react";

interface CityTableProps {
  cities: City[];
  batches: Batch[];
  loading: boolean;
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
}


export function CityTable({ cities, batches, loading, onEdit, onDelete }: CityTableProps) {

  return (
    <div className="
      glass hover-glow
      rounded-2xl
      border border-border/30
      overflow-hidden
      relative group
    ">

      {/* ✨ Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-chart-2/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-chart-2/10 blur-3xl rounded-full"></div>
      </div>

      <Table className="relative z-10">

        {/* 🔹 HEADER */}
        <TableHeader className="bg-accent/40 backdrop-blur border-b border-border/40">
          <TableRow>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              City
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Batches
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
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
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[90px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[90px] rounded-full" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              }
            />
          )}

          {/* 🔸 EMPTY */}
          {!loading && cities.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <span>No cities found</span>
                  <span className="text-xs opacity-60">
                    Try creating a new city
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* 🔸 DATA */}
          {!loading && cities.map((city) => {
            const batchesInCity = batches.filter(b => b.city_id === city.id);
            const batchesCount = batchesInCity.length;
            const studentsCount = batchesInCity.reduce(
              (sum, b) => sum + (b._count?.students || 0),
              0
            );

            return (
              <TableRow
                key={city.id}
                className="
                  border-b border-border/30
                  hover:bg-accent/30
                  transition-all
                "
              >
                {/* City */}
                <TableCell className="font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-chart-2" />
                    {city.city_name}
                  </div>
                </TableCell>

                {/* Batches */}
                <TableCell>
                  <span className="
                    inline-flex items-center gap-1
                    px-3 py-1
                    rounded-full text-[10px] font-medium
                    bg-chart-2/20 text-chart-2
                    border border-chart-2/30
                  ">
                    <Layers className="w-3 h-3" />
                    {batchesCount}
                  </span>
                </TableCell>

                {/* Students */}
                <TableCell>
                  <span className="
                    inline-flex items-center gap-1
                    px-3 py-1
                    rounded-full text-[10px] font-medium
                    bg-primary/10 text-primary
                    border border-primary/20
                  ">
                    <Users className="w-3 h-3" />
                    {studentsCount}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <ActionButtons
                      onEdit={() => onEdit(city)}
                      onDelete={() => onDelete(city)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
