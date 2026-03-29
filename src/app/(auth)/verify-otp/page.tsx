import React from 'react';
import { OtpForm } from './components/OtpForm';
import { Modal } from '../shared/components/Modal';

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <Modal>
        <button className="absolute top-6 right-6 text-muted-foreground transition-colors focus:outline-none opacity-0 pointer-events-none">
          ✕
        </button>
        <OtpForm />
      </Modal>
    </div>
  );
}
