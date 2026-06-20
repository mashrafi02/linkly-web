'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Link as LinkType } from '@/types';
import { Button } from '@/components/ui/button';
import { LinkCard } from '@/components/dashboard/link-card';
import { CreateLinkModal } from '@/components/dashboard/create-link-modal';
import { EmptyState } from '@/components/dashboard/empty-state';
import { useToast } from '@/components/ui/toast';
import { EditLinkModal } from '@/components/dashboard/edit-link-modal';

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editLink, setEditLink] = useState<LinkType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = (await api.getLinks()) as LinkType[];
        setLinks(data);
      } catch {
        toast('Failed to load links', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleCreated = (link: LinkType) => {
    setLinks((prev) => [link, ...prev]);
    toast('Link created successfully');
  };

  const handleUpdated = (updated: LinkType) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l)),
    );
    toast('Link updated successfully');
  };

  const handleDeleted = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const filteredLinks = links.filter((link) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      link.slug.toLowerCase().includes(q) ||
      link.originalUrl.toLowerCase().includes(q) ||
      link.title?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">Your links</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {links.length} link{links.length !== 1 ? 's' : ''} created
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New link
        </Button>
      </div>

      {/* Search (only show if there are links) */}
      {links.length > 0 && (
        <div className="relative mb-6">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by slug, URL, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 h-10 pl-10 pr-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-5 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-32 bg-stone-100 rounded-md" />
                  <div className="h-3 w-56 bg-stone-100 rounded-md" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between">
                <div className="h-3 w-16 bg-stone-50 rounded-md" />
                <div className="h-3 w-24 bg-stone-50 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : links.length === 0 ? (
        <EmptyState onCreateClick={() => setModalOpen(true)} />
      ) : filteredLinks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-stone-500">
            No links match &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-brand-700 hover:text-brand-800 mt-2 transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid gap-3 animate-fade-in">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} onEdit={setEditLink} onDeleted={handleDeleted} />
          ))}
        </div>
      )}

      {/* Create modal */}
      <CreateLinkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />

      {/* Edit modal */}
      <EditLinkModal
        open={!!editLink}
        link={editLink}
        onClose={() => setEditLink(null)}
        onUpdated={handleUpdated}
      />
    </>
  );
}