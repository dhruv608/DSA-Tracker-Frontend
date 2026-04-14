/**
 * Student management types for admin
 */

import { AdminStudent } from '@/types/student/index.types';
import { BatchSelection, CitySelection } from '../common/index.types';

export interface StudentFormData {
  name: string;
  email: string;
  username?: string;
  password?: string;
  enrollment_id: string;
  batch_id?: number;
  leetcode_id?: string;
  gfg_id?: string;
}

export interface StudentSubmitPayload {
  name: string;
  email: string;
  username?: string;
  password?: string;
  enrollment_id: string;
  batch_id?: number;
  leetcode_id?: string;
  gfg_id?: string;
}

export interface StudentsHeaderProps {
  totalRecords: number;
  selectedBatch: BatchSelection | null;
}

export interface StudentsFilterProps {
  sSearch: string;
  setSSearch: (value: string) => void;
  setIsCreateOpen: (value: boolean) => void;
  setIsBulkUploadOpen: (value: boolean) => void;
  setIsDownloadReportOpen: (value: boolean) => void;
  resetForms: () => void;
  setPage: (value: number) => void;
}

export interface StudentsTableProps {
  students: AdminStudent[];
  loading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
  setPage: (value: number) => void;
  setLimit: (value: number) => void;
  onEdit: (student: AdminStudent) => void;
  onDelete: (student: AdminStudent) => void;
}

export interface StudentsModalsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (value: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (value: boolean) => void;
  isBulkUploadOpen: boolean;
  setIsBulkUploadOpen: (value: boolean) => void;
  isDownloadReportOpen: boolean;
  setIsDownloadReportOpen: (value: boolean) => void;
  selectedStudent: AdminStudent | null;
  formName: string;
  setFormName: (value: string) => void;
  formEmail: string;
  setFormEmail: (value: string) => void;
  formUsername: string;
  setFormUsername: (value: string) => void;
  formPassword: string;
  setFormPassword: (value: string) => void;
  formEnrollmentId: string;
  setFormEnrollmentId: (value: string) => void;
  formLeetcodeId: string;
  setFormLeetcodeId: (value: string) => void;
  formGfgId: string;
  setFormGfgId: (value: string) => void;
  formError: string;
  setFormError: (value: string) => void;
  submitting: boolean;
  handleCreateSubmit: (e: React.FormEvent) => Promise<void>;
  handleEditSubmit: (e: React.FormEvent) => Promise<void>;
  handleDeleteSubmit: () => Promise<void>;
  handleBulkUploadSuccess: (result: BulkUploadResult) => void;
  selectedBatch: BatchSelection | null;
}

export interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (result: BulkUploadResult) => void;
}

export interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBatch: BatchSelection | null;
}

export interface StudentsSkeletonProps {
  // No props needed
}

export interface BulkUploadResult {
  success: number;
  failed: number;
  inserted?: number;
  totalRows?: number;
  duplicates?: number;
  invalidRows?: number;
  skipped?: number;
  message?: string;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export interface CsvRowData {
  name: string;
  email: string;
  username: string;
  enrollment_id: string;
  leetcode_id?: string;
  gfg_id?: string;
  [key: string]: string | undefined;
}

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
  batch_id?: number;
}
