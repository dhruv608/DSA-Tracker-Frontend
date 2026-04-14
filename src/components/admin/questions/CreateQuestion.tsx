"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import { InfiniteScrollDropdown } from "@/components/ui/InfiniteScrollDropdown";
import { AlertTriangle, Plus, Save } from "lucide-react";
import { createAdminQuestion } from "@/services/admin.service";
import { createQuestionSchema } from "@/schemas/question.schema";
import { z } from "zod";

interface CreateQuestionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateQuestion({
  open,
  onOpenChange,
  onSuccess,
}: CreateQuestionProps) {
  type FormData = z.infer<typeof createQuestionSchema>;
  
  const form = useForm<FormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question_name: "",
      question_link: "",
      topic_id: 0,
      level: "MEDIUM",
      platform: "LEETCODE",
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (open) {
      form.reset({
        question_name: "",
        question_link: "",
        topic_id: 0,
        level: "MEDIUM",
        platform: "LEETCODE",
      });
      setError("");
    }
  }, [open, form]);

  const handleSubmit = async (values: FormData) => {
    setLoading(true);
    setError("");

    try {
      await createAdminQuestion(values);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  const formErrors = form.formState.errors;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] h-[95vh] p-0 overflow-hidden rounded-2xl">

        {/* HEADER */}
        <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold">

            <div className="p-2 rounded bg-primary/10 border border-primary/20">
              <Plus className="w-4 h-4 text-primary" />
            </div>

            Add Question
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Add a new problem to the global question bank.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* BASIC INFO */}
            <div className="p-5  rounded-2xl border border-border/50 bg-muted/20 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Basic Information
              </h3>

              <div className="space-y-2">
                <Label className="text-m text-muted-foreground ">
                  Question Title
                </Label>
                <Input
                  className={`h-11 rounded border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    formErrors.question_name ? 'border-red-500' : ''
                  }`}
                  {...form.register('question_name')}
                  placeholder="e.g. Two Sum"
                  disabled={loading}
                />
                {formErrors.question_name && (
                  <p className="text-xs text-red-400">{formErrors.question_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-m text-muted-foreground">
                  Question Link
                </Label>
                <Input
                  className={`h-11 rounded border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    formErrors.question_link ? 'border-red-500' : ''
                  }`}
                  {...form.register('question_link')}
                  placeholder="https://leetcode.com/..."
                  type="url"
                  disabled={loading}
                />
                {formErrors.question_link && (
                  <p className="text-xs text-red-400">{formErrors.question_link.message}</p>
                )}
              </div>
            </div>

            {/* CONFIG */}
            <div className="p-5 rounded-2xl border border-border/50 bg-muted/20 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Configuration
              </h3>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Topic
                </Label>
                <InfiniteScrollDropdown
                  value={form.watch('topic_id')?.toString() || ""}
                  onValueChange={(value) => {
                    form.setValue('topic_id', parseInt(value) || 0);
                    form.trigger('topic_id');
                  }}
                  placeholder="Select topic"
                  searchPlaceholder="Search topics..."
                  className="h-11"
                  returnId={true}
                />
                {formErrors.topic_id && (
                  <p className="text-xs text-red-400">{formErrors.topic_id.message}</p>
                )}
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Difficulty
                </Label>
                <div className="flex gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
                  {["EASY", "MEDIUM", "HARD"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        form.setValue('level', lvl as "EASY" | "MEDIUM" | "HARD");
                        form.trigger('level');
                      }}
                      className={`flex-1 py-2 text-xs font-semibold rounded transition-all ${form.watch('level') === lvl
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Platform
                </Label>
                <Select
                  value={form.watch('platform') || "LEETCODE"}
                  onChange={(val: string | number) => {
                    form.setValue('platform', val.toString() as "LEETCODE" | "GFG" | "INTERVIEWBIT" | "OTHER");
                    form.trigger('platform');
                  }}
                  options={[
                    { label: "LeetCode", value: "LEETCODE" },
                    { label: "GeeksforGeeks", value: "GFG" },
                    { label: "InterviewBit", value: "INTERVIEWBIT" },
                    { label: "Other", value: "OTHER" },
                  ]}
                  disabled={loading}
                  className="h-11"
                />
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
                type="submit"
                disabled={loading || !form.formState.isValid}
                className="h-11 w-full font-semibold rounded transition-all hover:scale-[1.02] active:scale-[0.97]"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Question
                  </>
                )}
              </Button>

            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
