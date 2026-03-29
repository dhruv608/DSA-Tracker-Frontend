"use client";

import React from "react";
import { Badge } from "../shared/Badge";
import { ProgressBar } from "../shared/ProgressBar";
import { Calendar, Clock } from "lucide-react";

interface ClassHeaderProps {
  classData: any;
  progress: number;
  solvedQuestions: number;
  totalQuestions: number;
  formattedDate?: string | null;
}

export function ClassHeader({
  classData,
  progress,
  solvedQuestions,
  totalQuestions,
  formattedDate,
}: ClassHeaderProps) {
  return (
    <div className="mb-8">

      {/* META */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs">
          CLASS DETAILS
        </Badge>

        {formattedDate && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
        )}

        {classData.duration_minutes && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {classData.duration_minutes} min
          </div>
        )}
      </div>

      {/* TITLE */}
      <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-2 leading-tight">
        {classData.class_name}
      </h1>

      {/* DESCRIPTION */}
      {classData.description && (
        <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-2xl">
          {classData.description}
        </p>
      )}

      {/* 🔥 CONNECTED PROGRESS BLOCK */}
      <div className="max-w-md">

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="uppercase tracking-wide">Progress</span>

          <div className="flex items-center gap-2">
            <span>
              {solvedQuestions}/{totalQuestions}
            </span>
            <span className="text-primary font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <ProgressBar progress={progress} className="h-2" />
      </div>

    </div>
  );
}
