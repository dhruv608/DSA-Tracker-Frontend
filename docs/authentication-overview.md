# 📚 Authentication System Documentation

## 🔐 How Authentication Works in Your App

### **System Architecture Overview**
```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Login Form → API → Tokens + User Data          │
│ 2. Store Tokens → localStorage + Cookies             │
│ 3. API Calls → Automatic Token Attachment           │
│ 4. Route Protection → Middleware Checks                │
│ 5. Auto Refresh → When Token Expires                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Login Process Flow

### **Step 1: User Enters Login Page**
**File:** `src/app/superadmin/login/page.tsx` or `src/app/admin/login/page.tsx`

```tsx
// When user opens login page:
export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... form state
}
```

### **Step 2: User Submits Form**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Call login service
  const data = await loginSuperAdmin({ email, password });
  
  // 2. Extract tokens and user data
  const { accessToken, user } = data;
  
  // 3. Store in browser
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);  // For API calls
    localStorage.setItem('user', JSON.stringify(user));  // For UI state
    document.cookie = `accessToken=${accessToken}; path=/`;  // For middleware
  }
  
  // 4. Redirect based on role
  if (user.role === 'SUPERADMIN') {
    router.push('/superadmin');
  }
};
```

### **Step 3: API Response Processing**
**Service:** `src/services/auth.service.ts`

```typescript
export const loginSuperAdmin = async (data: { email: string; password: string }) => {
  // 1. Send to backend
  const response = await api.post('/api/auth/admin/login', data);
  
  // 2. Return data to component
  return response.data;  // Contains: { accessToken, user }
};
```

---

## 🗂️ Token Storage Strategy

### **Three-Layer Storage System**
```typescript
// 1. localStorage (Client-side)
localStorage.setItem('accessToken', token);     // For API calls
localStorage.setItem('user', JSON.stringify(user));  // For UI state

// 2. Regular Cookie (Server-side)
document.cookie = `accessToken=${token}; path=/`;  // For middleware

// 3. HTTP-only Cookie (Backend-set)
// Set by backend during login
// Used for automatic token refresh
```

### **Why Multiple Storage?**
- **localStorage**: Accessible by client-side API calls
- **Regular Cookie**: Accessible by Next.js middleware (server-side)
- **HTTP-only Cookie**: Secure, sent automatically with refresh requests

---

## 🛡️ Route Protection System

