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
import { Link as LinkIcon } from 'lucide-react';

interface EditClassModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   batchSlug: string;
   topicSlug: string;
   classData: any;
}

export default function EditClassModal({ isOpen, onClose, onSuccess, batchSlug, topicSlug, classData }: EditClassModalProps) {
   const [className, setClassName] = useState('');
   const [description, setDescription] = useState('');
   const [pdfUrl, setPdfUrl] = useState('');
   const [pdfFile, setPdfFile] = useState<File | null>(null);
   const [showReplaceInputs, setShowReplaceInputs] = useState(false);
   const [duration, setDuration] = useState('');
   const [classDate, setClassDate] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   const isS3Pdf = (url: string) => {
      return url?.includes('amazonaws.com/class-pdfs/');
   };

   useEffect(() => {
      if (classData) {
         setClassName(classData.class_name);
         setDescription(classData.description || '');
         setPdfUrl('');
         setPdfFile(null);
         setDuration(classData.duration_minutes?.toString() || '');
         setClassDate(classData.class_date ? classData.class_date.substring(0, 10) : new Date().toISOString().substring(0, 10));
         setFormError('');
         setShowReplaceInputs(false);
      }
   }, [classData]);

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
         formData.append('duration_minutes', duration);
         formData.append('class_date', classDate);

         if (pdfFile) {
            formData.append('pdf_file', pdfFile);
         } else if (pdfUrl) {
            formData.append('pdf_url', pdfUrl);
         }

         await apiClient.patch(`/api/admin/${batchSlug}/topics/${topicSlug}/classes/${classData.slug}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         onClose();
         resetForm();
         onSuccess();
      } catch (err: any) {
         // Error is handled by API client interceptor
         setFormError(err.response?.data?.error || 'Failed to update class');
      } finally {
         setSubmitting(false);
      }
   };

   const resetForm = () => {
      setClassName('');
      setDescription('');
      setPdfUrl('');
      setPdfFile(null);
      setShowReplaceInputs(false);
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
                     Update Class Details
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                     Modify class attributes directly.
                  </DialogDescription>
               </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
               {formError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                     {formError}
                  </div>
               )}

               <div className="space-y-2 ">
                  <label className="text-sm font-medium">
                     Class Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                     value={className}
                     onChange={(e) => setClassName(e.target.value)}
                     required
                     placeholder="e.g. Intro to Arrays"
                     disabled={submitting}
                     className="w-full pt-1 h-11 rounded-2xl bg-muted/30 border border-border/40 
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
                     className="w-full h-24 px-3 py-2 rounded-2xl border border-border/40 
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
                        className=" pt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
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
                           className="pt-1 h-12 rounded-2xl bg-muted/30 border border-border/40 
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

                  {classData?.pdf_url && !pdfFile && !pdfUrl && (
                     <div className="p-3 bg-muted/20 rounded-xl border border-border/40">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              {isS3Pdf(classData.pdf_url) ? (
                                 <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                                    <span className="text-red-500 text-xs font-bold">PDF</span>
                                 </div>
                              ) : (
                                 <LinkIcon className="w-4 h-4 text-blue-500" />
                              )}
                              <div>
                                 <p className="text-sm font-medium">
                                    {isS3Pdf(classData.pdf_url) ? 'Current PDF' : 'External Link'}
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    {isS3Pdf(classData.pdf_url) ? 'Stored in S3' : 'External URL'}
                                 </p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button
                                 type="button"
                                 onClick={() => window.open(classData.pdf_url, '_blank')}
                                 className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded hover:bg-blue-500/20"
                              >
                                 View
                              </button>
                              <button
                                 type="button"
                                 onClick={() => {
                                    setShowReplaceInputs(true);
                                 }}
                                 className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20"
                              >
                                 Replace
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {(!classData?.pdf_url || showReplaceInputs || pdfFile || pdfUrl) && (
                     <div className="space-y-3">
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
                              id="pdf-file-input-edit"
                              className="hidden"
                           />
                           <label
                              htmlFor="pdf-file-input-edit"
                              className="flex items-center justify-center w-full h-11 rounded-2xl bg-muted/30 border border-border/40 
                        hover:bg-muted/40 cursor-pointer transition-colors"
                           >
                              <span className="text-sm font-medium">
                                 Choose PDF File
                              </span>
                           </label>
                        </div>
                     </div>
                  )}

                  {pdfFile && <PdfPreview file={pdfFile} onRemove={handlePdfRemove} />}

                  {pdfUrl && !pdfFile && (
                     <div className="mt-3 p-3 bg-muted/20 rounded-xl border border-border/40">
                        <div className="flex items-center gap-3">
                           <LinkIcon className="w-4 h-4 text-blue-500" />
                           <div className="flex-1">
                              <p className="text-sm font-medium">External Link</p>
                              <p className="text-xs text-muted-foreground truncate">
                                 {pdfUrl}
                              </p>
                           </div>
                           <button
                              type="button"
                              onClick={() => window.open(pdfUrl, '_blank')}
                              className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded hover:bg-blue-500/20"
                           >
                              Open
                           </button>
                        </div>
                     </div>
                  )}
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
                     {submitting ? "Saving..." : "Save Changes"}
                  </Button>
               </div>
            </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
