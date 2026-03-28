"use client";

import React from 'react';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Loader2, 
  Trash2, 
  UserPlus, 
  UserCheck, 
  Settings, 
  FileText, 
  Download, 
  Upload, 
  Edit, 
  Plus, 
  Building, 
  Calendar, 
  BookOpen,
  LogIn,
  LogOut,
  UserPlus as UserRegister,
  Mail
} from 'lucide-react';

// Toast configuration
export const toastConfig = {
  position: 'top-center' as const,
  theme: 'dark' as const,
  richColors: true,
  closeButton: true,
  duration: 4000,
};

// Icon mapping for different operations
const getOperationIcon = (operation: string, type: 'success' | 'error' | 'warning' | 'info' | 'loading' = 'success') => {
  const iconProps = { className: "w-5 h-5" };
  
  switch (operation) {
    // Auth operations
    case 'LOGIN':
      return <LogIn {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'REGISTER':
      return <UserRegister {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'LOGOUT':
      return <LogOut {...iconProps} className={`${iconProps.className} text-green-400`} />;
    
    // Admin operations
    case 'ADMIN_CREATED':
    case 'ADMIN_UPDATED':
      return <UserCheck {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'ADMIN_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // City operations
    case 'CITY_CREATED':
    case 'CITY_UPDATED':
      return <Building {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'CITY_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // Batch operations
    case 'BATCH_CREATED':
    case 'BATCH_UPDATED':
      return <Calendar {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'BATCH_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // Topic operations
    case 'TOPIC_CREATED':
    case 'TOPIC_UPDATED':
      return <BookOpen {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'TOPIC_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // Class operations
    case 'CLASS_CREATED':
    case 'CLASS_UPDATED':
      return <BookOpen {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'CLASS_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // Question operations
    case 'QUESTION_CREATED':
    case 'QUESTION_UPDATED':
      return <FileText {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'QUESTION_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // Student operations
    case 'STUDENT_CREATED':
    case 'STUDENT_UPDATED':
      return <UserPlus {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'STUDENT_DELETED':
      return <Trash2 {...iconProps} className={`${iconProps.className} text-red-400`} />;
    
    // File operations
    case 'FILE_UPLOADED':
      return <Upload {...iconProps} className={`${iconProps.className} text-green-400`} />;
    case 'FILE_DOWNLOADED':
      return <Download {...iconProps} className={`${iconProps.className} text-green-400`} />;
    
    // Profile operations
    case 'PROFILE_UPDATED':
      return <Settings {...iconProps} className={`${iconProps.className} text-green-400`} />;
    
    // Email operations
    case 'EMAIL_SENT':
      return <Mail {...iconProps} className={`${iconProps.className} text-green-400`} />;
    
    // Default icons based on type
    default:
      switch (type) {
        case 'success':
          return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-400`} />;
        case 'error':
          return <XCircle {...iconProps} className={`${iconProps.className} text-red-400`} />;
        case 'warning':
          return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
        case 'info':
          return <Info {...iconProps} className={`${iconProps.className} text-blue-400`} />;
        case 'loading':
          return <Loader2 {...iconProps} className={`${iconProps.className} text-blue-400 animate-spin`} />;
        default:
          return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-400`} />;
      }
    }
};

// Enhanced toast functions with Lucide icons
export const showLucideToast = {
  success: (message: string, operation?: string, options?: any) => {
    return toast.success(message, {
      ...toastConfig,
      icon: getOperationIcon(operation || '', 'success'),
      className: 'border-green-500/20 bg-green-500/10',
      duration: 4000,
      ...options,
    });
  },
  
  error: (message: string, operation?: string, options?: any) => {
    return toast.error(message, {
      ...toastConfig,
      icon: getOperationIcon(operation || '', 'error'),
      className: 'border-red-500/20 bg-red-500/10',
      duration: 6000,
      ...options,
    });
  },
  
  warning: (message: string, operation?: string, options?: any) => {
    return toast.warning(message, {
      ...toastConfig,
      icon: getOperationIcon(operation || '', 'warning'),
      className: 'border-yellow-500/20 bg-yellow-500/10',
      duration: 5000,
      ...options,
    });
  },
  
  info: (message: string, operation?: string, options?: any) => {
    return toast.info(message, {
      ...toastConfig,
      icon: getOperationIcon(operation || '', 'info'),
      className: 'border-blue-500/20 bg-blue-500/10',
      duration: 4000,
      ...options,
    });
  },
  
  loading: (message: string, operation?: string, options?: any) => {
    return toast.loading(message, {
      ...toastConfig,
      icon: getOperationIcon(operation || '', 'loading'),
      className: 'border-blue-500/20 bg-blue-500/10',
      ...options,
    });
  },
};

// Operation-specific functions
export const operationToasts = {
  // Auth operations
  login: (message?: string) => showLucideToast.success(message || 'Logged in successfully!', 'LOGIN'),
  register: (message?: string) => showLucideToast.success(message || 'Account created successfully!', 'REGISTER'),
  logout: (message?: string) => showLucideToast.success(message || 'Logged out successfully!', 'LOGOUT'),
  
  // Admin operations
  createAdmin: (message?: string) => showLucideToast.success(message || 'Admin created successfully!', 'ADMIN_CREATED'),
  updateAdmin: (message?: string) => showLucideToast.success(message || 'Admin updated successfully!', 'ADMIN_UPDATED'),
  deleteAdmin: (message?: string) => showLucideToast.error(message || 'Admin deleted successfully!', 'ADMIN_DELETED'),
  
  // City operations
  createCity: (message?: string) => showLucideToast.success(message || 'City created successfully!', 'CITY_CREATED'),
  updateCity: (message?: string) => showLucideToast.success(message || 'City updated successfully!', 'CITY_UPDATED'),
  deleteCity: (message?: string) => showLucideToast.error(message || 'City deleted successfully!', 'CITY_DELETED'),
  
  // Batch operations
  createBatch: (message?: string) => showLucideToast.success(message || 'Batch created successfully!', 'BATCH_CREATED'),
  updateBatch: (message?: string) => showLucideToast.success(message || 'Batch updated successfully!', 'BATCH_UPDATED'),
  deleteBatch: (message?: string) => showLucideToast.error(message || 'Batch deleted successfully!', 'BATCH_DELETED'),
  
  // Topic operations
  createTopic: (message?: string) => showLucideToast.success(message || 'Topic created successfully!', 'TOPIC_CREATED'),
  updateTopic: (message?: string) => showLucideToast.success(message || 'Topic updated successfully!', 'TOPIC_UPDATED'),
  deleteTopic: (message?: string) => showLucideToast.error(message || 'Topic deleted successfully!', 'TOPIC_DELETED'),
  
  // Class operations
  createClass: (message?: string) => showLucideToast.success(message || 'Class created successfully!', 'CLASS_CREATED'),
  updateClass: (message?: string) => showLucideToast.success(message || 'Class updated successfully!', 'CLASS_UPDATED'),
  deleteClass: (message?: string) => showLucideToast.error(message || 'Class deleted successfully!', 'CLASS_DELETED'),
  
  // Question operations
  createQuestion: (message?: string) => showLucideToast.success(message || 'Question created successfully!', 'QUESTION_CREATED'),
  updateQuestion: (message?: string) => showLucideToast.success(message || 'Question updated successfully!', 'QUESTION_UPDATED'),
  deleteQuestion: (message?: string) => showLucideToast.error(message || 'Question deleted successfully!', 'QUESTION_DELETED'),
  
  // Student operations
  createStudent: (message?: string) => showLucideToast.success(message || 'Student created successfully!', 'STUDENT_CREATED'),
  updateStudent: (message?: string) => showLucideToast.success(message || 'Student updated successfully!', 'STUDENT_UPDATED'),
  deleteStudent: (message?: string) => showLucideToast.error(message || 'Student deleted successfully!', 'STUDENT_DELETED'),
  
  // File operations
  fileUpload: (message?: string) => showLucideToast.success(message || 'File uploaded successfully!', 'FILE_UPLOADED'),
  fileDownload: (message?: string) => showLucideToast.success(message || 'File downloaded successfully!', 'FILE_DOWNLOADED'),
  
  // Profile operations
  profileUpdate: (message?: string) => showLucideToast.success(message || 'Profile updated successfully!', 'PROFILE_UPDATED'),
  
  // Email operations
  emailSent: (message?: string) => showLucideToast.success(message || 'Email sent successfully!', 'EMAIL_SENT'),
  
  // Generic operations
  success: (message: string) => showLucideToast.success(message),
  error: (message: string) => showLucideToast.error(message),
  warning: (message: string) => showLucideToast.warning(message),
  info: (message: string) => showLucideToast.info(message),
  loading: (message: string) => showLucideToast.loading(message),
};
