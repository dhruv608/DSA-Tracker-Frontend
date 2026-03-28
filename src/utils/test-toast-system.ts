// Test file to verify the toast notification system with Lucide icons
// This can be used in development to test all notification types

import { showToast, handleApiError, showSuccess, showDeleteSuccess, errorMap, successMessages } from './toast-system';
import { operationToasts } from '@/components/ui/toast-provider';

// Mock API error for testing
const mockApiError = {
  response: {
    status: 404,
    data: {
      success: false,
      message: 'Resource not found',
      code: 'NOT_FOUND_ERROR'
    }
  }
};

// Mock network error
const mockNetworkError = {
  code: 'ERR_NETWORK',
  message: 'Network Error'
};

// Test function to verify all toast notifications with Lucide icons
export const testToastSystem = () => {
  console.log('🧪 Testing Toast Notification System with Lucide Icons');
  
  // Test success notifications with Lucide icons
  console.log('✅ Testing success notifications with Lucide icons...');
  showSuccess('LOGIN');
  setTimeout(() => showSuccess('STUDENT_CREATED'), 1000);
  setTimeout(() => showSuccess('ADMIN_UPDATED'), 2000);
  setTimeout(() => showSuccess('CITY_CREATED'), 3000);
  setTimeout(() => showSuccess('BATCH_CREATED'), 4000);
  setTimeout(() => showSuccess('TOPIC_CREATED'), 5000);
  setTimeout(() => showSuccess('FILE_UPLOADED'), 6000);
  
  // Test delete notifications (should show red with trash icon)
  console.log('🗑️ Testing delete notifications (should be red with trash icon)...');
  setTimeout(() => showDeleteSuccess('Admin'), 7000);
  setTimeout(() => showDeleteSuccess('Student'), 8000);
  setTimeout(() => showDeleteSuccess('Topic'), 9000);
  setTimeout(() => showDeleteSuccess('Question'), 10000);
  
  // Test direct operationToasts with Lucide icons
  console.log('🎨 Testing direct Lucide icon toasts...');
  setTimeout(() => operationToasts.login(), 11000);
  setTimeout(() => operationToasts.register(), 12000);
  setTimeout(() => operationToasts.createCity(), 13000);
  setTimeout(() => operationToasts.fileUpload(), 14000);
  setTimeout(() => operationToasts.profileUpdate(), 15000);
  
  // Test error notifications with different error codes
  console.log('❌ Testing error notifications...');
  setTimeout(() => handleApiError(mockApiError, 'Test Context'), 16000);
  setTimeout(() => handleApiError(mockNetworkError, 'Network Test'), 17000);
  
  // Test direct toast calls
  setTimeout(() => showToast.info('This is an info message'), 18000);
  setTimeout(() => showToast.warning('This is a warning message'), 19000);
  setTimeout(() => showToast.loading('Loading test...'), 20000);
  
  // Test custom messages
  setTimeout(() => showSuccess('CUSTOM', 'Custom success message!'), 21000);
  setTimeout(() => showToast.error('Custom error message!'), 22000);
  
  console.log('🎯 Lucide toast system test initiated! Check the UI for beautiful icon notifications.');
};

// Test error mapping
export const testErrorMapping = () => {
  console.log('🗺️ Testing Error Mapping...');
  
  const testErrors = [
    { code: 'AUTH_ERROR', expected: 'Authentication failed. Please check your credentials.' },
    { code: 'VALIDATION_ERROR', expected: 'Please check your input and try again.' },
    { code: 'USER_NOT_FOUND', expected: 'User not found.' },
    { code: 'NETWORK_ERROR', expected: 'Network error. Please check your connection.' },
    { code: 'UNKNOWN_CODE', expected: 'Something went wrong. Please try again.' }
  ];
  
  testErrors.forEach(({ code, expected }) => {
    const mockError = { response: { data: { code } } };
    const message = errorMap[code] || errorMap.ERROR;
    console.log(`Error Code: ${code} -> Message: ${message}`);
    console.log(`Expected: ${expected} ${message === expected ? '✅' : '❌'}`);
  });
};

// Export for use in development console
if (typeof window !== 'undefined') {
  (window as any).testToastSystem = testToastSystem;
  (window as any).testErrorMapping = testErrorMapping;
  console.log('🔧 Test functions available in console:');
  console.log('- testToastSystem() - Test all toast notifications');
  console.log('- testErrorMapping() - Test error code mapping');
}
