import React from 'react';
import { Trash2, FileText } from 'lucide-react';

interface PdfPreviewProps {
  file: File;
  onRemove: () => void;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ file, onRemove }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-3 p-3 bg-muted/20 dark:bg-muted/10 rounded-2xl border border-border/40 dark:border-border/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-red-500/10 dark:bg-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground dark:text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-destructive hover:text-destructive/80 dark:text-destructive dark:hover:text-destructive/70 transition-colors p-2 rounded-2xl hover:bg-destructive/10 dark:hover:bg-destructive/20 flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
