"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from 'lucide-react';
import { deleteAdminQuestion } from '@/services/admin.service';
import { Question } from '@/types/admin/question';
import { handleToastError } from "@/utils/toast-system";

interface DeleteQuestionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onSuccess: () => void;
}

export default function DeleteQuestion({
  open,
  onOpenChange,
  question,
  onSuccess
}: DeleteQuestionProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!question) return;

    setLoading(true);
    setError('');

    try {
      await deleteAdminQuestion(question.id);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      handleToastError(err);
      setError(err.response?.data?.error || err.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };
  console.log(process.env.NEXT_PUBLIC_MY_LINK);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-2xl">

        {/* HEADER */}
        <DialogHeader className="px-6 py-5 bg-red-500/5 border-b border-red-500/10">
          <DialogTitle className="flex items-center gap-3 text-red-500 font-semibold">

            <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>

            Delete Question
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* QUESTION INFO */}
          {question && (
            <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-muted-foreground">Question</span>
                <span className="font-medium text-right max-w-[65%] truncate">
                  {question.question_name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Topic</span>
                <span className="font-medium">
                  {question.topic?.topic_name || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{question.level}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">
                  {question.type.toLowerCase()}
                </span>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* WARNING */}
          <div className="flex gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
            <AlertTriangle className="w-4 h-4 mt-[2px]" />
            <div>
              <p className="font-semibold mb-1">Important</p>
              <p className="text-[13px]">
                You cannot delete questions assigned to classes or with student progress.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex gap-2 pt-2">

            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-11 rounded"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="h-11 w-full font-semibold rounded transition-all hover:scale-[1.02] active:scale-[0.97]"
            >
              {loading ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Question
                </>
              )}
            </Button>

          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
