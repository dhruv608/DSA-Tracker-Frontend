import React from 'react';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { BackButton } from './components/BackButton';
import { Modal } from '../shared/components/Modal';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            <Modal>
                <BackButton />
                <ForgotPasswordForm />
            </Modal>
        </div>
    );
}
