import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PracticeQuestion } from '@/types/student/index.types';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: PracticeQuestion;
  onSubmit: (description: string) => void;
  loading?: boolean;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  question,
  onSubmit,
  loading = false
}) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (!loading) {
        onSubmit(description);
      }
    }
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-[var(--easy)] bg-[var(--easy)]/10 border-[var(--easy)]/20';
      case 'MEDIUM': return 'text-[var(--medium)] bg-[var(--medium)]/10 border-[var(--medium)]/20';
      case 'HARD': return 'text-[var(--hard)] bg-[var(--hard)]/10 border-[var(--hard)]/20';
      default: return 'text-muted-foreground bg-muted border-border/40';
    }
  };

  const getPlatformShort = (platform: string) => {
    if (!platform) return '';
    if (platform.toLowerCase().includes('leetcode')) return 'LC';
    if (platform.toLowerCase().includes('gfg')) return 'GFG';
    return platform;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-primary/10">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-lg font-semibold text-foreground">Add <span className='text-primary' >Bookmark</span></DialogTitle>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="p-6">
          {/* QUESTION INFO */}
          <div className="mb-6 p-4 rounded-2xl bg-accent/20 border border-border/40">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-foreground">{question.question_name } </h3>
              <span className={`px-2 py-1 rounded border text-xs font-semibold ${getLevelColor(question.level)}`}>
                {question.level} 
              </span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Why did you bookmark this question? Add your notes here..."
                className="min-h-[100px] resize-none w-full p-3 border border-border/40 rounded-2x  text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            {/* ACTIONS */}
            <DialogFooter className="px-6 py-4">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 bg-muted-foreground! text-white!"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Adding...' : 'Add Bookmark'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
