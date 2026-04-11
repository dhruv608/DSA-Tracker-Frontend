import { ErrorMapping } from './types';

/**
 * Error Mapper - Comprehensive error mapping system
 * Maps HTTP status codes and backend error codes to user-friendly messages with actions
 * Priority: errorCode > statusCode > fallback
 */

// =============================================================================
// STATUS CODE MAPPINGS (Fallback when errorCode not available)
// =============================================================================
export const ERROR_MAPPINGS: Record<number, ErrorMapping> = {
  400: {
    message: 'Please check your input and try again.',
    type: 'error',
    action: 'toast',
  },
  401: {
    message: 'Your session has expired. Please log in again.',
    type: 'warning',
    action: 'logout', // Generic 401 defaults to logout
  },
  403: {
    message: "You don't have access to this.",
    type: 'error',
    action: 'toast',
  },
  404: {
    message: 'The requested resource was not found.',
    type: 'error',
    action: 'toast',
  },
  408: {
    message: 'The request timed out. Please try again.',
    type: 'warning',
    action: 'toast',
  },
  409: {
    message: 'This resource already exists.',
    type: 'warning',
    action: 'toast',
  },
  422: {
    message: 'We could not process your request. Please check your input.',
    type: 'error',
    action: 'toast',
  },
  429: {
    message: 'Too many requests. Please wait a moment and try again.',
    type: 'warning',
    action: 'toast',
  },
  500: {
    message: 'Something went wrong on our side. Please try again later.',
    type: 'error',
    action: 'toast',
  },
  502: {
    message: 'Service temporarily unavailable. Please try again later.',
    type: 'warning',
    action: 'toast',
  },
  503: {
    message: 'Service temporarily unavailable. Please try again later.',
    type: 'warning',
    action: 'toast',
  },
  504: {
    message: 'Service temporarily unavailable. Please try again later.',
    type: 'warning',
    action: 'toast',
  },
};

