"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInputWithValidation } from '@/components/ui/PasswordStrengthIndicator';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { AlertTriangle, Plus, FolderEdit, Trash2 } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import { AdminStudent } from '@/types/student/index.types';
import BulkUploadModal from './BulkUploadModal';
import DownloadReportModal from './DownloadReportModal';
import { CreateStudentInput, UpdateStudentInput } from '@/schemas/student.schema';

interface StudentsModalsProps {
  // Modal states
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  isBulkUploadOpen: boolean;
  setIsBulkUploadOpen: (open: boolean) => void;
  isDownloadReportOpen: boolean;
  setIsDownloadReportOpen: (open: boolean) => void;

  // Form data
  selectedStudent: AdminStudent | null;
  formError: string;
  setFormError: (value: string) => void;
  submitting: boolean;

  // React Hook Forms
  createForm: UseFormReturn<CreateStudentInput>;
  editForm: UseFormReturn<UpdateStudentInput>;

  // Handlers
  handleCreateSubmit: (values: CreateStudentInput) => void;
  handleEditSubmit: (values: UpdateStudentInput) => void;
  handleDeleteSubmit: () => void;
  handleBulkUploadSuccess: (result: any) => void;
  selectedBatch: { id: number } | null;
}

export default function StudentsModals({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  isBulkUploadOpen,
  setIsBulkUploadOpen,
  isDownloadReportOpen,
  setIsDownloadReportOpen,
  selectedStudent,
  formError,
  setFormError,
  submitting,
  createForm,
  editForm,
  handleCreateSubmit,
  handleEditSubmit,
  handleDeleteSubmit,
  handleBulkUploadSuccess,
  selectedBatch,
}: StudentsModalsProps) {
  const formPassword = createForm.watch('password') || '';
  const passwordValidation = usePasswordValidation(formPassword);
  
  const createFormErrors = createForm.formState.errors;
  const editFormErrors = editForm.formState.errors;

  // Debug: Log form state to identify validation issues
  console.log('Form is valid:', createForm.formState.isValid);
  console.log('Form errors:', createFormErrors);
  console.log('Form values:', createForm.getValues());
  return (
    <>
      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[520px] h-[90vh]! p-0 overflow-y-auto no-scrollbar rounded-2xl">
          {/* HEADER */}
          <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
              <div className="p-2 rounded bg-primary/10 border border-primary/20">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              Add Student
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Onboard a new student to the batch
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6">
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-5">
              {/* ERROR */}
              {formError && (
                <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  {formError}
                </div>
              )}

              {/* NAME */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-s text-muted-foreground font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <div className="col-span-2">
                  <Input
                    {...createForm.register('name')}
                    placeholder="Enter student name"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {createFormErrors.name && (
                    <p className="text-xs text-red-400 mt-1">{createFormErrors.name.message}</p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-s text-muted-foreground font-medium">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="col-span-2">
                  <Input
                    type="email"
                    {...createForm.register('email')}
                    placeholder="student@example.com"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {createFormErrors.email && (
                    <p className="text-xs text-red-400 mt-1">{createFormErrors.email.message}</p>
                  )}
                </div>
              </div>

              {/* ENROLLMENT */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-s text-muted-foreground font-medium">
                  Enrollment ID <span className="text-destructive">*</span>
                </label>
                <div className="col-span-2">
                  <Input
                    {...createForm.register('enrollment_id')}
                    placeholder="ENR123456"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {createFormErrors.enrollment_id && (
                    <p className="text-xs text-red-400 mt-1">{createFormErrors.enrollment_id.message}</p>
                  )}
                </div>
              </div>

              {/* USERNAME */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-s text-muted-foreground font-medium">
                  Username
                </label>
                <div className="col-span-2">
                  <Input
                    {...createForm.register('username')}
                    placeholder="username"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {createFormErrors.username && (
                    <p className="text-xs text-red-400 mt-1">{createFormErrors.username.message}</p>
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div className="grid grid-cols-3 items-start">
                <label className="text-sm text-muted-foreground font-medium">
                  Password
                </label>
                <div className="col-span-2 space-y-2">
                  <PasswordInputWithValidation
                    password={formPassword}
                    onPasswordChange={(val) => createForm.setValue('password', val)}
                    disabled={submitting}
                    showStrengthIndicator={true}
                    showChecklist={false}
                    className="space-y-2"
                  />
                  {createFormErrors.password && (
                    <p className="text-xs text-red-400">{createFormErrors.password.message}</p>
                  )}
                </div>
              </div>

              {/* PLATFORM IDs */}
              <div className="grid grid-cols-2">
                <div className="space-y-2">
                  <label className="text-s text-muted-foreground font-medium flex items-center gap-2">
                    <LeetCodeIcon className="w-4 h-4 text-leetcode" />
                    LeetCode ID
                  </label>
                  <Input
                    {...createForm.register('leetcode_id')}
                    placeholder="leetcode_id"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all w-[90%]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-s text-muted-foreground font-medium flex items-center gap-2">
                    <GeeksforGeeksIcon className="w-4 h-4 text-gfg" />
                    GFG ID
                  </label>
                  <Input
                    {...createForm.register('gfg_id')}
                    placeholder="gfg_id"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all w-full"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={submitting}
                  className="h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !createForm.formState.isValid}
                  className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
                >
                  
                  {submitting ? "Adding..." : "Add Student"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">
          {/* HEADER */}
          <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold">
              <div className="p-2 rounded bg-primary/10 border border-primary/20">
                <FolderEdit className="w-4 h-4 text-primary" />
              </div>
              Edit Student
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update student information
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6">
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-5">
              {/* ERROR */}
              {formError && (
                <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  {formError}
                </div>
              )}

              {/* NAME */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-s text-muted-foreground font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <div className="col-span-2">
                  <Input
                    {...editForm.register('name')}
                    placeholder="Enter student name"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {editFormErrors.name && (
                    <p className="text-xs text-red-400 mt-1">{editFormErrors.name.message}</p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-xs text-muted-foreground font-medium">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="col-span-2">
                  <Input
                    type="email"
                    {...editForm.register('email')}
                    placeholder="student@example.com"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {editFormErrors.email && (
                    <p className="text-xs text-red-400 mt-1">{editFormErrors.email.message}</p>
                  )}
                </div>
              </div>

              {/* USERNAME */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-xs text-muted-foreground font-medium">
                  Username
                </label>
                <div className="col-span-2">
                  <Input
                    {...editForm.register('username')}
                    placeholder="username"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {editFormErrors.username && (
                    <p className="text-xs text-red-400 mt-1">{editFormErrors.username.message}</p>
                  )}
                </div>
              </div>

              {/* ENROLLMENT */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-s text-muted-foreground font-medium">
                  Enrollment ID
                </label>
                <div className="col-span-2">
                  <Input
                    {...editForm.register('enrollment_id')}
                    placeholder="ENR123456"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all"
                  />
                  {editFormErrors.enrollment_id && (
                    <p className="text-xs text-red-400 mt-1">{editFormErrors.enrollment_id.message}</p>
                  )}
                </div>
              </div>

              {/* PLATFORM IDs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-s text-muted-foreground font-medium flex items-center gap-2">
                    <LeetCodeIcon className="w-4 h-4 text-leetcode" />
                    LeetCode ID
                  </label>
                  <Input
                    {...editForm.register('leetcode_id')}
                    placeholder="leetcode_id"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all w-[90%]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-s text-muted-foreground font-medium flex items-center gap-2">
                    <GeeksforGeeksIcon className="w-4 h-4 text-gfg" />
                    GFG ID
                  </label>
                  <Input
                    {...editForm.register('gfg_id')}
                    placeholder="gfg_id"
                    disabled={submitting}
                    className="h-11! pl-11 pr-4 border border-border focus:border-logo rounded-2xl text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-logo/5 transition-all w-full"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                  disabled={submitting}
                  className="h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !editForm.formState.isValid}
                  className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className=" rounded-2xl p-0 overflow-hidden shadow-xl max-w-[480px] z-50">
          {/* HEADER */}
          <DialogHeader className="px-6 py-5 border-b border-red-500/20">
            <DialogTitle className="text-lg font-semibold text-red-400">
              Delete Student
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete "{selectedStudent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6">
            {/* WARNING ICON */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4 px-6">
                This action cannot be undone and will remove all associated data.
              </p>
            </div>

            {/* STUDENT INFO CARD */}
            <div className="glass rounded-2xl p-4 flex items-center gap-3 border border-border/40">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedStudent?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedStudent?.email}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="border-t border-border/40 px-6 py-4 flex gap-3">
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={submitting}
              className="h-11 w-full font-semibold bg-red-500 hover:bg-red-600 text-white mb-4"
            >
              {submitting ? "Deleting..." : "Delete Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BULK UPLOAD MODAL */}
      <BulkUploadModal
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onSuccess={handleBulkUploadSuccess}
      />

      {/* DOWNLOAD REPORT MODAL */}
      <DownloadReportModal
        open={isDownloadReportOpen}
        onOpenChange={setIsDownloadReportOpen}
      />
    </>
  );
}
