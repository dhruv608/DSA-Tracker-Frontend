// src/components/student/profile/ProfileInfo.tsx
import React from 'react';
import { CheckCircle2, Code, ExternalLink } from 'lucide-react';
import { StudentProfile } from '@/types/student';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';

interface ProfileInfoProps {
  student: StudentProfile;
  canEdit?: boolean;
  onEditUsername?: () => void;
}


export function ProfileInfo({ student }: ProfileInfoProps) {
  return (
    <div className="glass p-6 rounded-[var(--radius-lg)]">
      <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
        <Code className="w-5 h-5 text-[var(--accent-primary)]" />
        Platform Links
      </h3>

      <div className="space-y-4">

        {/*  LeetCode */}
        <div 
          className="flex items-center gap-4 p-3 hover-glow transition-all duration-200 rounded-[var(--radius-lg)] border border-[var(--border)]"
          style={{
            backgroundColor: student.leetcode ? 'var(--accent-secondary)' : 'var(--muted)'
          }}
        >
          <div 
            className="w-11 h-11 flex items-center justify-center rounded-2xl"
            
          >
            <LeetCodeIcon className="w-8! h-8! text-primary" />
          </div>

          <div className="flex-1">
            <div className="font-semibold text-[var(--text-sm)] text-[var(--foreground)]">
              LeetCode
            </div>
            <div className="font-mono text-[var(--text-xs)] text-[var(--text-secondary)]">
              {student.leetcode || 'Not linked'}
            </div>
          </div>

          {student.leetcode && (
            <a
              href={`https://leetcode.com/${student.leetcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-2xl hover:bg-[var(--accent-primary)]/20 transition-all duration-200 text-[var(--accent-primary)]"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* 🔷 GFG */}
        <div 
          className="flex items-center gap-4 p-3 hover-glow transition-all duration-200 rounded-2xl border border-[var(--border)]"
          style={{
            backgroundColor: student.gfg ? 'var(--accent-secondary)' : 'var(--muted)'
          }}
        >
          <div 
            className="w-11 h-11 flex items-center justify-center "
            
          >
            <GeeksforGeeksIcon className="w-8! h-8! text-primary" />
          </div>

          <div className="flex-1">
            <div className="font-semibold text-[var(--text-sm)] text-[var(--foreground)]">
              GFG
            </div>
            <div className="font-mono text-[var(--text-xs)] text-[var(--text-secondary)]">
              {student.gfg || 'Not linked'}
            </div>
          </div>

          {student.gfg && (
            <a
              href={`https://auth.geeksforgeeks.org/user/${student.gfg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-[var(--accent-primary)]/20 transition-all duration-200 text-[var(--accent-primary)]"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
