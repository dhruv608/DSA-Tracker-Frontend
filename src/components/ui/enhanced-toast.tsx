"use client";

import { toast } from 'sonner';
import { ToastIcons, OperationIcons } from './toast-icons';

// Enhanced toast configuration with Lucide icons
export const toastConfig = {
  position: 'top-center' as const,
  theme: 'dark' as const,
  richColors: true,
  closeButton: true,
  duration: 4000,
};

// Enhanced toast functions with Lucide icons
export const enhancedToast = {
  success: (message: string, icon?: React.ReactNode, options?: any) => {
    return toast.success(message, {
      ...toastConfig,
      icon: icon || ToastIcons.success,
      className: 'border-green-500/20 bg-green-500/10',
      duration: 4000,
      ...options,
    });
  },
  
  error: (message: string, icon?: React.ReactNode, options?: any) => {
    return toast.error(message, {
      ...toastConfig,
      icon: icon || ToastIcons.error,
      className: 'border-red-500/20 bg-red-500/10',
      duration: 6000,
      ...options,
    });
  },
  
  warning: (message: string, icon?: React.ReactNode, options?: any) => {
    return toast.warning(message, {
      ...toastConfig,
      icon: icon || ToastIcons.warning,
      className: 'border-yellow-500/20 bg-yellow-500/10',
      duration: 5000,
      ...options,
    });
  },
  
  info: (message: string, icon?: React.ReactNode, options?: any) => {
    return toast.info(message, {
      ...toastConfig,
      icon: icon || ToastIcons.info,
      className: 'border-blue-500/20 bg-blue-500/10',
      duration: 4000,
      ...options,
    });
  },
  
  loading: (message: string, icon?: React.ReactNode, options?: any) => {
    return toast.loading(message, {
      ...toastConfig,
      icon: icon || ToastIcons.loading,
      className: 'border-blue-500/20 bg-blue-500/10',
      ...options,
    });
  },
};

// Operation-specific toast functions
export const operationToasts = {
  // Auth operations
  login: (message?: string) => enhancedToast.success(message || 'Logged in successfully!', OperationIcons.login),
  register: (message?: string) => enhancedToast.success(message || 'Account created successfully!', OperationIcons.register),
  logout: (message?: string) => enhancedToast.success(message || 'Logged out successfully!', ToastIcons.success),
  
  // CRUD operations with specific icons
  createAdmin: (message?: string) => enhancedToast.success(message || 'Admin created successfully!', OperationIcons.admin),
  updateAdmin: (message?: string) => enhancedToast.success(message || 'Admin updated successfully!', OperationIcons.edit),
  deleteAdmin: (message?: string) => enhancedToast.error(message || 'Admin deleted successfully!', OperationIcons.delete),
  
  createCity: (message?: string) => enhancedToast.success(message || 'City created successfully!', OperationIcons.city),
  updateCity: (message?: string) => enhancedToast.success(message || 'City updated successfully!', OperationIcons.edit),
  deleteCity: (message?: string) => enhancedToast.error(message || 'City deleted successfully!', OperationIcons.delete),
  
  createBatch: (message?: string) => enhancedToast.success(message || 'Batch created successfully!', OperationIcons.batch),
  updateBatch: (message?: string) => enhancedToast.success(message || 'Batch updated successfully!', OperationIcons.edit),
  deleteBatch: (message?: string) => enhancedToast.error(message || 'Batch deleted successfully!', OperationIcons.delete),
  
  createTopic: (message?: string) => enhancedToast.success(message || 'Topic created successfully!', OperationIcons.topic),
  updateTopic: (message?: string) => enhancedToast.success(message || 'Topic updated successfully!', OperationIcons.edit),
  deleteTopic: (message?: string) => enhancedToast.error(message || 'Topic deleted successfully!', OperationIcons.delete),
  
  createClass: (message?: string) => enhancedToast.success(message || 'Class created successfully!', OperationIcons.class),
  updateClass: (message?: string) => enhancedToast.success(message || 'Class updated successfully!', OperationIcons.edit),
  deleteClass: (message?: string) => enhancedToast.error(message || 'Class deleted successfully!', OperationIcons.delete),
  
  createQuestion: (message?: string) => enhancedToast.success(message || 'Question created successfully!', OperationIcons.question),
  updateQuestion: (message?: string) => enhancedToast.success(message || 'Question updated successfully!', OperationIcons.edit),
  deleteQuestion: (message?: string) => enhancedToast.error(message || 'Question deleted successfully!', OperationIcons.delete),
  
  createStudent: (message?: string) => enhancedToast.success(message || 'Student created successfully!', OperationIcons.student),
  updateStudent: (message?: string) => enhancedToast.success(message || 'Student updated successfully!', OperationIcons.edit),
  deleteStudent: (message?: string) => enhancedToast.error(message || 'Student deleted successfully!', OperationIcons.delete),
  
  // File operations
  fileUpload: (message?: string) => enhancedToast.success(message || 'File uploaded successfully!', OperationIcons.upload),
  fileDownload: (message?: string) => enhancedToast.success(message || 'File downloaded successfully!', OperationIcons.download),
  
  // Profile operations
  profileUpdate: (message?: string) => enhancedToast.success(message || 'Profile updated successfully!', OperationIcons.settings),
  
  // Generic operations
  success: (message: string) => enhancedToast.success(message, ToastIcons.success),
  error: (message: string) => enhancedToast.error(message, ToastIcons.error),
  warning: (message: string) => enhancedToast.warning(message, ToastIcons.warning),
  info: (message: string) => enhancedToast.info(message, ToastIcons.info),
  loading: (message: string) => enhancedToast.loading(message, ToastIcons.loading),
};
