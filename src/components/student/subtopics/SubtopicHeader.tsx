"use client";

import React from "react";
import { ProgressBar } from "../shared/ProgressBar";

interface SubtopicHeaderProps {
  topic: any;
  progress: number;
}

export function SubtopicHeader({ topic, progress }: SubtopicHeaderProps) {
  const hasImage = !!topic.photo_url;

  return (
    <div className="bg-card border border-border/70 rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row">

      {/* LEFT VISUAL */}
      <div className="md:w-1/3 h-[160px] md:h-auto">
        {hasImage ? (
          <img
            src={topic.photo_url}
            alt={topic.topic_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted" /> // 👈 CLEAN fallback (no circle, no gradient)
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {topic.topic_name}
          </h1>

          {topic.description && (
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
              {topic.description}
            </p>
          )}
        </div>

        {/* STATS + PROGRESS */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-border">

          {/* STATS */}
          <div className="flex items-center gap-5">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase">Classes</p>
              <p className="text-lg font-semibold">
                {topic.classes?.length || 0}
              </p>
            </div>

            <div className="w-[1px] h-6 bg-border" />

            <div>
              <p className="text-[11px] text-muted-foreground uppercase">Questions</p>
              <p className="text-lg font-semibold">
                {topic.overallProgress?.totalQuestions || 0}
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="flex-1 sm:ml-auto w-full sm:max-w-[240px]">
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span>
                {topic.overallProgress?.solvedQuestions || 0} /{" "}
                {topic.overallProgress?.totalQuestions || 0}
              </span>
            </div>

            <ProgressBar progress={progress} className="h-2" />
          </div>
        </div>

      </div>
    </div>
  );
}
