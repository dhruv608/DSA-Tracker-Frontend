import React, { useState, useEffect } from 'react';
import { X, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: {
    id: number;
    question: {
      id: number;
      question_name: string;
      platform: string;
      level: string;
      type: string;
    };
    description: string | null;
  };
  onSubmit: (description: string) => void;
  loading?: boolean;
}

export const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({
  isOpen,
  onClose,
  bookmark,
  onSubmit,
  loading = false
}) => {
  const [description, setDescription] = useState('');

  // Set initial description when bookmark changes
  useEffect(() => {
    setDescription(bookmark.description || '');
  }, [bookmark]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
  };

  const handleClose = () => {
    setDescription(bookmark.description || '');
    onClose();
  };

  if (!isOpen) return null;

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HARD': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPlatformShort = (platform: string) => {
    if (!platform) return '';
    if (platform.toLowerCase().includes('leetcode')) return 'LC';
    if (platform.toLowerCase().includes('gfg')) return 'GFG';
    return platform;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* MODAL */}
      <div className="relative bg-background border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Edit Bookmark</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {/* QUESTION INFO */}
          <div className="mb-6 p-4 rounded-xl bg-accent/20 border border-border">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-foreground">{bookmark.question.question_name}</h3>
              <span className={`px-2 py-1 rounded border text-xs font-semibold ${getLevelColor(bookmark.question.level)}`}>
                {bookmark.question.level}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{getPlatformShort(bookmark.question.platform)}</span>
              <span>•</span>
              <span>{bookmark.question.type === 'HOMEWORK' ? 'HW' : 'CW'}</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add your notes about this question..."
                className="min-h-[100px] resize-none w-full p-3 border border-border rounded-2xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Update Bookmark'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
