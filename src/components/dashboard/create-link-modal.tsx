'use client';

import { useState, FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Link as LinkType } from '@/types';

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
      if (password.trim()) data.password = password.trim();
      if (expiresAt) data.expiresAt = new Date(expiresAt).toISOString();
      if (clickLimit) data.clickLimit = parseInt(clickLimit, 10);

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
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-1 animate-fade-in">
            <Input
              label="Password protection (optional)"
              type="password"
              placeholder="Set a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-stone-700">
                Expiry date (optional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full h-11 px-3.5 bg-white rounded-xl text-sm text-stone-900 border border-stone-200 hover:border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all duration-200"
              />
            </div>

            <Input
              label="Click limit (optional)"
              type="number"
              placeholder="e.g. 100"
              value={clickLimit}
              onChange={(e) => setClickLimit(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={loading} className="flex-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create link'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}