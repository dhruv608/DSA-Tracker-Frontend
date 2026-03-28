"use client";

import { CheckCircle, XCircle, AlertCircle, Info, Loader2, Trash2, UserPlus, UserCheck, Settings, FileText, Download, Upload, Edit, Plus, Building, Calendar, BookOpen } from 'lucide-react';

// Icon components for different toast types
export const ToastIcons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  loading: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
};

// Specific icons for different operations
export const OperationIcons = {
  // User operations
  login: <UserCheck className="w-5 h-5 text-green-400" />,
  register: <UserPlus className="w-5 h-5 text-green-400" />,
  
  // CRUD operations
  create: <Plus className="w-5 h-5 text-green-400" />,
  edit: <Edit className="w-5 h-5 text-blue-400" />,
  delete: <Trash2 className="w-5 h-5 text-red-400" />,
  
  // Entity operations
  admin: <UserCheck className="w-5 h-5 text-green-400" />,
  city: <Building className="w-5 h-5 text-green-400" />,
  batch: <Calendar className="w-5 h-5 text-green-400" />,
  topic: <BookOpen className="w-5 h-5 text-green-400" />,
  class: <BookOpen className="w-5 h-5 text-green-400" />,
  question: <FileText className="w-5 h-5 text-green-400" />,
  student: <UserPlus className="w-5 h-5 text-green-400" />,
  
  // File operations
  upload: <Upload className="w-5 h-5 text-green-400" />,
  download: <Download className="w-5 h-5 text-green-400" />,
  
  // Settings
  settings: <Settings className="w-5 h-5 text-blue-400" />,
};
