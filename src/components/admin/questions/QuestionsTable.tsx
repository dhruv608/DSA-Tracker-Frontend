"use client";

import React from 'react';
import { Pencil, Trash2, ExternalLink, Code, BookOpen, Brain, HelpCircle } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/Pagination';

interface QuestionsTableProps {
  questions: any[];
  loading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onEdit: (question: any) => void;
  onDelete: (question: any) => void;
}

function TypeBadge({ type }: { type: string }) {
  const isHomework = type === "HOMEWORK";

  return (
    <div
      className={`flex items-center gap-2  py-1 rounded-full text-xs font-medium w-fit text-muted-foreground`}
    >
      {type}
    </div>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const config = {
    EASY: {
      color: "text-muted-foreground border-0",
    },
    MEDIUM: {
      color: "text-muted-foreground border-0",
    },
    HARD: {
      color: "text-muted-foreground border-0",
    },
  };

  const item = config[level as keyof typeof config];

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${item.color}`}
    >
      {level}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const config: any = {
    LEETCODE: {
      icon: LeetCodeIcon,
      color: " text-leetcode border-0",
    },
    GFG: {
      icon: GeeksforGeeksIcon,
      color: " text-gfg border-0 ",
    },
    INTERVIEWBIT: {
      icon: Brain,
      color: "text-[#3B82F6] border-0",
    },
    OTHER: {
      icon: HelpCircle,
      color: " text-muted-foreground border-0",
    },
  };

  const item = config[platform] || config.OTHER;
  const Icon = item.icon;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${item.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-muted-foreground">{platform}</span>
    </div>
  );
}

export default function QuestionsTable({
  questions,
  loading,
  page,
  limit,
  totalPages,
  totalRecords,
  setPage,
  setLimit,
  onEdit,
  onDelete,
}: QuestionsTableProps) {
  return (
    <div className="glass backdrop-blur-2xl  px-4 mb-7  rounded-2xl overflow-hidden">
      <div className="rounded-2xl  overflow-hidden">
        <ScrollArea className="max-h-[600px]">
          <Table className='border-0'>
            {/* HEADER */}
            <TableHeader>
              <TableRow className="bg-muted/30 border-b  p-6">
                <TableHead className="text-s font-bold uppercase tracking-wide text-muted-foreground">
                  Question
                </TableHead>
                <TableHead className="text-s font-bold uppercase tracking-wide text-muted-foreground">
                  Difficulty
                </TableHead>
                <TableHead className="text-s font-bold uppercase tracking-wide text-muted-foreground">
                  Topic
                </TableHead>
                <TableHead className="text-s font-bold uppercase tracking-wide text-muted-foreground">
                  Platform
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody>
              {/* LOADING */}
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <TableRow key={i} className="border-b border-border/20">
                    <TableCell><Skeleton className="h-4 w-[220px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : questions.length === 0 ? (
                /* EMPTY STATE */
                <TableRow>
                  <TableCell colSpan={6} className="py-24 text-center text-muted-foreground">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q) => (
                  <TableRow
                    key={q.id}
                    className="  hover:bg-muted/30 transition-all duration-200"
                  >
                    {/* QUESTION */}
                    <TableCell className="font-medium">
                      <a
                        href={q.question_link}
                        target="_blank"
                        className="flex items-center gap-2 hover:text-primary transition"
                      >
                        <span className="line-clamp-1">
                          {q.question_name}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition" />
                      </a>
                    </TableCell>


                    <TableCell>
                      <DifficultyBadge level={q.level} />
                    </TableCell>

                    {/* TOPIC */}
                    <TableCell className="text-muted-foreground text-sm">
                      {q.topic?.topic_name}
                    </TableCell>

                    {/* PLATFORM */}
                    <TableCell>
                      <PlatformBadge platform={q.platform} />
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(q)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(q)}
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
        </ScrollArea>
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
