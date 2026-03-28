import { handleApiError, showSuccess, showDeleteSuccess } from './toast-system';

// Re-export the new toast system functions for backward compatibility
export const handleError = handleApiError;
export { showSuccess, showDeleteSuccess };
