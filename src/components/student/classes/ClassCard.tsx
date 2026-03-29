"use client";

import React from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/student/shared/ProgressBar";
import { Calendar, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

interface ClassCardProps {
  topicSlug: string;
  classSlug: string;
  index: number;
  classNameTitle: string;
  duration?: number;
  date?: string;
  totalQuestions: number;
  solvedQuestions: number;
  pdfUrl?: string;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  topicSlug,
  classSlug,
  index,
  classNameTitle,
  duration,
  date,
  totalQuestions,
  solvedQuestions,
  pdfUrl,
}) => {
  const progress =
    totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  const isCompleted = progress === 100 && totalQuestions > 0;

  return (
    <Link
      href={`/topics/${topicSlug}/classes/${classSlug}`}
      className="group flex bg-card border border-border/70 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-[2px]"
    >
      {/* LEFT NUMBER */}
      <div className="w-16 flex-shrink-0 flex items-center justify-center border-r border-border/50 bg-muted/30 group-hover:bg-primary/5 transition-colors">
        <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {index}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 flex flex-col justify-between">

        {/* TOP */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {classNameTitle}
          </h3>

          {isCompleted && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Done</span>
            </div>
          )}
        </div>

        {/* META */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          {date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {pdfUrl ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(pdfUrl, "_blank");
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-[11px] font-medium"
            >
              <FileText className="w-3.5 h-3.5" />
              Notes
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border/50 text-[11px] text-muted-foreground">
              <FileText className="w-3.5 h-3.5 opacity-70" />
              <span>No notes</span>
            </div>
          )}
        </div>

        {/* PROGRESS */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar progress={progress} className="h-1.5" />
          </div>

          <span className="text-[11px] font-medium text-muted-foreground">
            {solvedQuestions}/{totalQuestions}
          </span>

          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-105">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </Link>
  );
};