// =============================================================================
// ERROR CODE MAPPINGS (Higher priority than status codes)
// Organized by HTTP status code groups for clarity
// =============================================================================
export const ERROR_CODE_MAPPINGS: Record<string, ErrorMapping> = {
  // ===========================================================================
  // AUTHENTICATION ERRORS (401 Unauthorized)
  // ===========================================================================
  
  /**
   * INVALID_TOKEN - Token validation failed (expired or invalid), attempt refresh
   * Action: refresh - Try to get new access token using refresh token
   */
  INVALID_TOKEN: {
    message: 'Your session has expired. Refreshing...',
    type: 'info',
    action: 'refresh',
  },
  
  /**
   * TOKEN_EXPIRED - Token has passed its expiration time
   * Action: refresh - Try to get new access token using refresh token
   */
  TOKEN_EXPIRED: { 
    message: 'Your session has expired. Refreshing...', 
    type: 'info',
    action: 'refresh',
  },
  
  /**
   * TOKEN_MISSING - No authorization header or token provided
   * Action: logout - Redirect to login
   */
  TOKEN_MISSING: { 
    message: 'Please log in to continue.', 
    type: 'warning',
    action: 'logout',
  },
  
  /**
   * INVALID_CREDENTIALS - Login attempt with wrong email/password
   * Action: toast - Show toast notification
   */
  INVALID_CREDENTIALS: { 
    message: 'Invalid email or password. Please try again.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * UNAUTHORIZED - Generic authentication failure
   * Action: logout - Clear session
   */
  UNAUTHORIZED: { 
    message: 'Please log in to continue.', 
    type: 'warning',
    action: 'logout',
  },

  // ===========================================================================
  // AUTHORIZATION ERRORS (403 Forbidden)
  // ===========================================================================
  
  /**
   * INSUFFICIENT_PERMISSIONS - User lacks required role/permission
   * Action: toast - Show access denied message
   */
  INSUFFICIENT_PERMISSIONS: { 
    message: "You don't have permission to perform this action.", 
    type: 'error',
    action: 'toast',
  },

  // ===========================================================================
  // VALIDATION ERRORS (400 Bad Request)
  // ===========================================================================
  
  /**
   * VALIDATION_ERROR - Generic validation failure
   * Action: inline - Form validation errors should show inline
   */
  VALIDATION_ERROR: { 
    message: 'Please check your input and try again.', 
    type: 'error',
    action: 'inline',
  },
  
  /**
   * INVALID_INPUT - Malformed or incorrect input format
   * Action: inline - Form field error
   */
  INVALID_INPUT: { 
    message: 'Invalid input provided.', 
    type: 'error',
    action: 'inline',
  },
  
  /**
   * REQUIRED_FIELD - Missing required field
   * Action: inline - Show on specific field
   */
  REQUIRED_FIELD: { 
    message: 'This field is required.', 
    type: 'warning',
    action: 'inline',
  },
  
  /**
   * INVALID_PASSWORD - Password doesn't meet requirements
   * Action: inline - Show password field error
   */
  INVALID_PASSWORD: { 
    message: 'Password does not meet requirements.', 
    type: 'error',
    action: 'inline',
  },
  
  /**
   * INVALID_EMAIL_FORMAT - Email format validation failed
   * Action: inline - Show email field error
   */
  INVALID_EMAIL_FORMAT: { 
    message: 'Please enter a valid email address.', 
    type: 'error',
    action: 'inline',
  },
  
  /**
   * BAD_REQUEST - Generic bad request
   * Action: toast - General user feedback
   */
  BAD_REQUEST: { 
    message: 'Invalid request. Please try again.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * QUESTION_LINK_EXISTS - Duplicate question URL
   * Action: inline - Form error on link field
   */
  QUESTION_LINK_EXISTS: { 
    message: 'A question with this link already exists.', 
    type: 'warning',
    action: 'inline',
  },
  
  /**
   * NO_BATCH_ASSIGNED - Student operation requires batch
   * Action: toast - Inform user
   */
  NO_BATCH_ASSIGNED: { 
    message: 'You are not assigned to any batch. Please contact admin.', 
    type: 'warning',
    action: 'toast',
  },
  
  /**
   * INVALID_REFERENCE - Foreign key constraint failure
   * Action: toast - General error
   */
  INVALID_REFERENCE: { 
    message: 'Invalid reference. The related item may have been deleted.', 
    type: 'error',
    action: 'toast',
  },

  // ===========================================================================
  // RESOURCE NOT FOUND ERRORS (404)
  // ===========================================================================
  
  /**
   * STUDENT_NOT_FOUND - Student record doesn't exist
   * Action: toast - Inform user
   */
  STUDENT_NOT_FOUND: { 
    message: 'Student not found.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * USER_NOT_FOUND - User account doesn't exist
   * Action: toast - Login/registration context
   */
  USER_NOT_FOUND: { 
    message: 'User not found. Please check your credentials.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * NOT_FOUND - Generic resource not found
   * Action: toast - General message
   */
  NOT_FOUND: { 
    message: 'The requested resource was not found.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * NOT_FOUND_ERROR - Record not found (Prisma P2025)
   * Action: toast - General message
   */
  NOT_FOUND_ERROR: { 
    message: 'Record not found. It may have been deleted.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * QUESTION_NOT_FOUND - Specific question missing
   * Action: toast - Inform user
   */
  QUESTION_NOT_FOUND: { 
    message: 'Question not found.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * TOPIC_NOT_FOUND - Topic/Subject missing
   * Action: toast - Inform user
   */
  TOPIC_NOT_FOUND: { 
    message: 'Topic not found.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * BATCH_NOT_FOUND - Batch/class missing
   * Action: toast - Inform user
   */
  BATCH_NOT_FOUND: { 
    message: 'Batch not found.', 
    type: 'error',
    action: 'toast',
  },

  // ===========================================================================
  // CONFLICT ERRORS (409)
  // ===========================================================================
  
  /**
   * EMAIL_EXISTS - Registration with existing email
   * Action: inline - Show on email field
   */
  EMAIL_EXISTS: { 
    message: 'An account with this email already exists.', 
    type: 'warning',
    action: 'inline',
  },
  
  /**
   * USERNAME_EXISTS - Registration with existing username
   * Action: inline - Show on username field
   */
  USERNAME_EXISTS: { 
    message: 'This username is already taken.', 
    type: 'warning',
    action: 'inline',
  },
  
  /**
   * USERNAME_TAKEN - Profile update username conflict
   * Action: inline - Show on username field
   */
  USERNAME_TAKEN: { 
    message: 'This username is already taken.', 
    type: 'warning',
    action: 'inline',
  },
  
  /**
   * ENROLLMENT_ID_EXISTS - Duplicate enrollment ID
   * Action: inline - Admin form error
   */
  ENROLLMENT_ID_EXISTS: { 
    message: 'This enrollment ID already exists.', 
    type: 'warning',
    action: 'inline',
  },
  
  /**
   * DUPLICATE_ENTRY - Generic duplicate
   * Action: toast - General message
   */
  DUPLICATE_ENTRY: { 
    message: 'This item already exists.', 
    type: 'warning',
    action: 'toast',
  },
  
  /**
   * CONFLICT - Generic resource conflict
   * Action: toast - General message
   */
  CONFLICT: { 
    message: 'This resource conflicts with an existing one.', 
    type: 'warning',
    action: 'toast',
  },

  /**
   * CITY_EXISTS - Duplicate city name
   * Action: toast - Show specific message for city
   */
  CITY_EXISTS: { 
    message: 'City already exists.', 
    type: 'warning',
    action: 'toast',
  },

  /**
   * BATCH_DUPLICATE - Duplicate batch name in same city/year
   * Action: toast - Show specific message for batch
   */
  BATCH_DUPLICATE: { 
    message: 'Batch already exists in this city and year.', 
    type: 'warning',
    action: 'toast',
  },

  /**
   * USER_EXISTS - Duplicate admin email
   * Action: inline - Show on email field
   */
  USER_EXISTS: { 
    message: 'Email already exists.', 
    type: 'warning',
    action: 'inline',
  },

  // ===========================================================================
  // DATABASE ERRORS (500)
  // ===========================================================================
  
  /**
   * DATABASE_ERROR - Database operation failure
   * Action: toast - Generic server error message
   */
  DATABASE_ERROR: { 
    message: 'Something went wrong. Please try again later.', 
    type: 'error',
    action: 'toast',
  },

  // ===========================================================================
  // SERVER ERRORS (500)
  // ===========================================================================
  
  /**
   * SERVER_ERROR - Generic server error
   * Action: toast - Apologetic message
   */
  SERVER_ERROR: { 
    message: 'Something went wrong on our side. Please try again later.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * INTERNAL_ERROR - Internal server error (catch-all)
   * Action: toast - Generic message
   */
  INTERNAL_ERROR: { 
    message: 'An unexpected error occurred. Please try again.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * TOKEN_GENERATION_ERROR - Failed to create JWT
   * Action: toast - Login/registration affected
   */
  TOKEN_GENERATION_ERROR: { 
    message: 'Unable to complete authentication. Please try again.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * TOKEN_VERIFICATION_ERROR - Failed to verify JWT
   * Action: logout - Session issue
   */
  TOKEN_VERIFICATION_ERROR: { 
    message: 'Session verification failed. Please log in again.', 
    type: 'error',
    action: 'logout',
  },
  
  /**
   * MISSING_SECRET - Server config error (should never reach frontend)
   * Action: toast - Generic error
   */
  MISSING_SECRET: { 
    message: 'Authentication service unavailable. Please try again later.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * EMAIL_CONFIG_MISSING - Server email setup issue
   * Action: toast - Inform about email issues
   */
  EMAIL_CONFIG_MISSING: { 
    message: 'Email service is currently unavailable.', 
    type: 'warning',
    action: 'toast',
  },
  
  /**
   * EXTERNAL_SERVICE_ERROR - LeetCode/GFG API failure
   * Action: toast - Inform about external issue
   */
  EXTERNAL_SERVICE_ERROR: { 
    message: 'External service temporarily unavailable.', 
    type: 'warning',
    action: 'toast',
  },
  
  /**
   * FILE_UPLOAD_ERROR - S3 or file processing failure
   * Action: toast - Upload specific error
   */
  FILE_UPLOAD_ERROR: { 
    message: 'Failed to upload file. Please try again.', 
    type: 'error',
    action: 'toast',
  },
  
  /**
   * EMAIL_SEND_ERROR - Email delivery failure
   * Action: toast - Inform about email failure
   */
  EMAIL_SEND_ERROR: { 
    message: 'Failed to send email. Please try again.', 
    type: 'warning',
    action: 'toast',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get mapped error for a status code (fallback mapping)
 * @returns ErrorMapping or undefined if no mapping exists
 */
export function getMappedError(statusCode: number): ErrorMapping | undefined {
  return ERROR_MAPPINGS[statusCode];
}

/**
 * Get mapped error for an error code (highest priority)
 * @returns ErrorMapping or undefined if no mapping exists
 */
export function getMappedErrorByCode(errorCode: string): ErrorMapping | undefined {
  return ERROR_CODE_MAPPINGS[errorCode];
}

/**
 * Check if a status code has a mapped message
 */
export function hasMappedError(statusCode: number): boolean {
  return statusCode in ERROR_MAPPINGS;
}

/**
 * Check if an error code has a mapped configuration
 */
export function hasErrorCodeMapping(errorCode: string): boolean {
  return errorCode in ERROR_CODE_MAPPINGS;
}

/**
 * Get action for an error code (convenience function)
 * @returns The action type or 'toast' as default
 */
export function getErrorAction(errorCode: string): ErrorMapping['action'] {
  const mapping = ERROR_CODE_MAPPINGS[errorCode];
  return mapping?.action ?? 'toast';
}
