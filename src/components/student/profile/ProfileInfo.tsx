// src/components/student/profile/ProfileInfo.tsx
import React from 'react';
import { Code, CheckCircle2, ExternalLink } from 'lucide-react';
import { StudentProfile } from '@/types/student';

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
        <div 
          className="flex items-center gap-4 p-4 hover-glow transition-all duration-200 rounded-[var(--radius-lg)] border border-[var(--border)]"
          style={{
            backgroundColor: student.leetcode ? 'var(--accent-secondary)' : 'var(--muted)'
          }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold rounded-[var(--radius-md)]"
            style={{
              backgroundColor: student.leetcode ? 'var(--accent-primary)' : 'var(--muted)',
              color: student.leetcode ? 'var(--primary-foreground)' : 'var(--text-secondary)'
            }}
          >
            <Code className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--text-sm)] text-[var(--foreground)]">LeetCode</div>
            <div className="font-mono text-[var(--text-xs)] text-[var(--text-secondary)]">{student.leetcode || 'Not linked'}</div>
          </div>
          {student.leetcode && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
              <a
                href={`https://leetcode.com/${student.leetcode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/20 transition-all duration-200 text-[var(--accent-primary)]"
                title="View LeetCode profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        <div 
          className="flex items-center gap-4 p-4 hover-glow transition-all duration-200 rounded-[var(--radius-lg)] border border-[var(--border)]"
          style={{
            backgroundColor: student.gfg ? 'var(--accent-secondary)' : 'var(--muted)'
          }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold rounded-[var(--radius-md)]"
            style={{
              backgroundColor: student.gfg ? 'var(--accent-primary)' : 'var(--muted)',
              color: student.gfg ? 'var(--primary-foreground)' : 'var(--text-secondary)'
            }}
          >
            <Code className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--text-sm)] text-[var(--foreground)]">GeeksforGeeks</div>
            <div className="font-mono text-[var(--text-xs)] text-[var(--text-secondary)]">{student.gfg || 'Not linked'}</div>
          </div>
          {student.gfg && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
              <a
                href={`https://auth.geeksforgeeks.org/user/${student.gfg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/20 transition-all duration-200 text-[var(--accent-primary)]"
                title="View GeeksforGeeks profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
