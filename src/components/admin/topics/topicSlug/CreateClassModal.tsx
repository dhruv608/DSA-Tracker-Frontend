"use client";

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PdfPreview } from '@/components/ui/PdfPreview';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";

interface CreateClassModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   batchSlug: string;
   topicSlug: string;
}

export default function CreateClassModal({ isOpen, onClose, onSuccess, batchSlug, topicSlug }: CreateClassModalProps) {
   const [className, setClassName] = useState('');
   const [description, setDescription] = useState('');
   const [pdfUrl, setPdfUrl] = useState('');
   const [pdfFile, setPdfFile] = useState<File | null>(null);
   const [duration, setDuration] = useState('');
   const [classDate, setClassDate] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   useEffect(() => {
      if (isOpen) {
         setClassDate(new Date().toISOString().substring(0, 10));
      }
   }, [isOpen]);

   const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.type !== 'application/pdf') {
            setFormError('Only PDF files are allowed');
            return;
         }
         if (file.size > 20 * 1024 * 1024) {
            setFormError('PDF file size must be less than 20MB');
            return;
         }
         setPdfFile(file);
         setPdfUrl('');
         setFormError('');
      }
   };

   const handlePdfRemove = () => {
      setPdfFile(null);
      setPdfUrl('');
      setFormError('');
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);
      try {
         const formData = new FormData();
         formData.append('class_name', className);
         formData.append('description', description);
         formData.append('duration_minutes', duration ? duration.toString() : '');
         formData.append('class_date', classDate);

         if (pdfFile) {
            formData.append('pdf_file', pdfFile);
         } else if (pdfUrl) {
            formData.append('pdf_url', pdfUrl);
         }

         await apiClient.post(`/api/admin/${batchSlug}/topics/${topicSlug}/classes`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         onClose();
         resetForm();
         onSuccess();
      } catch (err: any) {
         // Error is handled by API client interceptor
         setFormError(err.response?.data?.error || 'Failed to create class');
      } finally {
         setSubmitting(false);
      }
   };

   const resetForm = () => {
      setClassName('');
      setDescription('');
      setPdfUrl('');
      setPdfFile(null);
      setDuration('');
      setClassDate('');
      setFormError('');
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent
            className="sm:max-w-[520px] max-h-[90vh] rounded-3xl border border-white/10 
    bg-gradient-to-br from-background via-background/95 to-background/90 
    backdrop-blur-2xl p-0 shadow-2xl overflow-hidden flex flex-col"
         >
            <div className="flex-shrink-0 p-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
               <DialogHeader className="space-y-1">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                     Create Class Module
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                     Add a new class under <span className="font-medium text-foreground">{topicSlug}</span>
                  </DialogDescription>
               </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
               {formError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                     {formError}
                  </div>
               )}

               <div>
                  <label className="text-sm font-medium">
                     Class Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                     value={className}
                     onChange={(e) => setClassName(e.target.value)}
                     required
                     placeholder="Intro to Arrays"
                     disabled={submitting}
                     className="mt-1 w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
          focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     disabled={submitting}
                     placeholder="Optional details about this class."
                     className="mt-1 w-full h-24 px-3 py-2 rounded-2xl border border-border/40 
          bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
               </div>

               <div className="flex justify-between">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">
                        Duration <span className="text-xs text-muted-foreground">(min)</span>{" "}
                        <span className="text-destructive">*</span>
                     </label>
                     <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        placeholder="90"
                        disabled={submitting}
                        className="mt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
      focus:ring-2 focus:ring-primary/40 px-4"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">
                        Date <span className="text-destructive">*</span>
                     </label>
                     <div className="relative">
                        <Input
                           type="date"
                           value={classDate}
                           onChange={(e) => setClassDate(e.target.value)}
                           required
                           disabled={submitting}
                           className="mt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
        focus:ring-2 focus:ring-primary/40 px-4 pr-10 appearance-none"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">
                     PDF Content{" "}
                     <span className="text-xs text-muted-foreground">(Optional)</span>
                  </label>

                  <div>
                     <Input
                        type="url"
                        value={pdfUrl}
                        onChange={(e) => {
                           setPdfUrl(e.target.value);
                           setPdfFile(null);
                        }}
                        placeholder="Enter PDF URL (Google Drive, etc.)"
                        disabled={submitting}
                        className="w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                    focus:ring-2 focus:ring-primary/40"
                     />
                  </div>

                  <div className="text-center">
                     <span className="text-xs text-muted-foreground font-medium">OR</span>
                  </div>

                  <div>
                     <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfFileChange}
                        disabled={submitting}
                        id="pdf-file-input-create"
                        className="hidden"
                     />
                     <label
                        htmlFor="pdf-file-input-create"
                        className="flex items-center justify-center w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                    hover:bg-muted/40 cursor-pointer transition-colors"
                     >
                        <span className="text-sm font-medium">
                           Choose PDF File
                        </span>
                     </label>
                  </div>

                  {pdfFile && <PdfPreview file={pdfFile} onRemove={handlePdfRemove} />}
               </div>

               <DialogFooter className="pt-5 flex justify-between items-center border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                     * Required fields
                  </span>

                  <div className="flex gap-3">
                     <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={submitting}
                        className="rounded-xl px-5"
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl px-6 bg-primary hover:bg-primary/90 
            shadow-lg shadow-primary/20 transition-all"
                     >
                        {submitting ? "Creating..." : "Create Class"}
                     </Button>
                  </div>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
