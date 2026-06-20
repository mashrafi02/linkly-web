'use client';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {/* Illustration */}
      <div className="w-20 h-20 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-brand-600" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-stone-900 mb-1.5">
        No links yet
      </h3>
      <p className="text-sm text-stone-500 mb-6 text-center max-w-xs">
        Create your first short link and start tracking clicks in real time.
      </p>

      <Button variant="primary" size="md" onClick={onCreateClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create your first link
      </Button>
    </div>
  );
}