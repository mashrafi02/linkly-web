'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { User } from '@/types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Links',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    href: '/billing',
    label: 'Billing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

export function Sidebar({ user, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-stone-100">
        <Link href="/dashboard" className="flex items-center gap-2 group" onClick={onMobileClose}>
          <div className="w-8 h-8 bg-brand-800 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 9.5L9.5 6.5M6 12L4.5 13.5C3.4 14.6 1.4 14.6 0.5 13.5C-0.6 12.4-0.6 10.6 0.5 9.5L3 7C4.1 5.9 5.9 5.9 7 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 4L11.5 2.5C12.6 1.4 14.6 1.4 15.5 2.5C16.6 3.6 16.6 5.4 15.5 6.5L13 9C11.9 10.1 10.1 10.1 9 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-base font-semibold text-stone-900">Linkly</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-50 text-brand-800 border border-brand-100'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50',
                )}
              >
                <span className={isActive ? 'text-brand-700' : 'text-stone-400'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade prompt (only for free users) */}
      {user.plan === 'free' && (
        <div className="px-3 pb-2">
          <Link
            href="/billing?plan=pro"
            onClick={onMobileClose}
            className="block p-3 rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 text-white group hover:shadow-glow transition-all duration-300"
          >
            <p className="text-xs font-medium text-brand-200 mb-0.5">
              Free plan
            </p>
            <p className="text-sm font-semibold">
              Upgrade to Pro
            </p>
            <p className="text-xs text-brand-300 mt-1 flex items-center gap-1">
              Get unlimited links
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </p>
          </Link>
        </div>
      )}

      {/* User footer */}
      <div className="p-3 border-t border-stone-100">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
            {user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 truncate">
              {user.email}
            </p>
            <p className="text-xs text-stone-400 capitalize">{user.plan} plan</p>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all duration-200"
            aria-label="Log out"
            title="Log out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-stone-200 fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-72 max-w-[80vw] h-full bg-white shadow-lifted animate-fade-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}