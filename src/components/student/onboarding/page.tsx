"use client";
import React from 'react';
import { useOnboarding } from './hooks/useOnboarding';
import { ProgressBar } from './components/ProgressBar';
import { OnboardingStep1 } from './components/OnboardingStep1';
import { OnboardingStep2 } from './components/OnboardingStep2';
import { OnboardingStep3 } from './components/OnboardingStep3';
import { Modal } from '../../../app/(auth)/shared/components/Modal';

export default function OnboardingPage() {
  const { step, setStep, data, setData, confirmChecked, setConfirmChecked, loading, submitOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <Modal width="max-w-[480px]">
        <ProgressBar step={step} />
        {step === 1 && <OnboardingStep1 data={data} setData={setData} setStep={setStep} />}
        {step === 2 && <OnboardingStep2 data={data} setData={setData} setStep={setStep} />}
        {step === 3 && <OnboardingStep3 data={data} setStep={setStep} confirmChecked={confirmChecked} setConfirmChecked={setConfirmChecked} submitOnboarding={submitOnboarding} loading={loading} />}
      </Modal>
    </div>
  );
}
