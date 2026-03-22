# 🚀 Authentication Quick Reference

## 📁 Key Files & Their Jobs

| File | Purpose | Key Functions |
|------|----------|----------------|
| `src/services/auth.service.ts` | API calls | `loginAdmin()`, `loginSuperAdmin()`, `logoutUser()` |
| `src/hooks/useAuth.ts` | Shared auth logic | `getCurrentUser()`, `isAuthenticated()`, `logout()`, `requireAuth()` |
| `src/lib/api.ts` | Token management | Auto-refresh interceptor |
| `src/middleware.ts` | Route protection | Server-side auth checks |
| `src/app/superadmin/login/page.tsx` | SuperAdmin login UI | Form handling, token storage |
| `src/app/admin/login/page.tsx` | Admin login UI | Form handling, token storage |
| `src/app/superadmin/layout.tsx` | SuperAdmin protection | Client-side auth checks |
| `src/app/admin/layout.tsx` | Admin protection | Client-side auth checks |

---

## 🔐 Common Code Patterns

### **Check if User is Authenticated**
```typescript
import { useAuth } from '@/hooks/useAuth';

const { isAuthenticated, getCurrentUser } = useAuth();

if (!isAuthenticated()) {
  // Redirect to login
  return;
}

const user = getCurrentUser();
if (user?.role !== 'SUPERADMIN') {
  // Access denied
  return;
}
```

### **Login Form Handling**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const data = await loginSuperAdmin({ email, password });
    
    // Store tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    document.cookie = `accessToken=${data.accessToken}; path=/`;
    
    // Redirect
    router.push('/superadmin');
  } catch (error) {
    setError('Login failed');
  }
};
```

### **Logout Function**
```typescript
import { logoutUser } from '@/services/auth.service';

const handleLogout = () => {
  logoutUser();                    // Clear all storage
  router.push('/superadmin/login'); // Redirect
};
```

### **Protected Route Check**
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  const { requireAuth } = useAuth();
  
  // Automatically handles auth check and redirect
  const isAuthorized = requireAuth(['SUPERADMIN'], '/superadmin/login');
  
  if (!isAuthorized) {
    return null; // User redirected automatically
  }
  
  return <div>Protected Content</div>;
}
```

---

## 🗂️ Token Storage Quick Guide

### **Store Tokens (After Login)**
```typescript
// 1. For API calls
localStorage.setItem('accessToken', token);

// 2. For middleware
document.cookie = `accessToken=${token}; path=/`;

// 3. User data for UI
localStorage.setItem('user', JSON.stringify(user));
```

### **Retrieve Tokens**
```typescript
// For API calls (automatic in api.ts)
const token = localStorage.getItem('accessToken');

// For UI state
const user = JSON.parse(localStorage.getItem('user') || 'null');

// For middleware (automatic)
const token = request.cookies.get('accessToken')?.value;
```

### **Clear Tokens (Logout)**
```typescript
// Clear everything
localStorage.removeItem('accessToken');
localStorage.removeItem('user');
document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
```

---

## 🔄 API Call Patterns

### **Authenticated API Call**
```typescript
import api from '@/lib/api';

// Token automatically attached by interceptor
const response = await api.get('/api/superadmin/cities');
const data = response.data;
```

### **Handling Token Expiry**
```typescript
// Automatic! No manual handling needed
// Interceptor catches 401 and refreshes token
// Original request retried with new token
// User sees no interruption
```

---

## 🛡️ Security Best Practices

### **DO ✅**
- Use HTTPS endpoints
- Store tokens securely (HTTP-only cookies for refresh)
- Implement automatic token refresh
- Clear all storage on logout
- Validate roles on protected routes

### **DON'T ❌**
- Store sensitive data in plain text
- Ignore token expiration
- Use same login for different roles without validation
- Forget to clear cookies on logout

---

## 🐛 Common Debugging Steps

### **User Not Authenticated?**
1. Check localStorage: `localStorage.getItem('accessToken')`
2. Check cookie: `document.cookie`
3. Check middleware: Is token being passed correctly?
4. Check JWT: Is token valid and not expired?

### **API Calls Failing?**
1. Check token in localStorage
2. Check network tab for 401 errors
3. Check if refresh token cookie exists
4. Check interceptor is working

### **Role Access Issues?**
1. Decode JWT: `JSON.parse(atob(token.split('.')[1]))`
2. Check role field: Does it match expected role?
3. Check role validation in middleware and layout

---

## 🎯 Quick Implementation Checklist

### **New Protected Page:**
- [ ] Import `useAuth` hook
- [ ] Call `requireAuth()` with allowed roles
- [ ] Handle unauthorized case
- [ ] Test with different user roles

### **New Login Form:**
- [ ] Use appropriate login service (`loginAdmin` or `loginSuperAdmin`)
- [ ] Store tokens in all 3 locations
- [ ] Handle role-based redirect
- [ ] Add error handling

### **Logout Implementation:**
- [ ] Use centralized `logoutUser()` function
- [ ] Clear all storage locations
- [ ] Redirect to appropriate login page

---

This reference helps you implement authentication consistently across your app! 🎉
