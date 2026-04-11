# Error Handling System

Industry-level error handling for DSA Tracker with smart action-based responses.

## Architecture

```
Backend Error → Error Factory → Error Mapper → Action Handler → UX
                    ↓                ↓              ↓
              (normalize)      (message+      (toast/inline/
                               action lookup)   logout/refresh)
```

**Priority Chain:** `errorCode` > `statusCode` > `backend message` > `fallback`

## Quick Reference

### Basic Usage

```typescript
import { handleError, getErrorDetails, canRefreshToken } from '@/errors';

// 1. Automatic handling with smart actions
try {
  await api.post('/api/questions', data);
} catch (error) {
  handleError(error, { context: 'create-question' });
  // ↑ Automatically: shows toast OR inline error OR logs out based on error code
}

// 2. Form handling - get details without triggering actions
try {
  await login(credentials);
} catch (error) {
  const { message, action, type } = getErrorDetails(error);
  
  if (action === 'inline') {
    setFormError(message); // Show in form, not toast
  } else {
    handleError(error); // Let it handle normally
  }
}

// 3. Check specific error conditions
if (canRefreshToken(error)) {
  // Silently retry with refresh token
}

if (requiresLogout(error)) {
  // Already handled by system, but you can add custom cleanup
}
```

## Error Actions

| Action | Behavior | Example Error Codes |
|--------|----------|---------------------|
| `toast` | Show toast notification | SERVER_ERROR, NOT_FOUND |
| `inline` | Return message for form display | INVALID_CREDENTIALS, EMAIL_EXISTS |
| `logout` | Clear tokens + redirect to login | INVALID_TOKEN, TOKEN_MISSING |
| `refresh` | Trigger token refresh flow | TOKEN_EXPIRED |
| `redirect` | Toast + redirect to path | (configurable) |
| `silent` | No UI feedback | Background operations |

## Error Code Mapping

### Authentication (401)

| Code | Status | Action | Message |
|------|--------|--------|---------|
| `TOKEN_EXPIRED` | 401 | `refresh` | "Your session has expired. Refreshing..." |
| `INVALID_TOKEN` | 401 | `logout` | "Your session is invalid. Please log in again." |
| `INVALID_CREDENTIALS` | 401 | `inline` | "Invalid email or password." |
| `TOKEN_MISSING` | 401 | `logout` | "Please log in to continue." |

### Authorization (403)

| Code | Action | Message |
|------|--------|---------|
| `INSUFFICIENT_PERMISSIONS` | `toast` | "You don't have permission..." |

### Validation (400)

| Code | Action | Message |
|------|--------|---------|
| `VALIDATION_ERROR` | `inline` | "Please check your input..." |
| `INVALID_INPUT` | `inline` | "Invalid input provided." |
| `REQUIRED_FIELD` | `inline` | "This field is required." |
| `EMAIL_EXISTS` | `inline` | "An account with this email already exists." |
| `USERNAME_TAKEN` | `inline` | "This username is already taken." |

### Resources (404/409)

| Code | Action | Message |
|------|--------|---------|
| `STUDENT_NOT_FOUND` | `toast` | "Student not found." |
| `QUESTION_NOT_FOUND` | `toast` | "Question not found." |
| `DUPLICATE_ENTRY` | `toast` | "This item already exists." |

### Server (500)

| Code | Action | Message |
|------|--------|---------|
| `SERVER_ERROR` | `toast` | "Something went wrong on our side..." |
| `DATABASE_ERROR` | `toast` | "Something went wrong. Please try again." |
| `EXTERNAL_SERVICE_ERROR` | `toast` | "External service temporarily unavailable." |

## Handler Options

```typescript
handleError(error, {
  context: 'login',           // For debugging logs
  forceAction: 'inline',      // Override default action
  fallbackMessage: 'Custom error', // Override message
  redirectPath: '/custom',    // For logout/redirect actions
  manual: true,               // Don't execute actions, just return result
});
```

## API Client Integration

The API client (`@/api/client.ts`) automatically:

1. **TOKEN_EXPIRED** → Attempts refresh token, retries request
2. **INVALID_TOKEN/TOKEN_MISSING** → Logs out + redirects
3. Other errors → Delegates to `handleError()`

```typescript
import apiClient from '@/api/client';

// Token refresh happens automatically
const response = await apiClient.get('/api/protected-resource');

// No manual error handling needed - client shows toasts automatically
```

## Form Handling Pattern

```typescript
import { getErrorDetails } from '@/errors';

const handleSubmit = async (values) => {
  setFieldErrors({}); // Clear previous errors
  
  try {
    await submitForm(values);
  } catch (error) {
    const { message, action, error: appError } = getErrorDetails(error);
    
    // Handle inline validation errors
    if (action === 'inline' || appError.errorCode?.includes('VALIDATION')) {
      // Map to specific fields
      if (appError.errorCode === 'EMAIL_EXISTS') {
        setFieldErrors({ email: message });
      } else if (appError.errorCode === 'INVALID_PASSWORD') {
        setFieldErrors({ password: message });
      } else {
        setFormError(message); // General form error
      }
      return;
    }
    
    // Re-throw for other actions (toast/logout handled by system)
    throw error;
  }
};
```

## Adding New Error Codes

1. **Backend**: Add error code in `@/DSA-Tracker-Backend/src/utils/errorMapper.ts`

```typescript
NEW_ERROR_CODE: { 
  message: 'User friendly message', 
  type: 'error' | 'warning' | 'info',
  action: 'toast' | 'inline' | 'logout' | 'refresh' | 'silent'
}
```

2. **Frontend**: Add to `@/errors/types/index.ts` and `@/errors/error-mapper.ts`

## Files Structure

```
src/errors/
├── types/
│   └── index.ts          # ErrorAction, ErrorMapping, COMMON_ERROR_CODES
├── error-factory.ts      # createAppError(), isNetworkError(), isAuthError()
├── error-mapper.ts       # ERROR_MAPPINGS, ERROR_CODE_MAPPINGS, helpers
├── error-handler.ts      # handleError(), getErrorDetails(), predicates
├── api-client.ts         # (optional) API integration
└── README.md             # This file
```

## Exports

```typescript
// Types
export type { AppError, ErrorMapping, ErrorAction, ErrorResult, HandlerOptions };
export { COMMON_ERROR_CODES };

// Main API
export { handleError, getErrorDetails, getErrorMessage, handleErrorSilent };

// Predicates
export { checkIsNetworkError, checkIsAuthError, requiresLogout, canRefreshToken };

// Mappers (for advanced use)
export { getMappedError, getMappedErrorByCode, getErrorAction };
```

## Best Practices

1. **Always use error codes** - Don't rely solely on status codes
2. **Use `getErrorDetails()` for forms** - Prevents unwanted toasts
3. **Let API client handle auth errors** - Don't duplicate logout logic
4. **Add context** - Helps with debugging: `handleError(error, { context: 'payment' })`
5. **Check predicates before handling** - `if (canRefreshToken(error)) { ... }`

## Default Fallback

When no mapping is found:

```typescript
{
  message: "Something went wrong. Please try again.",
  type: "error",
  action: "toast"
}
```

Client errors (4xx) use backend message if available. Server errors (5xx) use generic message.
