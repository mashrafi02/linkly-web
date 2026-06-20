'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { AuthResponse } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn()) router.replace('/dashboard');
  }, [router]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const data = (await api.register(email, password)) as AuthResponse;
      auth.saveSession(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <Link
        href="/"
        className="lg:hidden flex items-center gap-2 mb-10 group"
      >
        <div className="w-8 h-8 bg-brand-800 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6.5 9.5L9.5 6.5M6 12L4.5 13.5C3.4 14.6 1.4 14.6 0.5 13.5C-0.6 12.4-0.6 10.6 0.5 9.5L3 7C4.1 5.9 5.9 5.9 7 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10 4L11.5 2.5C12.6 1.4 14.6 1.4 15.5 2.5C16.6 3.6 16.6 5.4 15.5 6.5L13 9C11.9 10.1 10.1 10.1 9 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-stone-900">Linkly</span>
      </Link>

      <h1 className="text-2xl font-bold text-stone-900 mb-1.5">
        Create your account
      </h1>
      <p className="text-sm text-stone-500 mb-8">
        Start shortening links and tracking clicks in seconds.
      </p>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((p) => ({ ...p, email: '' }));
          }}
          error={fieldErrors.email}
          autoComplete="email"
          autoFocus
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((p) => ({ ...p, password: '' }));
          }}
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Type your password again"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldErrors((p) => ({ ...p, confirmPassword: '' }));
          }}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        {/* Password strength indicator */}
        {password && (
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => {
                const strength =
                  (password.length >= 6 ? 1 : 0) +
                  (/[A-Z]/.test(password) ? 1 : 0) +
                  (/[0-9]/.test(password) ? 1 : 0) +
                  (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

                const colors = ['bg-red-400', 'bg-amber-400', 'bg-brand-400', 'bg-brand-600'];
                const isActive = level <= strength;

                return (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      isActive ? colors[strength - 1] : 'bg-stone-100'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-stone-400">
              {password.length < 6
                ? 'Too short'
                : (() => {
                    const s =
                      (/[A-Z]/.test(password) ? 1 : 0) +
                      (/[0-9]/.test(password) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
                    return s === 0
                      ? 'Weak — add numbers or uppercase'
                      : s === 1
                        ? 'Fair — almost there'
                        : s === 2
                          ? 'Good'
                          : 'Strong';
                  })()}
            </p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-8">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-brand-700 hover:text-brand-800 transition-colors"
        >
          Log in
        </Link>
      </p>

      <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed">
        By creating an account you agree to our{' '}
        <a href="#" className="underline underline-offset-2 hover:text-stone-500 transition-colors">
          Terms
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-2 hover:text-stone-500 transition-colors">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}