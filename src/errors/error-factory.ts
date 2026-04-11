import { AppError, BackendErrorResponse } from './types';

/**
 * Error Factory - Normalizes any error type into a standard AppError
 * Handles Axios errors, backend responses, and unknown errors
 */

interface AxiosError {
  response?: {
    status?: number;
    data?: BackendErrorResponse | { message?: string; error?: string };
  };
  request?: unknown;
  message?: string;
  code?: string;
}

/**
 * Check if error is an Axios error structure
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'request' in error || 'code' in error)
  );
}

/**
 * Check if error has backend response format
 */
function isBackendErrorResponse(data: unknown): data is BackendErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'statusCode' in data &&
    'message' in data &&
    typeof (data as BackendErrorResponse).statusCode === 'number' &&
    typeof (data as BackendErrorResponse).message === 'string'
  );
}

/**
 * Extract status code from error
 */
function extractStatusCode(error: AxiosError): number {
  // From backend response
  if (error.response?.status) {
    return error.response.status;
  }

  // Network errors
  if (error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
    return 0; // Network error indicator
  }

  // Timeout
  if (error.code === 'ECONNABORTED' || error.code === 'TIMEOUT') {
    return 408;
  }

  return 500; // Default fallback
}

/**
 * Extract message from error
 */
function extractMessage(error: AxiosError): string {
  // From backend response data
  if (error.response?.data) {
    const data = error.response.data;

    // Standard backend format
    if (isBackendErrorResponse(data)) {
      return data.message;
    }

    // Legacy formats
    if (typeof data.message === 'string') {
      return data.message;
    }
    if (typeof data.error === 'string') {
      return data.error;
    }
  }

  // From error message
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Extract error code from error
 */
function extractErrorCode(error: AxiosError): string | undefined {
  if (error.response?.data) {
    const data = error.response.data;

    // Check 'code' field (backend format via errorHandler.middleware.ts)
    if (isBackendErrorResponse(data) && data.code) {
      return data.code;
    }

    // Fallback: Check 'errorCode' field (legacy/alternative format)
    if (typeof (data as { errorCode?: string }).errorCode === 'string') {
      return (data as { errorCode?: string }).errorCode;
    }
  }

  return undefined;
}

/**
 * Create an AppError from any error type
 * This is the main entry point for error normalization
 */
export function createAppError(error: unknown): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return error;
  }

  // Axios error structure
  if (isAxiosError(error)) {
    const statusCode = extractStatusCode(error);
    const message = extractMessage(error);
    const errorCode = extractErrorCode(error);

    return {
      statusCode,
      message,
      errorCode,
      originalError: error,
    };
  }

  // Standard Error object
  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message || 'An unexpected error occurred',
      originalError: error,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      statusCode: 500,
      message: error,
      originalError: error,
    };
  }

  // Unknown error type
  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
    originalError: error,
  };
}

/**
 * Check if value is already an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error &&
    typeof (error as AppError).statusCode === 'number' &&
    typeof (error as AppError).message === 'string'
  );
}

/**
 * Create a network error
 */
export function createNetworkError(): AppError {
  return {
    statusCode: 0,
    message: 'Unable to connect to the server. Please check your internet connection.',
    originalError: new Error('Network error'),
  };
}

/**
 * Create a timeout error
 */
export function createTimeoutError(): AppError {
  return {
    statusCode: 408,
    message: 'The request timed out. Please try again.',
    originalError: new Error('Timeout error'),
  };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: AppError): boolean {
  return error.statusCode === 0 ||
    (typeof error.originalError === 'object' &&
     error.originalError !== null &&
     'code' in (error.originalError as { code?: string }) &&
     (error.originalError as { code?: string }).code === 'ERR_NETWORK');
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: AppError): boolean {
  return error.statusCode === 401 || error.statusCode === 403;
}
