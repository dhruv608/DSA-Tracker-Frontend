"use client";

import React, { useState, useEffect } from 'react';
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
import { AlertTriangle, Edit, Save } from 'lucide-react';
import { updateAdminQuestion, getAllTopics } from '@/services/admin.service';
import { Question, UpdateQuestionData } from '@/types/admin/question.types';
import { ApiError } from '@/types/common/api.types';

interface UpdateQuestionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onSuccess: () => void;
}

export default function UpdateQuestion({
  open,
  onOpenChange,
  question,
  onSuccess
}: UpdateQuestionProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topics, setTopics] = useState<{ label: string, value: string }[]>([]);

  const [formData, setFormData] = useState({
    question_name: '',
    question_link: '',
    topic_id: '',
    level: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
    type: 'HOMEWORK' as 'HOMEWORK' | 'CLASSWORK'
  });

  useEffect(() => {
    if (open) loadTopics();
  }, [open]);

  useEffect(() => {
    if (question) {
      setFormData({
        question_name: question.question_name,
        question_link: question.question_link,
        topic_id: question.topic_id.toString(),
        level: question.level,
        type: question.type
      });
      setError('');
    }
  }, [question]);

interface Topic {
  id: number;
  topic_name: string;
}

  const loadTopics = async () => {
    try {
      const topicsData = await getAllTopics();
      const formattedTopics = topicsData.map((topic: Topic) => ({
        label: topic.topic_name,
        value: topic.id.toString()
      }));
      setTopics(formattedTopics);
    } catch (err) {
      // handleToastError(err);
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question || !formData.question_name || !formData.question_link || !formData.topic_id) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData: UpdateQuestionData = {
        question_name: formData.question_name,
        question_link: formData.question_link,
        topic_id: parseInt(formData.topic_id),
        level: formData.level,
        type: formData.type
      };

      await updateAdminQuestion(question.id, updateData);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      // Error is handled by API client interceptor
      const error = err as ApiError;
      setError(error.response?.data?.error || error.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-[520px] max:h-[90vh] p-0  rounded-2xl">

        {/* HEADER */}
        <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold">

            <div className="p-2 rounded bg-primary/10 border border-primary/20">
              <Edit className="w-4 h-4 text-primary" />
            </div>

            Edit Question
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Update the question details.
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

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div className="grid grid-cols-3 items-center gap-4">

              <Label className="text-s text-muted-foreground">
                Question Name
              </Label>

              <Input
                className="col-span-2 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                value={formData.question_name}
                onChange={(e) => handleInputChange('question_name', e.target.value)}
                placeholder="Enter question name"
                disabled={loading}
              />

            </div>

            {/* LINK */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-s text-muted-foreground">
                Question Link
              </Label>
              <Input
                className="col-span-2 h-11 rounded border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                value={formData.question_link}
                onChange={(e) => handleInputChange('question_link', e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                type="url"
                disabled={loading}
              />
            </div>

            {/* TOPIC */}
            <div className="space-y-2 overflow-y-auto no-scrollbar">
              <Label className="text-xs text-muted-foreground">
                Topic
              </Label>
              <Select
                value={formData.topic_id}
                onChange={(value: string | number) => handleInputChange('topic_id', value.toString())}
                options={topics}
                placeholder="Select topic"
                disabled={loading}
                className="h-11"
              />
            </div>

            {/* LEVEL + TYPE */}
            <div className="grid grid-cols-2 gap-4">

              {/* LEVEL */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Difficulty
                </Label>

                <div className="flex gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
                  {["EASY", "MEDIUM", "HARD"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleInputChange('level', lvl)}
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
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onChange={(value: string | number) => handleInputChange('type', value.toString())}
                  options={[
                    { label: 'Homework', value: 'HOMEWORK' },
                    { label: 'Classwork', value: 'CLASSWORK' }
                  ]}
                  disabled={loading}
                  className="h-11"
                />
              </div>

            </div>

            {/* FOOTER */}
            <DialogFooter className="pt-2 flex gap-2">

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
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
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
