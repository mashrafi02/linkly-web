'use client';

import Link from 'next/link';

interface UpgradeBadgeProps {
  feature: string;
  plan?: string;
}

export function UpgradeBadge({ feature, plan = 'Pro' }: UpgradeBadgeProps) {
  return (
    <Link
      href={`/billing?plan=${plan.toLowerCase()}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {plan}+ only
    </Link>
  );
}