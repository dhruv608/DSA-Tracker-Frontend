"use client";
import React from 'react';
import { useOnboardingModal } from './hooks/useOnboardingModal';
import { ProgressBar } from './components/ProgressBar';
import { OnboardingStep1 } from './components/OnboardingStep1';
import { OnboardingStep2 } from './components/OnboardingStep2';
import { OnboardingStep3 } from './components/OnboardingStep3';
import { Modal } from '../../../app/(auth)/shared/components/Modal';

interface OnboardingModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, user, onClose }: OnboardingModalProps) {
  const { step, setStep, data, setData, confirmChecked, setConfirmChecked, loading, submitOnboarding } = useOnboardingModal(onClose);

  // Debug current step
  React.useEffect(() => {
    console.log("OnboardingModal - Current step:", step);
  }, [step]);

  // Initialize data with existing user info
  React.useEffect(() => {
    if (user) {
      const username = user?.username || user?.user?.username || user?.student?.username || user?.student?.user?.username;
      const leetcode = user?.leetcode || user?.user?.leetcode || user?.student?.leetcode || user?.student?.user?.leetcode;
      const gfg = user?.gfg || user?.user?.gfg || user?.student?.gfg || user?.student?.user?.gfg;

      const cityId = user?.student?.cityId || user?.student?.city_id || user?.cityId || user?.city_id;
      const batchId = user?.student?.batchId || user?.student?.batch_id || user?.batchId || user?.batch_id;

      setData((prev: any) => ({
        ...prev,
        username: username || '',
        leetcode_id: leetcode || '',
        gfg_id: gfg || '',
        city_id: cityId || prev.city_id,
        batch_id: batchId || prev.batch_id
      }));
    }
  }, [user, setData]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)'}}
    >
      <Modal width="max-w-[480px]">
        <ProgressBar step={step} />
        {step === 1 && <OnboardingStep1 data={data} setData={setData} setStep={setStep} />}
        {step === 2 && <OnboardingStep2 data={data} setData={setData} setStep={setStep} />}
        {step === 3 && (
          <OnboardingStep3
            data={data}
            setStep={setStep}
            confirmChecked={confirmChecked}
            setConfirmChecked={setConfirmChecked}
            submitOnboarding={submitOnboarding}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
}
