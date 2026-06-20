'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For personal use and trying things out.',
    features: [
      'Up to 20 short links',
      'Click analytics (7-day history)',
      'QR codes (PNG)',
      'Custom slug names',
      'Linkly branded domain',
    ],
    cta: 'Get started free',
    ctaVariant: 'secondary' as const,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For creators and marketers who need more.',
    features: [
      'Unlimited short links',
      'Full click analytics (all time)',
      'QR codes (PNG + SVG)',
      'Password-protected links',
      'Link expiry & click limits',
      'UTM campaign tracking',
    ],
    cta: 'Start free trial',
    ctaVariant: 'primary' as const,
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For teams and businesses at scale.',
    features: [
      'Everything in Pro',
      'Unlimited click history',
      'Priority email support',
      'Early access to new features',
    ],
    cta: 'Start free trial',
    ctaVariant: 'secondary' as const,
    highlight: false,
  },
];

interface PricingSectionProps {
  visible: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export function PricingSection({ visible, sectionRef }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 sm:py-28" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          className={`transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-brand-700 mb-2">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-stone-500 max-w-lg mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-300 hover:shadow-soft ${
                  plan.highlight
                    ? 'bg-white border-2 border-brand-200 shadow-glow'
                    : 'bg-white border border-stone-200/80'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-brand-800 text-white text-xs font-medium rounded-full">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-5">
                  <h3 className="text-base font-semibold text-stone-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-stone-500">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-stone-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-stone-400">{plan.period}</span>
                </div>

                <Link href="/register">
                  <Button
                    variant={plan.ctaVariant}
                    size="md"
                    className="w-full mb-6"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.highlight ? 'text-brand-600' : 'text-stone-300'
                        }`}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}