"use client";

import { Admin } from '@/services/admin.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionButtons } from '@/components/ActionButtons';
import { TableSkeleton } from '@/components/TableSkeleton';

interface AdminTableProps {
  admins: Admin[];
  loading: boolean;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export function AdminTable({ admins, loading, onEdit, onDelete }: AdminTableProps) {

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
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>
      </div>

      <Table className="relative z-10">
        
        {/* 🔹 HEADER */}
        <TableHeader className="bg-accent/40 backdrop-blur border-b border-border/40">
          <TableRow>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Admin
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Role
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              City
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Batch
            </TableHead>
            <TableHead className="text-right text-xs font-semibold text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {/* 🔸 LOADING STATE */}
          {loading && (
            <TableSkeleton 
              row={
                <TableRow className="hover:bg-accent/30 transition">
                  <TableCell><Skeleton className="h-5 w-[140px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[70px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
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

          {/* 🔸 EMPTY STATE */}
          {!loading && admins.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-sm">No admins found</span>
                  <span className="text-xs opacity-60">
                    Try adjusting filters or search
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* 🔸 DATA */}
          {!loading && admins.map((admin) => {
            const adminBatch = admin.batch;
            const adminCity = admin.city;

            return (
              <TableRow
                key={admin.id}
                className="
                  border-b border-border/30
                  hover:bg-accent/30
                  transition-all
                "
              >
                {/* Name */}
                <TableCell>
                  <span className="
                    font-semibold text-foreground
                    truncate max-w-[180px] block
                  ">
                    {admin.name}
                  </span>
                </TableCell>

                {/* Email */}
                <TableCell className="
                  text-muted-foreground text-xs
                  truncate max-w-[200px]
                ">
                  {admin.email}
                </TableCell>

                {/* Role */}
                <TableCell>
                  <span className="
                    inline-flex items-center
                    px-3 py-1
                    rounded-full text-[10px] font-medium
                    bg-primary/20 text-primary
                    border border-primary/30
                  ">
                    {admin.role}
                  </span>
                </TableCell>

                {/* City */}
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {admin.role === 'SUPERADMIN'
                    ? <span className="opacity-40">—</span>
                    : adminCity?.city_name || <span className="opacity-40">Unassigned</span>}
                </TableCell>

                {/* Batch */}
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {admin.role === 'SUPERADMIN'
                    ? <span className="opacity-40">—</span>
                    : adminBatch?.batch_name || <span className="opacity-40">Unassigned</span>}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ActionButtons
                      onEdit={() => onEdit(admin)}
                      onDelete={() => onDelete(admin)}
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
