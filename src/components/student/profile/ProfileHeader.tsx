// src/components/student/profile/ProfileHeader.tsx
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

export function ProfileHeader({ student, canEdit, onEditProfile, onShowTopicProgress, onEditUsername }: ProfileHeaderProps) {
   

    return (
        <div className="glass borderless p-8 mb-8 rounded-[var(--radius-xl)]">
            <div className="flex items-center justify-between">
                {/* LEFT: Profile Info */}
                <div className="flex items-center gap-6">
                    {/* Profile Image */}
                    <div className="relative">
                        <div className="w-35 h-35 overflow-hidden border-2 glass hover-glow transition-all duration-200 hover:scale-105 rounded-full border-[var(--border)]">
                            {student.profileImageUrl ? (
                                <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                               <ProfileAvatar username={student.name} size={140} />
                            )}
                        </div>
                    </div>

                    {/* Name and Metadata */}
                    <div>
                        <h1 className="font-bold mb-1 text-[var(--text-3xl)] text-[var(--foreground)]">
                            {student.name}
                        </h1>
                        <div className="flex items-center gap-1.5 mb-3">
                            <p className="font-mono text-[var(--text-base)] text-[var(--text-secondary)]">
                                @{student.username}
                            </p>
                            <p>
                                {canEdit && onEditUsername && (
                                    <button
                                        onClick={onEditUsername}
                                        className="p-1 rounded-lg hover:bg-[var(--accent-primary)]/20 transition-all duration-200 flex items-center justify-center text-[var(--accent-primary)] mt-0.5"
                                        title="Edit username"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </button>
                                )}
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-3 text-[var(--text-sm)] text-[var(--text-secondary)]">
                            {student.batch && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent-primary)] text-[var(--primary-foreground)]">
                                    <GraduationCap className="w-4 h-4" />
                                    Batch {student.batch} {student.year && `(${student.year})`}
                                </span>
                            )}
                            {student.city && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent-secondary)] text-[var(--secondary-foreground)]">
                                    <MapPin className="w-4 h-4" />
                                    {student.city}
                                </span>
                            )}
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                                ID: {student.enrollmentId}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onEditProfile}
                            className="hover-glow"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    )}
                    {canEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onShowTopicProgress}
                            className="hover-glow flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Topic Progress
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
