import { glassToast } from '@/utils/toast-system';

/**
 * Centralized error handling utility
 * Provides user-friendly error messages while maintaining security
 */

export interface UserFriendlyError {
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string;
}

export class ErrorHandler {
  /**
   * Get user-friendly error message based on error type
   */
  static getUserMessage(error: any): UserFriendlyError {
    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
      return {
        message: 'Unable to connect to server. Please check your internet connection.',
        type: 'error',
        action: 'Try refreshing the page'
      };
    }

    // HTTP status errors
    const status = error?.response?.status;
    const data = error?.response?.data;

    switch (status) {
      case 400:
        return {
          message: 'Invalid request. Please check your input and try again.',
          type: 'error'
        };

      case 401:
        return {
          message: 'Your session has expired. Please log in again.',
          type: 'warning',
          action: 'Redirecting to login...'
        };

      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          type: 'error'
        };

      case 404:
        return {
          message: 'The requested resource was not found.',
          type: 'error'
        };

      case 429:
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          type: 'warning',
          action: 'Please try again in a few moments'
        };

      case 500:
        return {
          message: 'Server error occurred. Our team has been notified.',
          type: 'error',
          action: 'Try again later'
        };

      case 502:
      case 503:
      case 504:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          type: 'warning',
          action: 'Service will be available soon'
        };

      default:
        // Generic error - don't expose technical details
        return {
          message: 'Something went wrong. Please try again.',
          type: 'error',
          action: 'If the problem persists, contact support'
        };
    }
  }

  /**
   * Log technical error details for debugging (in development)
   */
  static logError(error: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.group(` Error ${context ? `in ${context}` : ''}`);
      console.error('Technical details:', error);
      console.error('Status:', error?.response?.status);
      console.error('Data:', error?.response?.data);
      console.error('Message:', error?.message);
      console.groupEnd();
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { context });
  }

  /**
   * Handle error with user feedback and logging
   */
  static handle(error: any, context?: string): UserFriendlyError {
    this.logError(error, context);
    return this.getUserMessage(error);
  }

  /**
   * Show user-friendly alert
   */
  static showAlert(error: any, context?: string) {
    const userError = this.handle(error, context);
    
    // Use toast instead of alert for better UX
    if (typeof window !== 'undefined') {
      glassToast.error(userError.message);
    }

    return userError;
  }
}
