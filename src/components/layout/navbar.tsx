'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/60 shadow-subtle'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-800 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white"
            >
              <path
                d="M6.5 9.5L9.5 6.5M6 12L4.5 13.5C3.4 14.6 1.4 14.6 0.5 13.5C-0.6 12.4 -0.6 10.6 0.5 9.5L3 7C4.1 5.9 5.9 5.9 7 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M10 4L11.5 2.5C12.6 1.4 14.6 1.4 15.5 2.5C16.6 3.6 16.6 5.4 15.5 6.5L13 9C11.9 10.1 10.1 10.1 9 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-stone-900">Linkly</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <a href="#features" className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors rounded-lg">
            Features
          </a>
          <a href="#how-it-works" className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors rounded-lg">
            How it works
          </a>
          <a href="#pricing" className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors rounded-lg">
            Pricing
          </a>
          <a href="#faq" className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors rounded-lg">
            FAQ
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">Get started free</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-stone-200 px-5 pb-5 animate-fade-in">
          <div className="flex flex-col gap-2 mb-4">
            <a href="#features" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
              How it works
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
              Pricing
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button variant="secondary" size="md" className="w-full">Log in</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md" className="w-full">Get started free</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}