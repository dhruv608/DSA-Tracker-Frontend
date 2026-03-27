"use client";

import React, { useState, useEffect } from "react";
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
import { AlertTriangle, Plus, Save } from "lucide-react";
import { createAdminQuestion, getAllTopics } from "@/services/admin.service";
import { CreateQuestionData } from "@/types/admin/question";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState<{ label: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    question_name: "",
    question_link: "",
    topic_id: "",
    level: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    type: "HOMEWORK" as "HOMEWORK" | "CLASSWORK",
  });

  useEffect(() => {
    if (open) loadTopics();
  }, [open]);

  useEffect(() => {
    if (open) {
      setFormData({
        question_name: "",
        question_link: "",
        topic_id: "",
        level: "MEDIUM",
        type: "HOMEWORK",
      });
      setError("");
    }
  }, [open]);

  const loadTopics = async () => {
    try {
      const topicsData = await getAllTopics();
      const formatted = topicsData.map((t: any) => ({
        label: t.topic_name,
        value: t.id.toString(),
      }));

      setTopics(formatted);

      if (formatted.length > 0 && !formData.topic_id) {
        setFormData((prev) => ({ ...prev, topic_id: formatted[0].value }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question_name || !formData.question_link || !formData.topic_id) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data: CreateQuestionData = {
        question_name: formData.question_name,
        question_link: formData.question_link,
        topic_id: parseInt(formData.topic_id),
        level: formData.level,
        type: formData.type,
      };

      await createAdminQuestion(data);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">

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
        <div className="p-6 space-y-6">

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC INFO */}
            <div className="p-5 rounded-2xl border border-border/50 bg-muted/20 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Basic Information
              </h3>

              <div className="space-y-2 flex justify-between text-base ">
                <div>
                <Label className="text-m text-muted-foreground ">
                  Question Title
                </Label>

                </div>
                <div>
                <Input
                  className="h-11 rounded border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                  value={formData.question_name}
                  onChange={(e) =>
                    handleChange("question_name", e.target.value)
                  }
                  placeholder="e.g. Two Sum"
                  disabled={loading}
                />

                </div>
              </div>

              <div className="space-y-2 flex justify-between text-base ">
                <div>
                <Label className="text-m text-muted-foreground">
                  Question Link
                </Label>
                </div>
                <div>
                <Input
                  className="h-11 rounded border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                  value={formData.question_link}
                  onChange={(e) =>
                    handleChange("question_link", e.target.value)
                  }
                  placeholder="https://leetcode.com/..."
                  type="url"
                  disabled={loading}
                />
                </div>
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
                <Select
                  value={formData.topic_id}
                  onChange={(val: string | number) =>
                    handleChange("topic_id", val.toString())
                  }
                  options={topics}
                  placeholder="Select topic"
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {/* 🔥 Difficulty (UPGRADED) */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Difficulty
                </Label>

                <div className="flex gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
                  {["EASY", "MEDIUM", "HARD"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleChange("level", lvl)}
                      className={`flex-1 py-2 text-xs font-semibold rounded transition-all ${formData.level === lvl
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* TYPE */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Distribution
                </Label>
                <Select
                  value={formData.type}
                  onChange={(val: string | number) =>
                    handleChange("type", val.toString())
                  }
                  options={[
                    { label: "Homework", value: "HOMEWORK" },
                    { label: "Classwork", value: "CLASSWORK" },
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
                disabled={
                  loading ||
                  !formData.question_name ||
                  !formData.question_link ||
                  !formData.topic_id
                }
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