'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Link as LinkType, LinkAnalytics } from '@/types';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/stat-card';
import { ClicksAreaChart } from '@/components/charts/clicks-area-chart';
import { DonutChart } from '@/components/charts/donut-chart';
import { BarList } from '@/components/charts/bar-list';

type DateRange = '7d' | '30d' | '90d' | 'all';

function getFromDate(r: DateRange): Date | undefined {
  const now = new Date();
  if (r === '7d') return new Date(now.getTime() - 7 * 86400000);
  if (r === '30d') return new Date(now.getTime() - 30 * 86400000);
  if (r === '90d') return new Date(now.getTime() - 90 * 86400000);
  return undefined;
}

export default function LinkAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [link, setLink] = useState<LinkType | null>(null);
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>('30d');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const linkData = (await api.getLink(id)) as LinkType;
        setLink(linkData);

        const from = getFromDate(range);
        const analyticsData = (await api.getAnalytics(
          id,
          from?.toISOString(),
        )) as LinkAnalytics;
        setAnalytics(analyticsData);
      } catch {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, range, router]);

  const shortUrl = link
    ? `${process.env.NEXT_PUBLIC_API_URL}/r/${link.slug}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  const downloadQr = async (format: 'png' | 'svg') => {
    const res = await api.getQrCode(id, format, 600);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${link?.slug}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Top stats derived from analytics
  const topCountry = analytics?.countries?.[0]?.label || '—';
  const topDevice = analytics?.devices?.[0]?.label || '—';
  const topBrowser = analytics?.browsers?.[0]?.label || '—';

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-stone-100 rounded" />
          <div className="h-6 w-48 bg-stone-100 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-stone-200/80" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-2xl border border-stone-200/80" />
      </div>
    );
  }

  if (!link || !analytics) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to links
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-stone-900 mb-1">
              {link.title || `/r/${link.slug}`}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={copyLink}
                className="text-sm text-brand-700 hover:text-brand-800 font-medium transition-colors"
              >
                {shortUrl}
              </button>
              <button
                onClick={copyLink}
                className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                title="Copy"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-1 truncate max-w-md">
              → {link.originalUrl}
            </p>
          </div>

          {/* QR download */}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => downloadQr('png')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              QR PNG
            </Button>
            <Button variant="secondary" size="sm" onClick={() => downloadQr('svg')}>
              QR SVG
            </Button>
          </div>
        </div>
      </div>

      {/* Date range selector */}
      <div className="flex items-center gap-1 mb-6 bg-white rounded-xl border border-stone-200/80 p-1 w-fit">
        {([
          ['7d', '7 days'],
          ['30d', '30 days'],
          ['90d', '90 days'],
          ['all', 'All time'],
        ] as [DateRange, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setRange(value)}
            className={`px-3.5 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
              range === value
                ? 'bg-brand-50 text-brand-800 border border-brand-100'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total clicks"
          value={analytics.totalClicks}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
          }
        />
        <StatCard
          label="Top country"
          value={topCountry}
          sublabel={analytics.countries?.[0] ? `${analytics.countries[0].clicks} clicks` : undefined}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          }
        />
        <StatCard
          label="Top device"
          value={topDevice}
          sublabel={analytics.devices?.[0] ? `${analytics.devices[0].clicks} clicks` : undefined}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
          }
        />
        <StatCard
          label="Top browser"
          value={topBrowser}
          sublabel={analytics.browsers?.[0] ? `${analytics.browsers[0].clicks} clicks` : undefined}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg>
          }
        />
      </div>

      {/* Hero row: Area chart (3 cols) + Countries (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200/80 p-5 hover:shadow-soft transition-all duration-300">
          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            Clicks over time
          </h3>
          <p className="text-xs text-stone-400 mb-4">
            {analytics.totalClicks.toLocaleString()} total clicks in this period
          </p>
          <div className="h-72">
            <ClicksAreaChart data={analytics.timeseries} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl border border-stone-200/80 p-5 hover:shadow-soft transition-all duration-300">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">
            Countries
          </h3>
          <BarList data={analytics.countries} maxItems={6} />
        </div>
      </div>

      {/* Bottom row: Device (1) + Browser (1) + Referrers (2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 hover:shadow-soft transition-all duration-300">
          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            Devices
          </h3>
          <div className="h-56">
            <DonutChart data={analytics.devices} label="devices" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 hover:shadow-soft transition-all duration-300">
          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            Browsers
          </h3>
          <div className="h-56">
            <DonutChart data={analytics.browsers} label="browsers" />
          </div>
        </div>

        <div className="sm:col-span-2 bg-white rounded-2xl border border-stone-200/80 p-5 hover:shadow-soft transition-all duration-300">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">
            Referrers
          </h3>
          <BarList data={analytics.referrers} maxItems={8} />
        </div>
      </div>
    </div>
  );
}