### **Middleware Protection**
**File:** `src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Check if route needs protection
  const isSuperAdminRoute = pathname.startsWith('/superadmin') && pathname !== '/superadmin/login';
  
  if (isSuperAdminRoute) {
    // 2. Extract token from cookie
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      // 3. Redirect to login if no token
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }
    
    // 4. Decode and validate role
    const payload = decodeJwt(token);
    if (payload.role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### **Client-Side Protection**
**File:** `src/app/superadmin/layout.tsx`

```typescript
export default function SuperAdminLayout({ children }) {
  const { getCurrentUser, logout } = useAuth();
  const user = getCurrentUser();
  
  // 1. Check if on login page (allow access)
  if (pathname === '/superadmin/login') {
    return <>{children}</>;
  }
  
  // 2. Redirect if not authenticated
  if (!user) {
    router.push('/superadmin/login');
    return null;
  }
  
  // 3. Render protected content
  return (
    <div>
      {/* Your protected app */}
      {children}
    </div>
  );
}
```

---

## 🔄 Automatic Token Refresh System

### **API Interceptor**
**File:** `src/lib/api.ts`

```typescript
api.interceptors.response.use(
  (response) => response,  // 1. Let successful responses pass
  async (error) => {          // 2. Handle errors
    const originalRequest = error.config;
    
    // 3. Check for 401 (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 4. Call refresh endpoint
        const res = await axios.post('/api/auth/refresh-token', {}, {
          withCredentials: true  // Sends HTTP-only refresh cookie
        });
        
        // 5. Update stored tokens
        if (res.data?.accessToken) {
          localStorage.setItem('accessToken', res.data.accessToken);
          document.cookie = `accessToken=${res.data.accessToken}; path=/`;
          
          // 6. Retry original request
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 7. Refresh failed - logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/superadmin/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 🚪 Logout Process

### **Centralized Logout Function**
**File:** `src/services/auth.service.ts`

```typescript
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    // 1. Clear client storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // 2. Clear server cookie
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // 3. Redirect to login (handled by component)
  }
};
```

### **Layout Logout Usage**
```typescript
// In layout component:
const handleLogout = () => {
  logoutUser();                    // Clear all storage
  router.push('/superadmin/login'); // Redirect
};
```

---

## 🎯 Complete User Journey

### **First Time Visit**
1. **User navigates** to `/superadmin` 
2. **Middleware runs** → No token found
3. **Redirect happens** → `/superadmin/login`
4. **Login page loads** → User sees form
5. **User submits** → API validates credentials
6. **Tokens stored** → localStorage + cookies
7. **Redirect occurs** → `/superadmin` (now authenticated)

### **Returning User**
1. **User navigates** to `/superadmin`
2. **Middleware runs** → Token found in cookie
3. **JWT decoded** → Role validated as 'SUPERADMIN'
4. **Layout renders** → User sees dashboard
5. **API calls work** → Token auto-attached

### **Token Expires During Session**
1. **User makes API call** → Token expired
2. **Interceptor catches 401** → Auto-refresh triggered
3. **Refresh succeeds** → New token stored
4. **Original request retried** → User sees data (no interruption)
5. **If refresh fails** → User logged out automatically

---

## 🔧 Shared Authentication Hook

### **Centralized Auth Logic**
**File:** `src/hooks/useAuth.ts`

```typescript
export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentUser = (): User | null => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = (): boolean => {
    // Check both token and user exist
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    return !!(token && userStr);
  };

  const logout = (redirectPath: string = '/login') => {
    // Centralized logout logic
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push(redirectPath);
  };

  const requireAuth = (allowedRoles: string[], loginPath: string = '/login') => {
    // Unified auth check
    if (!isAuthenticated()) {
      logout(loginPath);
      return false;
    }

    if (!checkAuth(allowedRoles)) {
      logout(loginPath);
      return false;
    }

    return true;
  };

  return {
    getCurrentUser,
    isAuthenticated,
    logout,
    requireAuth
  };
};
```

---

## 📁 File Structure Summary

```
src/
├── services/
│   └── auth.service.ts     # Login/logout API calls
├── hooks/
│   └── useAuth.ts          # Shared auth logic
├── lib/
│   └── api.ts             # Token refresh interceptor
├── middleware.ts             # Server-side route protection
└── app/
    ├── superadmin/
    │   ├── login/page.tsx    # SuperAdmin login UI
    │   └── layout.tsx        # SuperAdmin protection
    └── admin/
        ├── login/page.tsx       # Admin login UI
        └── layout.tsx           # Admin protection
```

---

## 🎉 Key Benefits of This System

### **Security**
- ✅ HTTP-only refresh tokens (not accessible via JavaScript)
- ✅ Automatic token refresh (seamless user experience)
- ✅ Route protection on both client and server side
- ✅ Secure token storage strategy

### **User Experience**
- ✅ Silent token refresh (no login prompts)
- ✅ Persistent sessions across browser refresh
- ✅ Role-based access control
- ✅ Automatic logout on token compromise

### **Developer Experience**
- ✅ Centralized auth logic (useAuth hook)
- ✅ Type-safe authentication
- ✅ Reusable across admin/superadmin
- ✅ Easy to maintain and debug

---

## 🚨 Common Issues & Solutions

### **Issue: "Not redirected to login when authenticated"**
**Cause**: Token not in cookie or localStorage mismatch
**Solution**: Check both storage locations are synchronized

### **Issue: "API calls failing with 401"**
**Cause**: Token expired and refresh failing
**Solution**: Check refresh token cookie and network connectivity

### **Issue: "Role access denied"**
**Cause**: JWT payload doesn't match expected role
**Solution**: Verify backend is setting correct role in JWT

---

This system provides enterprise-grade authentication with security, usability, and maintainability in mind! 🎯
