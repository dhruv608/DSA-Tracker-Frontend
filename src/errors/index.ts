/**
 * Errors Module - Public API
 * Industry-level error handling system for DSA Tracker
 * 
 * Usage:
 *   import { handleError, getErrorDetails, canRefreshToken } from '@/errors';
 * 
 *   // Automatic handling with actions
 *   handleError(error, { context: 'login' });
 * 
 *   // Form handling - get details without triggering actions
 *   const { message, action } = getErrorDetails(error);
 * 
 *   // Check if token refresh is possible
 *   if (canRefreshToken(error)) { ... }
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  AppError,
  BackendErrorResponse,
  ErrorMapping,
  ErrorType,
  ErrorCode,
  ErrorAction,
} from './types';

export { COMMON_ERROR_CODES } from './types';

// =============================================================================
// ERROR FACTORY - Normalization utilities
// =============================================================================

export {
  createAppError,
  isAppError,
  createNetworkError,
  createTimeoutError,
  isNetworkError,
  isAuthError,
} from './error-factory';

// =============================================================================
// ERROR MAPPER - Message and action mappings
// =============================================================================

export {
  ERROR_MAPPINGS,
  ERROR_CODE_MAPPINGS,
  getMappedError,
  getMappedErrorByCode,
  hasMappedError,
  hasErrorCodeMapping,
  getErrorAction,
} from './error-mapper';

// =============================================================================
// ERROR HANDLER - Main API with action-based handling
// =============================================================================

export type {
  HandlerOptions,
  ErrorResult,
} from './error-handler';

export {
  // Main handler
  handleError,
  // Silent normalization
  handleErrorSilent,
  // Get details without triggering actions
  getErrorDetails,
  // Quick message extraction
  getErrorMessage,
  // Predicate checkers
  checkIsNetworkError,
  checkIsAuthError,
  requiresLogout,
  canRefreshToken,
} from './error-handler';
