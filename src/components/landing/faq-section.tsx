'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. The free plan includes 20 short links and basic analytics with no time limit. No credit card required to sign up.',
  },
  {
    q: 'Can I use my own custom domain?',
    a: 'Custom domains are available on the Business plan. You point your domain (like go.yourbrand.com) to our servers, and all your short links use your brand.',
  },
  {
    q: 'What analytics do you track?',
    a: 'We track total clicks, clicks over time, country, city, device type, browser, operating system, referrer source, and UTM campaign parameters. All in real time.',
  },
  {
    q: 'How do password-protected links work?',
    a: 'When someone clicks a password-protected short link, they see a clean page asking for the password. Only after entering the correct password are they redirected to the destination. Great for sharing private content.',
  },
  {
    q: 'Can I change the destination URL after creating a link?',
    a: 'Yes. You can update the destination URL, title, password, expiry, and click limit at any time from your dashboard. The short link stays the same.',
  },
  {
    q: 'Do short links expire?',
    a: 'By default, links never expire. But you can set an expiry date or a click limit when creating or editing a link. Once the condition is met, the link is automatically removed.',
  },
];

interface FaqSectionProps {
  visible: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export function FaqSection({ visible, sectionRef }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white" ref={sectionRef}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div
          className={`transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-brand-700 mb-2">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Questions? Answers.
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;

              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'bg-white border-stone-200 shadow-soft'
                      : 'bg-stone-50/50 border-stone-100 hover:border-stone-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isOpen ? 'text-stone-900' : 'text-stone-700'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`flex-shrink-0 text-stone-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 pb-4 text-sm text-stone-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}