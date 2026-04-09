"use client";

import React from 'react';
import Link from "next/link";
import { FolderEdit, Trash2, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from '@/components/Pagination';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminStudent } from '@/types/student';

interface StudentsTableProps {
  students: AdminStudent[];
  loading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onEdit: (student: AdminStudent) => void;
  onDelete: (student: AdminStudent) => void;
}

export default function StudentsTable({
  students,
  loading,
  page,
  limit,
  totalPages,
  totalRecords,
  setPage,
  setLimit,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  return (
    <div className="glass backdrop-blur-2xl p-3 mb-7 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/40">
              <TableHead>Student</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-center">Solved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {loading ? (
              // Loading Skeleton Rows
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={`skeleton-${i}`} className="border-b border-border/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-6 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-[300px] text-center text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-b border-border/20 hover:bg-muted/30 transition"
                >
                  {/* STUDENT */}
                  <TableCell>
                    <Link
                      href={`/profile/${student.username}`}
                      target="_blank"
                      className="flex items-center gap-3"
                    >
                      <Avatar
                        name={student.name}
                        profileImageUrl={student.profile_image_url}
                        username={student.username}
                        size="sm"
                      />

                      <div className="flex flex-col">
                        <span className="font-medium hover:text-primary transition flex items-center gap-1">
                          {student.name}
                          <ExternalLink className="w-3 h-3 opacity-40 hover:opacity-100" />
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {student.email}
                        </span>
                      </div>
                    </Link>
                  </TableCell>

                  {/* USERNAME */}
                  <TableCell className="text-sm text-muted-foreground">
                    @{student.username}
                  </TableCell>

                  {/* SOLVED */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-primary/70" />
                      <span className="font-semibold text-foreground">
                        {student.totalSolved || 0}
                      </span>
                    </div>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-70 hover:opacity-100 transition">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                        className="h-8 w-8 rounded-lg hover:bg-primary/10"
                      >
                        <FolderEdit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(student);
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="p-4 border-t border-border/40">
        <Pagination
          currentPage={page}
          totalItems={totalRecords}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          showLimitSelector={true}
          loading={loading}
        />
      </div>
    </div>
  );
}
