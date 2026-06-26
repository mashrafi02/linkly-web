'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Link as LinkType } from '@/types';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { UpgradeBadge } from '@/components/ui/upgrade-badge';

interface EditLinkModalProps {
  open: boolean;
  link: LinkType | null;
  onClose: () => void;
  onUpdated: (link: LinkType) => void;
}

export function EditLinkModal({ open, link, onClose, onUpdated }: EditLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState('');
  const [removePassword, setRemovePassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [clickLimit, setClickLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { features } = usePlanFeatures();

  // Populate fields when modal opens with a link
  useEffect(() => {
    if (link && open) {
      setUrl(link.originalUrl);
      setTitle(link.title || '');
      setIsActive(link.isActive);
      setExpiresAt(
        link.expiresAt
          ? new Date(link.expiresAt).toISOString().slice(0, 16)
          : '',
      );
      setClickLimit(link.clickLimit ? String(link.clickLimit) : '');
      setPassword('');
      setRemovePassword(false);
      setShowAdvanced(!!(link.passwordHash || link.expiresAt || link.clickLimit));
      setError('');
    }
  }, [link, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!link) return;
    setError('');

    if (!url) {
      setError('URL is required.');
      return;
    }

    setLoading(true);

    try {
      const data: Record<string, unknown> = {
        originalUrl: url,
        title: title.trim() || null,
        isActive,
      };

      if (expiresAt) data.expiresAt = new Date(expiresAt).toISOString();
      if (clickLimit) data.clickLimit = parseInt(clickLimit, 10);
      if (password.trim()) data.password = password.trim();
      if (removePassword) data.removePassword = true;

      const updated = (await api.updateLink(link.id, data)) as LinkType;
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update link.');
    } finally {
      setLoading(false);
    }
  };

  if (!link) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit link"
      subtitle={`/r/${link.slug}`}
    >
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Destination URL"
          type="url"
          placeholder="https://example.com/your-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Input
          label="Title (optional)"
          type="text"
          placeholder="My awesome link"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Slug (read-only) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-stone-700">Slug</label>
          <div className="w-full h-11 px-3.5 bg-stone-50 rounded-xl text-sm text-stone-400 border border-stone-200 flex items-center">
            /r/{link.slug}
            <span className="ml-auto text-xs text-stone-300">Cannot be changed</span>
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-stone-700">Active</p>
            <p className="text-xs text-stone-400">Inactive links return 404</p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              isActive ? 'bg-brand-600' : 'bg-stone-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-1 animate-fade-in">
            {/* Password section */}
            {link.passwordHash && !removePassword ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-stone-700">Password protection</p>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    Currently set
                  </span>
                </div>
                <Input
                  label="New password (leave empty to keep current)"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setRemovePassword(true)}
                  className="text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  Remove password protection
                </button>
              </div>
            ) : removePassword ? (
              <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600">Password will be removed on save</p>
                <button
                  type="button"
                  onClick={() => setRemovePassword(false)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 underline transition-colors"
                >
                  Undo
                </button>
              </div>
            ) : (
              <div className="relative">
                {!features.passwordProtection && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                    <UpgradeBadge feature="Password protection" />
                  </div>
                )}
                <Input
                  label="Password protection (optional)"
                  type="password"
                  placeholder="Set a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!features.passwordProtection}
                />
              </div>
            )}

            {/* Expiry */}
            <div className="relative">
              {!features.linkExpiry && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                  <UpgradeBadge feature="Link expiry" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  Expiry date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={!features.linkExpiry}
                  className="w-full h-11 px-3.5 bg-white rounded-xl text-sm text-stone-900 border border-stone-200 hover:border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Click limit */}
            <div className="relative">
              {!features.clickLimits && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                  <UpgradeBadge feature="Click limits" />
                </div>
              )}
              <Input
                label="Click limit (optional)"
                type="number"
                placeholder="e.g. 100"
                value={clickLimit}
                onChange={(e) => setClickLimit(e.target.value)}
                disabled={!features.clickLimits}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={loading} className="flex-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}