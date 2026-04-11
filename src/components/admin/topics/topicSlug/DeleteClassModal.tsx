"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { deleteAdminClass } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react';

interface DeleteClassModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   batchSlug: string;
   topicSlug: string;
   classData: any;
}

export default function DeleteClassModal({ isOpen, onClose, onSuccess, batchSlug, topicSlug, classData }: DeleteClassModalProps) {
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   const handleDelete = useCallback(async () => {
      setFormError('');
      setSubmitting(true);
      try {
         await deleteAdminClass(batchSlug, topicSlug, classData.slug);
         onClose();
         onSuccess();
      } catch (err: any) {
         setFormError(err.response?.data?.error || 'Failed to delete class.');
      } finally {
         setSubmitting(false);
      }
   }, [batchSlug, topicSlug, classData?.slug, onClose, onSuccess]);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (!isOpen) return;
         if (e.key === 'Escape') {
            onClose();
         }
         if (e.key === 'Enter' && !submitting) {
            handleDelete();
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, onClose, submitting, handleDelete]);

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[480px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-6">
            <DialogHeader className="space-y-1">
               <DialogTitle className="text-xl font-semibold text-destructive">
                  Delete Class
               </DialogTitle>
               <DialogDescription className="text-sm text-muted-foreground">
                  This action cannot be undone and will detach all questions synced to this module.
               </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-muted/40 p-4">
               <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-destructive" />
               </div>

               <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                     {classData?.class_name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                     {classData?.slug}
                  </p>
               </div>
            </div>

            {formError && (
               <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                  {formError}
               </div>
            )}

            <DialogFooter className="mt-6 pt-4 border-t border-border/60 flex justify-end gap-3">
               <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-xl px-5"
               >
                  Cancel
               </Button>
               <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="rounded-xl px-6 shadow-sm hover:shadow-md transition"
               >
                  {submitting ? "Deleting..." : "Confirm Delete"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
