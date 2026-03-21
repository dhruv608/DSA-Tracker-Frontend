import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-medium text-foreground">{totalItems}</span> results
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            
            if (
              totalPages > 5 &&
              page !== 1 &&
              page !== totalPages &&
              (page < currentPage - 1 || page > currentPage + 1)
            ) {
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-muted-foreground">...</span>;
              }
              return null;
            }

            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
