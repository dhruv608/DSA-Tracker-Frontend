/**
 * 🔍 STORAGE TEST UTILITY
 * Run this in your browser console to understand the storage system
 */

export const testStorageSystem = () => {
  console.log('🔍 === STORAGE SYSTEM TEST ===');
  
  // 1. Check localStorage (CLIENT-SIDE)
  console.log('📱 localStorage accessToken:', localStorage.getItem('accessToken'));
  console.log('📱 localStorage user:', localStorage.getItem('user'));
  
  // 2. Check document.cookie (CLIENT-SIDE)
  console.log('🍪 document.cookie (all):', document.cookie);
  
  // 3. Parse document.cookie to show individual cookies
  const parseCookies = () => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const cookieObj: Record<string, string> = {};
    
    cookies.forEach(cookie => {
      const [name, value] = cookie.split('=');
      if (name && value) {
        cookieObj[name] = value;
      }
    });
    
    return cookieObj;
  };
  
  const allCookies = parseCookies();
  console.log('🍪 Parsed cookies:', allCookies);
  console.log('🍪 accessToken from cookie:', allCookies.accessToken);
  console.log('🍪 refreshToken exists:', 'refreshToken' in allCookies ? '✅ YES' : '❌ NO');
  
  // 4. Test setting a cookie (CLIENT-SIDE)
  console.log('🧪 Testing cookie setting...');
  document.cookie = 'test=value; path=/';
  console.log('🧪 After setting:', document.cookie);
  
  // 5. Clean up test cookie
  document.cookie = 'test=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  console.log('🎯 === STORAGE TEST COMPLETE ===');
  console.log('');
  console.log('💡 Key Insights:');
  console.log('- localStorage works in components, NOT in middleware');
  console.log('- cookies work in middleware, NOT in server components');
  console.log('- document.cookie shows NON-HttpOnly cookies only');
  console.log('- HTTP-only cookies are invisible to JavaScript for security');
  console.log('- Your system bridges client and server storage');
};

// Auto-run in development (only on client-side)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run after page loads to avoid hydration issues
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testStorageSystem);
  } else {
    setTimeout(testStorageSystem, 1000);
  }
}
