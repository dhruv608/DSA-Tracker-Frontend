"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ClassBackNav } from '@/components/student/classes/ClassBackNav';

export function ClassDetailsShimmer() {
  return (
    <div className="flex flex-col mx-auto max-w-325 xl:max-w-275 w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Back Nav Button */}
      <ClassBackNav topicSlug="" topicName="Topic" />

      {/* Class Header Shimmer */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 glass backdrop-blur-3xl sm:p-6 shadow-sm space-y-4">

        {/* TOP META ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* LEFT META */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Badge Shimmer */}
            <Skeleton className="h-5 w-24" />

            {/* Date Shimmer */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>

            {/* Duration Shimmer */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>

          {/* RIGHT ACTION */}
          <Skeleton className="w-20 h-8" />
        </div>

        {/* TITLE + INLINE PROGRESS */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* TITLE */}
          <Skeleton className="h-10 w-3/4" />

          {/* 🔥 RIGHT SIDE PROGRESS */}
          <div className="w-full lg:w-[260px] border border-border/40 p-4 backdrop-blur-3xl rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <Skeleton className="w-12 h-3" />
              <Skeleton className="w-8 h-3" />
            </div>
            <Skeleton className="w-full h-2" />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Filter Bar Shimmer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 rounded-2xl glass bg-background/40 backdrop-blur-xl">
        {/* LEFT */}
        <Skeleton className="w-[150px] h-9" />

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-8 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>

      {/* Question Rows Shimmer */}
      <div className="flex flex-col gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 glass border-border/60">
              {/* LEFT */}
              <div className="flex items-start gap-4">
                {/* PLATFORM LOGO */}
                <div className="shrink-0 mt-0.5">
                  <Skeleton className="w-3.5 h-3.5" />
                </div>

                {/* TEXT BLOCK */}
                <div className="flex flex-col gap-2">
                  {/* TITLE */}
                  <Skeleton className="h-4 w-48" />

                  {/* TOPIC */}
                  <Skeleton className="h-3 w-32" />

                  {/* META ROW */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* LEVEL */}
                    <Skeleton className="w-12 h-5 rounded-2xl" />

                    {/* PLATFORM */}
                    <Skeleton className="w-20 h-5 rounded-2xl" />

                    {/* TYPE */}
                    <Skeleton className="w-16 h-5 rounded-2xl" />
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">
                {/* BOOKMARK */}
                <Skeleton className="w-8 h-8 rounded-2xl" />

                {/* CTA */}
                <Skeleton className="w-16 h-8 rounded-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Shimmer */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
  );
}
