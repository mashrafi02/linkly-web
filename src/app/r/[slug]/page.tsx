'use client';

import { useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PasswordPage() {
  const { slug } = useParams<{ slug: string }>();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/r/${slug}/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status === 401) {
          setError('Incorrect password. Please try again.');
        } else if (res.status === 410) {
          setError('This link has expired and is no longer available.');
        } else {
          setError(body.message || 'Something went wrong.');
        }
        return;
      }

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError('Failed to verify. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-5">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-soft overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-8 pb-5 text-center">
            {/* Lock icon */}
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-brand-700"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="text-lg font-semibold text-stone-900 mb-1">
              This link is protected
            </h1>
            <p className="text-sm text-stone-500">
              Enter the password to continue to the destination.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  autoFocus
                  className="w-full h-11 px-3.5 bg-white rounded-xl text-sm text-stone-900 placeholder:text-stone-400 border border-stone-200 hover:border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5">
          <p className="text-xs text-stone-400">
            This link was created with{' '}
            <Link
              href="/"
              className="font-medium text-stone-500 hover:text-brand-700 transition-colors"
            >
              Linkly
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}