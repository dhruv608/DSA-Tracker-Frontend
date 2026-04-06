"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import { InfiniteScrollDropdown } from "@/components/ui/InfiniteScrollDropdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { bulkUploadQuestions } from '@/services/admin.service';
import { handleToastError } from "@/utils/toast-system";

// CSV validation interface
interface CSVRow {
  question_name: string;
  question_link: string;
  level: 'EASY' | 'MEDIUM' | 'HARD';
  type: 'HOMEWORK' | 'CLASSWORK';
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validRows: CSVRow[];
  totalRows: number;
}

export default function BulkUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: any) {

  const [file, setFile] = useState<File | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [csvValidated, setCsvValidated] = useState(false);

  const [showGuide, setShowGuide] = useState(false);

  // CSV parsing and validation function
  const parseAndValidateCSV = useCallback((file: File): Promise<ValidationResult> => {
    const errors: string[] = [];
    const validRows: CSVRow[] = [];
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          // Check if file has header
          if (lines.length === 0) {
            errors.push('CSV file is empty');
            resolve({ isValid: false, errors, validRows, totalRows: 0 });
            return;
          }
          
          const header = lines[0].toLowerCase().replace(/\s/g, '');
          const expectedHeader = 'question_name,question_link,level,type';
          
          if (header !== expectedHeader) {
            errors.push(`Invalid header. Expected: "question_name,question_link,level,type"`);
          }
          
          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parse CSV properly (handle quoted commas)
            const result = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
            const cleanColumns = result.map(col => col.replace(/^"|"$/g, '').trim());
            
            if (cleanColumns.length !== 4) {
              errors.push(`Row ${i + 1}: Invalid format. Expected 4 columns, got ${cleanColumns.length}`);
              continue;
            }
            
            const [question_name, question_link, level, type] = cleanColumns;
            
            // Validate required fields
            if (!question_name) {
              errors.push(`Row ${i + 1}: Question name is required`);
              continue;
            }
            
            if (!question_link) {
              errors.push(`Row ${i + 1}: Question link is required`);
              continue;
            }
            
            // Validate URL format (basic check)
            if (!question_link.startsWith('http')) {
              errors.push(`Row ${i + 1}: Invalid question link format`);
              continue;
            }
            
            // Validate level
            if (!['EASY', 'MEDIUM', 'HARD'].includes(level.toUpperCase())) {
              errors.push(`Row ${i + 1}: Invalid level "${level}". Must be EASY, MEDIUM, or HARD`);
              continue;
            }
            
            // Validate type
            if (!['HOMEWORK', 'CLASSWORK'].includes(type.toUpperCase())) {
              errors.push(`Row ${i + 1}: Invalid type "${type}". Must be HOMEWORK or CLASSWORK`);
              continue;
            }
            
            validRows.push({
              question_name,
              question_link,
              level: level.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD',
              type: type.toUpperCase() as 'HOMEWORK' | 'CLASSWORK'
            });
          }
          
          resolve({
            isValid: errors.length === 0 && validRows.length > 0,
            errors,
            validRows,
            totalRows: lines.length - 1
          });
          
        } catch (error) {
          errors.push('Failed to parse CSV file');
          resolve({ isValid: false, errors, validRows: [], totalRows: 0 });
        }
      };
      
      reader.onerror = () => {
        errors.push('Failed to read file');
        resolve({ isValid: false, errors, validRows: [], totalRows: 0 });
      };
      
      reader.readAsText(file);
    });
  }, []);
  
  // Handle file change
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      setValidationResult(null);
      setCsvValidated(false);
      return;
    }
    
    // Check file type
    if (!f.name.endsWith('.csv')) {
      setValidationResult({
        isValid: false,
        errors: ['Please upload a CSV file'],
        validRows: [],
        totalRows: 0
      });
      setCsvValidated(true);
      setFile(f);
      return;
    }
    
    setFile(f);
    setLoading(true);
    
    try {
      const result = await parseAndValidateCSV(f);
      setValidationResult(result);
      setCsvValidated(true);
      setCsvData(result.validRows);
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: ['Failed to validate CSV'],
        validRows: [],
        totalRows: 0
      });
      setCsvValidated(true);
    } finally {
      setLoading(false);
    }
  }, [parseAndValidateCSV]);
  
  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!file || !selectedTopic || !validationResult?.isValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('topic_id', selectedTopic);
      
      await bulkUploadQuestions(formData);
      
      // Reset form and close modal
      setFile(null);
      setSelectedTopic('');
      setValidationResult(null);
      setCsvValidated(false);
      setCsvData([]);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
      
    } catch (error) {
      handleToastError(error);
    } finally {
      setLoading(false);
    }
  }, [file, selectedTopic, validationResult, onSuccess, onOpenChange]);
  
  const handleClose = () => {
    if (!loading) onOpenChange(false);
  };
  
  const isUploadDisabled = !file || !selectedTopic || loading || !csvValidated || !validationResult?.isValid;

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

              <InfiniteScrollDropdown
                value={selectedTopic}
                onValueChange={(value) => setSelectedTopic(String(value))}
                placeholder="Select topic"
                searchPlaceholder="Search topics..."
                className="h-11"
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
                  onChange={handleFileChange}
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

            {/* CSV VALIDATION STATUS */}
            {csvValidated && validationResult && (
              <div className={`rounded-xl p-4 border ${validationResult.isValid 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <div className="flex items-start gap-3">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="space-y-2">
                    <p className="font-medium">
                      {validationResult.isValid 
                        ? `CSV Valid - ${validationResult.validRows.length} questions ready to upload`
                        : 'CSV Validation Failed'
                      }
                    </p>
                    
                    {!validationResult.isValid && validationResult.errors.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Errors found:</p>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          {validationResult.errors.slice(0, 5).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {validationResult.errors.length > 5 && (
                            <li className="text-muted-foreground">
                              ...and {validationResult.errors.length - 5} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {validationResult.isValid && validationResult.validRows.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <p className="text-sm">
                          Ready to create {validationResult.validRows.length} questions
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
              onClick={handleUpload}
              className="w-full h-12 text-sm font-semibold bg-primary"
            >
              {loading ? "Creating Questions..." : "Create Questions"}
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
