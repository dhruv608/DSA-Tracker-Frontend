"use client";

/**
 * UI Toast Layer - Pure UI layer for displaying toast notifications
 * This file ONLY triggers toast, no error logic here
 * Uses the existing premium custom glass toast design
 */

import { glassToast } from '@/utils/toast-system';

/**
 * Show error toast with premium glass UI
 */
export function showError(message: string): void {
  glassToast.error(message);
}

/**
 * Show warning toast with premium glass UI
 */
export function showWarning(message: string): void {
  // Use error styling for warnings as glassToast doesn't have warning variant
  glassToast.error(message);
}

/**
 * Show success toast with premium glass UI
 * Supports both predefined actions and custom messages
 */
export function showSuccess(message: string): void {
  glassToast.success(message);
}

/**
 * Show loading toast with premium glass UI
 */
export function showLoading(message: string): string | number {
  return glassToast.loading(message);
}

/**
 * Dismiss all toasts
 */
export function dismissAll(): void {
  glassToast.dismiss();
}

/**
 * Dismiss specific toast by ID
 */
export function dismiss(id: string | number): void {
  glassToast.dismissId(id);
}
