'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link as LinkType } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

interface LinkCardProps {
  link: LinkType;
  onDeleted: (id: string) => void;
  onEdit: (link: LinkType) => void;
}

export function LinkCard({ link, onDeleted, onEdit }: LinkCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [now] = useState(() => Date.now());

  const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/r/${link.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast('Link copied to clipboard');
    } catch {
      toast('Failed to copy', 'error');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteLink(link.id);
      onDeleted(link.id);
      toast('Link deleted');
    } catch {
      toast('Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((now - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 hover:shadow-soft transition-all duration-300 overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side */}
          <div className="min-w-0 flex-1">
            {/* Short URL */}
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={copyLink}
                className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors truncate"
                title="Click to copy"
              >
                /r/{link.slug}
              </button>

              {/* Badges */}
              <div className="flex items-center gap-1.5">
                {link.passwordHash && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-[11px] font-medium text-amber-700">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Protected
                  </span>
                )}
                {link.expiresAt && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-[11px] font-medium text-stone-500">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Expires
                  </span>
                )}
                {link.clickLimit && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-[11px] font-medium text-stone-500">
                    {link.clickLimit} clicks max
                  </span>
                )}
                {!link.isActive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 border border-red-100 text-[11px] font-medium text-red-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            {link.title && (
              <p className="text-sm font-medium text-stone-800 truncate mb-1">
                {link.title}
              </p>
            )}

            {/* Original URL */}
            <p className="text-xs text-stone-400 truncate">
              {link.originalUrl}
            </p>
          </div>

          {/* Right side — actions */}
          <div className="flex items-center gap-1 transition-opacity duration-200">
            <button
              onClick={copyLink}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-lg transition-all duration-200"
              title="Copy short link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(link);
              }}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-lg transition-all duration-200"
              title="Edit link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            <button
              onClick={() => router.push(`/links/${link.id}`)}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-lg transition-all duration-200"
              title="View analytics"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
              </svg>
            </button>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
              >
                {deleting ? '...' : 'Confirm'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 py-2.5 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-400">
          {timeAgo(link.createdAt)}
        </span>
        <button
          onClick={() => router.push(`/links/${link.id}`)}
          className="text-xs text-stone-400 hover:text-brand-700 transition-colors flex items-center gap-1"
        >
          View analytics
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}