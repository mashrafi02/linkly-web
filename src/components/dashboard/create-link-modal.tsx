'use client';

import { useState, FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Link as LinkType } from '@/types';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { UpgradeBadge } from '@/components/ui/upgrade-badge';

interface CreateLinkModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (link: LinkType) => void;
}

export function CreateLinkModal({ open, onClose, onCreated }: CreateLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [clickLimit, setClickLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { features, isFree } = usePlanFeatures();

  const reset = () => {
    setUrl('');
    setTitle('');
    setCustomSlug('');
    setPassword('');
    setExpiresAt('');
    setClickLimit('');
    setShowAdvanced(false);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    setLoading(true);

    try {
      const data: Record<string, unknown> = { originalUrl: url };
      if (title.trim()) data.title = title.trim();
      if (customSlug.trim()) data.customSlug = customSlug.trim();
      if (password.trim() && features.passwordProtection) data.password = password.trim();
      if (expiresAt && features.linkExpiry) data.expiresAt = new Date(expiresAt).toISOString();
      if (clickLimit && features.clickLimits) data.clickLimit = parseInt(clickLimit, 10);

      const link = (await api.createLink(data as any)) as LinkType;
      onCreated(link);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create a new link"
      subtitle="Shorten a URL and start tracking clicks."
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
          autoFocus
        />

        <Input
          label="Title (optional)"
          type="text"
          placeholder="My awesome link"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label="Custom slug (optional)"
          type="text"
          placeholder="my-link"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
        />

        {customSlug && (
          <p className="text-xs text-stone-400 -mt-2 pl-1">
            Your link will be:{' '}
            <span className="text-stone-600 font-medium">
              {process.env.NEXT_PUBLIC_API_URL}/r/{customSlug || '...'}
            </span>
          </p>
        )}

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
          {isFree && (
            <span className="text-xs text-amber-600 font-medium ml-1">Pro</span>
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-1 animate-fade-in">
            {/* Password */}
            <div className="relative">
              {!features.passwordProtection && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                  <UpgradeBadge feature="Password protection" />
                </div>
              )}
              <Input
                label="Password protection"
                type="password"
                placeholder="Set a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!features.passwordProtection}
              />
            </div>

            {/* Expiry */}
            <div className="relative">
              {!features.linkExpiry && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                  <UpgradeBadge feature="Link expiry" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  Expiry date
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
                label="Click limit"
                type="number"
                placeholder="e.g. 100"
                value={clickLimit}
                onChange={(e) => setClickLimit(e.target.value)}
                disabled={!features.clickLimits}
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}