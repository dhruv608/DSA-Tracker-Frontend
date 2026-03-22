"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      router.push("/");
    } else {
      // If there's no token, redirect back to login
      router.push("/login?error=auth_failed");
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Authenticating...</p>
      </div>
    </div>
  );
}
