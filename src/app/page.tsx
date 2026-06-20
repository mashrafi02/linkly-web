'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { PricingSection } from '@/components/landing/pricing-section';
import { FaqSection } from '@/components/landing/faq-section';

/* ─── Scroll reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
}

/* ─── Feature data ─── */
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: 'Smart short links',
    description:
      'Create clean branded links with custom slugs. Set passwords, expiry dates, and click limits to control exactly who sees your content.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
    title: 'Click analytics',
    description:
      'Know exactly who clicks your links. See countries, devices, browsers, referrers, and UTM campaigns — all in a real‑time dashboard.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'QR codes',
    description:
      'Generate print‑ready QR codes in PNG or SVG for every link. Perfect for packaging, flyers, business cards, and real‑world campaigns.',
  },
];

/* ─── Steps data ─── */
const steps = [
  { number: '01', title: 'Paste your link', description: 'Drop in any long URL. Add an optional custom slug, password, or expiry.' },
  { number: '02', title: 'Share everywhere', description: 'Use your short link on social media, email, SMS, print — anywhere.' },
  { number: '03', title: 'Track results', description: 'Watch clicks roll in. See who, where, and what device — in real time.' },
];

/* ─── Page ─── */
export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'down'>('checking');
  const [featuresRef, featuresVisible] = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();
  const [pricingRef, pricingVisible] = useReveal();
  const [faqRef, faqVisible] = useReveal();

  useEffect(() => {
    api.health()
      .then((d) => setApiStatus(d.status === 'healthy' ? 'healthy' : 'down'))
      .catch(() => setApiStatus('down'));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(to bottom, #fafaf9, #ffffff)' }}
        />
        <Image
          src="/images/hero-bg.png"
          alt="hero bg image"
          height={1080}
          width={1920}
          // fill
          priority
          className="absolute inset-0 -z-10 object-cover"
        />

        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 border border-brand-200/60 text-brand-800 rounded-full text-xs font-medium mb-6 animate-fade-in opacity-0">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
              Now in public beta
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight text-balance mb-5 animate-fade-in-up opacity-0 delay-100">
              Short links,{' '}
              <span className="text-brand-700">big insights</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-stone-500 leading-relaxed max-w-xl mx-auto mb-10 animate-fade-in-up opacity-0 delay-200">
              Create branded links, track every click, and understand your
              audience — all from one calm, clean dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up opacity-0 delay-300">
              <Link href="/register">
                <Button size="lg" variant="primary">
                  Start for free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="secondary">
                  See features
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-stone-400 animate-fade-in opacity-0 delay-500">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                Free forever plan
              </span>
              <span className="w-px h-4 bg-stone-200" />
              <span>No credit card needed</span>
              <span className="w-px h-4 bg-stone-200 hidden sm:block" />
              <span className="hidden sm:inline">Setup in 30 seconds</span>
            </div>
          </div>

          {/*
            DASHBOARD PREVIEW PLACEHOLDER
            ──────────────────────────────
            Replace this with a real screenshot of your dashboard (step 15).
            Take a 1280×800 screenshot, add a subtle border radius, and
            a soft shadow. Export as WebP for performance.
            For now, this is a styled placeholder.
          */}
          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto animate-fade-in-up opacity-0 delay-500">
            <div className="relative rounded-2xl border border-stone-200/80 shadow-lifted bg-white overflow-hidden">
              <div className="border-b border-stone-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-stone-200" />
                  <div className="w-3 h-3 rounded-full bg-stone-200" />
                  <div className="w-3 h-3 rounded-full bg-stone-200" />
                </div>
                <div className="flex-1 mx-12">
                  <div className="max-w-sm mx-auto h-5 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center">
                    <span className="text-[11px] text-stone-300">app.linkly.io/dashboard</span>
                  </div>
                </div>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
                <p className="text-stone-300 text-sm">Dashboard preview — add screenshot after step 15</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            ref={featuresRef}
            className={`transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-brand-700 mb-2">Features</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Everything you need, nothing you don&apos;t
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:border-stone-200 hover:shadow-soft transition-all duration-300"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            ref={stepsRef}
            className={`transition-all duration-700 ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-brand-700 mb-2">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Three steps. Thirty seconds.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-5">
              {steps.map((s, i) => (
                <div key={s.number} className="relative" style={{ transitionDelay: `${i * 100}ms` }}>
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-px border-t border-dashed border-stone-200" />
                  )}
                  <p className="text-4xl font-bold text-brand-200 mb-3">{s.number}</p>
                  <h3 className="text-base font-semibold text-stone-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <PricingSection
        visible={pricingVisible}
        sectionRef={pricingRef}
      />

      {/* ── FAQ ── */}
      <FaqSection
        visible={faqVisible}
        sectionRef={faqRef}
      />

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            ref={ctaRef}
            className={`transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="relative rounded-3xl bg-brand-950 px-6 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
              {/* Subtle glow */}
              <div
                className="absolute inset-0 -z-0"
                style={{
                  background:
                    'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(8, 125, 118, 0.25), transparent)',
                }}
              />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                  Ready to shorten smarter?
                </h2>
                <p className="text-brand-300 text-base sm:text-lg max-w-md mx-auto mb-8">
                  Join now and start tracking your first link in under a minute. Free forever, no credit card.
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-brand-900! hover:bg-brand-50 hover:text-white! active:bg-brand-100 shadow-soft"
                  >
                    Get started free
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200 py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <div className="w-5 h-5 bg-brand-800 rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 9.5L9.5 6.5M6 12L4.5 13.5C3.4 14.6 1.4 14.6 0.5 13.5C-0.6 12.4-0.6 10.6 0.5 9.5L3 7C4.1 5.9 5.9 5.9 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 4L11.5 2.5C12.6 1.4 14.6 1.4 15.5 2.5C16.6 3.6 16.6 5.4 15.5 6.5L13 9C11.9 10.1 10.1 10.1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span>Linkly</span>
          </div>

          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} Linkly. All rights reserved.
          </p>

          {/* API status */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                apiStatus === 'healthy'
                  ? 'bg-emerald-500'
                  : apiStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-red-400'
              }`}
            />
            System {apiStatus === 'healthy' ? 'operational' : apiStatus === 'checking' ? 'checking...' : 'offline'}
          </div>
        </div>
      </footer>
    </div>
  );
}