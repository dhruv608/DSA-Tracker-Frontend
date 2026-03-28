"use client";

import { operationToasts } from '@/components/ui/enhanced-toast';

// Enhanced toast hook with Lucide icons
export const useEnhancedToast = () => {
  return {
    // Auth operations
    login: (message?: string) => operationToasts.login(message),
    register: (message?: string) => operationToasts.register(message),
    logout: (message?: string) => operationToasts.logout(message),
    
    // Admin operations
    createAdmin: (message?: string) => operationToasts.createAdmin(message),
    updateAdmin: (message?: string) => operationToasts.updateAdmin(message),
    deleteAdmin: (message?: string) => operationToasts.deleteAdmin(message),
    
    // City operations
    createCity: (message?: string) => operationToasts.createCity(message),
    updateCity: (message?: string) => operationToasts.updateCity(message),
    deleteCity: (message?: string) => operationToasts.deleteCity(message),
    
    // Batch operations
    createBatch: (message?: string) => operationToasts.createBatch(message),
    updateBatch: (message?: string) => operationToasts.updateBatch(message),
    deleteBatch: (message?: string) => operationToasts.deleteBatch(message),
    
    // Topic operations
    createTopic: (message?: string) => operationToasts.createTopic(message),
    updateTopic: (message?: string) => operationToasts.updateTopic(message),
    deleteTopic: (message?: string) => operationToasts.deleteTopic(message),
    
    // Class operations
    createClass: (message?: string) => operationToasts.createClass(message),
    updateClass: (message?: string) => operationToasts.updateClass(message),
    deleteClass: (message?: string) => operationToasts.deleteClass(message),
    
    // Question operations
    createQuestion: (message?: string) => operationToasts.createQuestion(message),
    updateQuestion: (message?: string) => operationToasts.updateQuestion(message),
    deleteQuestion: (message?: string) => operationToasts.deleteQuestion(message),
    
    // Student operations
    createStudent: (message?: string) => operationToasts.createStudent(message),
    updateStudent: (message?: string) => operationToasts.updateStudent(message),
    deleteStudent: (message?: string) => operationToasts.deleteStudent(message),
    
    // File operations
    fileUpload: (message?: string) => operationToasts.fileUpload(message),
    fileDownload: (message?: string) => operationToasts.fileDownload(message),
    
    // Profile operations
    profileUpdate: (message?: string) => operationToasts.profileUpdate(message),
    
    // Generic operations
    success: (message: string) => operationToasts.success(message),
    error: (message: string) => operationToasts.error(message),
    warning: (message: string) => operationToasts.warning(message),
    info: (message: string) => operationToasts.info(message),
    loading: (message: string) => operationToasts.loading(message),
  };
};
