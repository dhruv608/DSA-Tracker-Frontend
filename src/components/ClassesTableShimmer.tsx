import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ClassesTableShimmer() {
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-16 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-20 mx-auto" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="glass rounded-2xl p-5">
        <Skeleton className="h-8 w-48 mb-4" />
      </div>
      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="glass rounded-2xl overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-5 py-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Overview</TableHead>
              <TableHead>Class Date</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="text-center">Resources</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ClassesTableRowsShimmer() {
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-16 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-20 mx-auto" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </>
  );
}
