import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Linkly — Smart link shortener with analytics',
    template: '%s | Linkly',
  },
  description:
    'Create branded short links, track every click, and understand your audience. The modern link management platform for marketers, creators, and businesses.',
  keywords: [
    'link shortener',
    'url shortener',
    'click analytics',
    'short links',
    'branded links',
    'QR code generator',
    'link tracking',
    'UTM tracking',
  ],
  authors: [{ name: 'Linkly' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Linkly',
    title: 'Linkly — Smart link shortener with analytics',
    description:
      'Create branded short links, track every click, and understand your audience.',
    /*
      OG IMAGE PLACEHOLDER
      ─────────────────────
      Create a 1200×630 image with:
      - Brand teal gradient background
      - "Linkly" logo + tagline centered
      - Clean, minimal design
      Save at public/images/og-image.png
      Then uncomment:
      images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Linkly' }],
    */
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linkly — Smart link shortener with analytics',
    description:
      'Create branded short links, track every click, and understand your audience.',
    // images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}