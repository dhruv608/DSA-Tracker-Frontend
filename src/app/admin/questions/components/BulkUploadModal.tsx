"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getAllTopics } from '@/services/admin.service';
import { handleError } from "@/utils/handleError";

export default function BulkUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: any) {

  const [file, setFile] = useState<File | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [topics, setTopics] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const [showGuide, setShowGuide] = useState(false);

  // Fetch topics when modal opens
  useEffect(() => {
    const fetchTopics = async () => {
      if (!open) return;
      
      console.log('🔍 Fetching topics...');
      setTopicsLoading(true);
      
      try {
        console.log('📡 Calling getAllTopics API...');
        const topicsData = await getAllTopics();
        console.log('✅ Topics received:', topicsData);
        
        // Format topics for Select component
        const formattedTopics = topicsData.map((topic: any) => ({
          label: topic.topic_name,
          value: topic.id.toString()
        }));
        
        console.log('📋 Formatted topics for dropdown:', formattedTopics);
        setTopics(formattedTopics);
        
      } catch (error: any) {
        handleError(error);
        console.error('❌ Error fetching topics:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, [open]);

  const handleClose = () => {
    if (!loading) onOpenChange(false);
  };

  const isUploadDisabled = !file || !!validationError || loading || !selectedTopic;

  return (
    <>
      {/* MAIN MODAL */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw]   max-w-[1500px] p-0 overflow-hidden flex flex-col rounded-2xl">

          {/* HEADER */}
          <DialogHeader className="px-6 py-5 bg-muted/40">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Bulk Upload Questions
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Upload multiple questions quickly using CSV.
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* TOPIC */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Topic <span className="text-red-500">*</span>
              </Label>

              <Select
                value={selectedTopic}
                onChange={(value) => setSelectedTopic(String(value))}
                options={[
                  { label: 'Choose a topic...', value: '' },
                  ...topics
                ]}
                className="h-12"
              />
            </div>

            {/* FILE INPUT */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">CSV File</Label>

              <label className="w-full flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer bg-muted/30 hover:bg-muted/50 border border-border/50 transition">

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-primary/10">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : "Upload your CSV file"}
                  </span>
                </div>

                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded">
                  Browse
                </span>

                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* GUIDE BUTTON */}
            <div className="flex items-center justify-between rounded-2xl px-4 py-3 bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">
                Not sure about CSV format?
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuide(true)}
                className="rounded"
              >
                <FileText className="w-4 h-4 mr-1" />
                View Format Guide
              </Button>
            </div>

            {/* STATUS */}
            {validationError && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                <AlertCircle className="w-4 h-4" />
                {validationError}
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                <AlertCircle className="w-4 h-4" />
                {uploadError}
              </div>
            )}

            {csvData.length > 0 && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                {csvData.length} questions ready to upload
              </div>
            )}

          </div>

          {/* FOOTER */}
          <DialogFooter className="px-6 py-4 border-t flex gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              disabled={isUploadDisabled}
              className="w-full h-12 text-sm font-semibold bg-primary"
            >
              {loading ? "Uploading..." : "Upload Questions"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* GUIDE MODAL */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="w-[95vw] max-w-[920px] p-0 overflow-hidden rounded-2xl">

          {/* HEADER */}
          <DialogHeader className="px-6 py-4 bg-muted/40">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="w-5 h-5 text-primary" />
              CSV Format Guide
            </DialogTitle>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* REQUIRED COLUMNS */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Required Columns
              </p>

              <div className="bg-background rounded-lg p-4 text-sm font-mono overflow-x-auto">
                question_name, question_link, level, type
              </div>
            </div>

            {/* RULES */}
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl p-4 bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-sm font-semibold">EASY / MEDIUM / HARD</p>
              </div>

              <div className="rounded-xl p-4 bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-semibold">HOMEWORK / CLASSWORK</p>
              </div>

            </div>

            {/* EXAMPLE */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Example Row
              </p>

              <div className="bg-background rounded-lg p-4 text-sm font-mono overflow-x-auto">
                "Two Sum", "https://leetcode.com/problems/two-sum/", "EASY", "HOMEWORK"
              </div>
            </div>

            {/* WARNING */}
            <div className="flex items-start gap-3 rounded-lg border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p>
                Do <span className="font-semibold">NOT</span> include topic in CSV.
                Always select topic using dropdown.
              </p>
            </div>

          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setShowGuide(false)}>
              Close
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}