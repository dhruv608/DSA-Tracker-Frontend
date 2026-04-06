// 🌟 Code by Ayush Chaurasiya — Eat 💻 Sleep 😴 Code ⚡ Repeat 💪

"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, BarChart3, GraduationCap, MapPin, Edit3 } from 'lucide-react';
import { StudentProfile } from '@/types/student';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

interface ProfileHeaderProps {
    student: StudentProfile;
    canEdit: boolean;
    onEditProfile: () => void;
    onShowTopicProgress: () => void;
    onEditUsername?: () => void;
}

export function ProfileHeader({
    student,
    canEdit,
    onEditProfile,
    onShowTopicProgress,
    onEditUsername
}: ProfileHeaderProps) {

    return (
        <div className="glass borderless p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 rounded-[var(--radius-xl)]">

            {/* MAIN CONTAINER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">

                    {/* PROFILE IMAGE */}
                    <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-35 lg:h-35 overflow-hidden border-2 glass hover-glow transition-all duration-200 hover:scale-105 rounded-full border-[var(--border)]">
                            {student.profileImageUrl ? (
                                <img
                                    src={student.profileImageUrl}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ProfileAvatar username={student.name} size={140} />
                            )}
                        </div>
                    </div>

                    {/* TEXT INFO */}
                    <div className="w-full">

                        <h1 className="font-bold text-xl sm:text-2xl lg:text-[var(--text-3xl)] text-[var(--foreground)] mb-1">
                            {student.name}
                        </h1>

                        <div className="flex items-center gap-2 mb-3">
                            <p className="font-mono text-sm sm:text-base text-[var(--text-secondary)]">
                                @{student.username}
                            </p>

                            {canEdit && onEditUsername && (
                                <button
                                    onClick={onEditUsername}
                                    className="-mt-4 p-1 rounded-lg hover:bg-[var(--accent-primary)]/20 transition text-[var(--accent-primary)]"
                                >
                                    <Edit3 className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* METADATA */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">

                            {student.batch && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-primary)] text-[var(--primary-foreground)]">
                                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Batch {student.batch} {student.year && `(${student.year})`}
                                </span>
                            )}

                            {student.city && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-secondary)] text-[var(--secondary-foreground)]">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {student.city}
                                </span>
                            )}

                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                                ID: {student.enrollmentId}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">

                    {canEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onEditProfile}
                            className="w-full sm:w-auto hover-glow justify-center"
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onShowTopicProgress}
                        className="w-full sm:w-auto hover-glow justify-center"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Topic Progress
                    </Button>
                </div>
            </div>
        </div>
    );
}