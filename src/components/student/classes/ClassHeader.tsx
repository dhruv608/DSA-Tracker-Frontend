"use client";

import React from 'react';
import { Badge } from '../shared/Badge';
import { ProgressBar } from '../shared/ProgressBar';
import { Calendar, Clock, FileText } from 'lucide-react';

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
    formattedDate
}: ClassHeaderProps) {
    return (
        <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-2.5 py-1">
                    CLASS DETAILS
                </Badge>
                {formattedDate && (
                    <span className="text-[13px] text-muted-foreground font-mono flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {formattedDate}
                    </span>
                )}
                {classData.duration_minutes && (
                    <span className="text-[13px] text-muted-foreground font-mono flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {classData.duration_minutes} min
                    </span>
                )}
            </div>

            <h1 className="font-serif italic text-3xl sm:text-[38px] font-bold text-foreground mb-4">
                {classData.class_name}
            </h1>

            {classData.description && (
                <p className="text-[14.5px] text-muted-foreground mb-6 max-w-3xl leading-relaxed">
                    {classData.description}
                </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-6 pt-6 border-t border-border">
                <div className="sm:w-[280px]">
                    <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1.5 uppercase tracking-widest">
                        <span>Class Progress</span>
                        <span className={solvedQuestions === totalQuestions && totalQuestions > 0 ? "text-emerald-500" : ""}>
                            {solvedQuestions} / {totalQuestions}
                        </span>
                    </div>
                    <ProgressBar progress={progress} showLabel />
                </div>

                {classData.pdf_url && (
                    <div className="sm:ml-auto">
                        <a
                            href={classData.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border-2 border-primary/30 text-primary rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/50 transition-all text-[13.5px]"
                        >
                            <FileText className="w-4 h-4" /> Open Class Notes
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}