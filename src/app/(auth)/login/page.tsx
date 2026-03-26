import React from 'react';
import { LoginForm } from './components/LoginForm';
import { GoogleAuthButton } from './components/GoogleAuthButton';

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif italic text-4xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2 shrink-0">
          BruteForce
        </h1>
        <p className="text-[13.5px] text-muted-foreground font-medium">
          Outwork. Outsolve. Outrank.
        </p>
      </div>

      <GoogleAuthButton />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="glass px-3 text-muted-foreground font-medium tracking-widest rounded-full">Or continue with</span>
        </div>
      </div>

      <LoginForm />
    </>
  );
}
