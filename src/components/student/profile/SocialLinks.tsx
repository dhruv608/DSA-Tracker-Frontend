// src/components/student/profile/SocialLinks.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon, Github, Linkedin, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '@/types/student';

interface SocialLinksProps {
  student: StudentProfile;
  canEdit: boolean;
  onEditSocialLinks: () => void;
}

export function SocialLinks({ student, canEdit, onEditSocialLinks }: SocialLinksProps) {
  return (
    <div className="glass p-6 rounded-[var(--radius-lg)]">
      <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
        <LinkIcon className="w-5 h-5 text-[var(--accent-primary)]" />
        Social Links
      </h3>

      <div className="space-y-4">
        <a 
          href={student.github || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`flex items-center gap-4 p-4 hover-glow transition-all duration-200 ${student.github ? '' : 'opacity-60 pointer-events-none'} rounded-[var(--radius-lg)] border-border border-[var(--border)]`}
          style={{
            backgroundColor: student.github ? 'var(--accent-secondary)' : 'var(--muted)'
          }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold rounded-[var(--radius-md)]"
            style={{
              backgroundColor: student.github ? 'var(--accent-primary)' : 'var(--muted)',
              color: student.github ? 'var(--primary-foreground)' : 'var(--text-secondary)'
            }}
          >
            <Github className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--text-sm)] text-[var(--foreground)]">GitHub</div>
            <div className="font-mono text-[var(--text-xs)] text-[var(--text-secondary)]">{student.github ? 'Connected' : 'Not connected'}</div>
          </div>
          {student.github && <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />}
        </a>

        <a 
          href={student.linkedin || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`flex items-center gap-4 p-4 hover-glow transition-all duration-200 ${student.linkedin ? '' : 'opacity-60 pointer-events-none'} rounded-[var(--radius-lg)] border-border border-[var(--border)]`}
          style={{
            backgroundColor: student.linkedin ? 'var(--accent-secondary)' : 'var(--muted)'
          }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold rounded-[var(--radius-md)]"
            style={{
              backgroundColor: student.linkedin ? 'var(--accent-primary)' : 'var(--muted)',
              color: student.linkedin ? 'var(--primary-foreground)' : 'var(--text-secondary)'
            }}
          >
            <Linkedin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--text-sm)] text-[var(--foreground)]">LinkedIn</div>
            <div className="font-mono text-[var(--text-xs)] text-[var(--text-secondary)]">{student.linkedin ? 'Connected' : 'Not linked'}</div>
          </div>
          {student.linkedin && <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />}
        </a>
      </div>

      {canEdit && (
        <Button 
          variant="outline" 
          className="w-full mt-6 hover-glow transition-all duration-200 rounded-[var(--radius-lg)]" 
          onClick={onEditSocialLinks}
        >
          Edit Social Links
        </Button>
      )}
    </div>
  );
}
