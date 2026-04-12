"use client";

import { StudentLoginForm } from '@/components/auth';

export default function LoginPage() {
  return (
    <div className=' min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
      <StudentLoginForm />
    </div>
  );
}
