'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PaymentForm } from '@/components/billing/billing-form';
import { useToast } from '@/components/ui/toast';
import { BillingStatus } from '@/types';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type Plan = 'pro' | 'business';

const planInfo: Record<Plan, { name: string; price: string; features: string[] }> = {
  pro: {
    name: 'Pro',
    price: '$9',
    features: [
      'Unlimited short links',
      'Full click analytics (all time)',
      'QR codes (PNG + SVG)',
      'Password-protected links',
      'Link expiry & click limits',
      'UTM campaign tracking',
    ],
  },
  business: {
    name: 'Business',
    price: '$29',
    features: [
      'Everything in Pro',
      'Unlimited click history',
      'Priority email support',
      'Early access to new features',
    ],
  },
};

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const planParam = searchParams.get('plan') as Plan | null;
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(planParam);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadBillingStatus = async () => {
    try {
      const status = await api.getBillingStatus();
      setBillingStatus(status);
    } catch {}
  };

  useEffect(() => {
    api
      .getBillingStatus()
      .then(setBillingStatus)
      .catch(() => {});
  }, []);

  const startSubscription = async (plan: Plan) => {
    setSelectedPlan(plan);
    setLoadingSecret(true);
    setClientSecret(null);

    try {
      const data = (await api.subscribe(plan)) as {
        clientSecret: string;
        subscriptionId: string;
      };
      setClientSecret(data.clientSecret);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to start subscription';
      toast(message, 'error');
      setSelectedPlan(null);
    } finally {
      setLoadingSecret(false);
    }
  };

  const handleSuccess = () => {
    setSuccess(true);

    // Update local user data
    const currentUser = auth.getUser();
    if (currentUser && selectedPlan) {
      auth.saveSession({
        accessToken: auth.getToken()!,
        user: { ...currentUser, plan: selectedPlan },
      });
    }

    toast('Subscription activated!');

    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.cancelSubscription();
      toast('Subscription will cancel at end of billing period');
      await loadBillingStatus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cancel';
      toast(message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-brand-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">
          Welcome to {selectedPlan === 'pro' ? 'Pro' : 'Business'}!
        </h1>
        <p className="text-sm text-stone-500">
          Redirecting you to the dashboard...
        </p>
      </div>
    );
  }

  // Payment form state
  if (selectedPlan && clientSecret) {
    const info = planInfo[selectedPlan];

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <button
          onClick={() => {
            setSelectedPlan(null);
            setClientSecret(null);
          }}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to plans
        </button>

        <h1 className="text-xl font-semibold text-stone-900 mb-1">
          Upgrade to {info.name}
        </h1>
        <p className="text-sm text-stone-500 mb-8">
          {info.price}/month — enter your card details below.
        </p>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-subtle">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'flat',
                variables: {
                  fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                  borderRadius: '12px',
                },
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              plan={selectedPlan}
              onSuccess={handleSuccess}
              onCancel={() => {
                setSelectedPlan(null);
                setClientSecret(null);
              }}
            />
          </Elements>
        </div>
      </div>
    );
  }

  // Plan selection state
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-stone-900 mb-1">Billing</h1>
      <p className="text-sm text-stone-500 mb-8">
        Manage your subscription and payment method.
      </p>

      {/* Current plan status */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500 mb-1">Current plan</p>
            <p className="text-lg font-semibold text-stone-900 capitalize">
              {user?.plan || 'Free'}
            </p>
            {billingStatus?.subscription?.cancelAtPeriodEnd && (
              <p className="text-xs text-amber-600 mt-1">
                Cancels on{' '}
                {new Date(
                  billingStatus.subscription.currentPeriodEnd,
                ).toLocaleDateString()}
              </p>
            )}
          </div>
          {user?.plan !== 'free' && !billingStatus?.subscription?.cancelAtPeriodEnd && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={cancelling}
              className="text-stone-400 hover:text-red-500"
            >
              {cancelling ? 'Cancelling...' : 'Cancel plan'}
            </Button>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {(['pro', 'business'] as Plan[]).map((plan) => {
          const info = planInfo[plan];
          const isCurrent = user?.plan === plan;

          return (
            <div
              key={plan}
              className={`rounded-2xl p-5 transition-all duration-300 ${
                isCurrent
                  ? 'bg-brand-50/50 border-2 border-brand-200'
                  : 'bg-white border border-stone-200/80 hover:shadow-soft'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-stone-900">
                  {info.name}
                </h3>
                {isCurrent && (
                  <span className="text-xs font-medium text-brand-700 bg-brand-100 px-2.5 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-bold text-stone-900">
                  {info.price}
                </span>
                <span className="text-sm text-stone-400">/month</span>
              </div>

              <ul className="space-y-2.5 mb-5">
                {info.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="flex-shrink-0 mt-0.5 text-brand-600"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-stone-600">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="h-10 flex items-center justify-center text-sm text-stone-400">
                  You&apos;re on this plan
                </div>
              ) : (
                <Button
                  variant={plan === 'pro' ? 'primary' : 'secondary'}
                  size="md"
                  className="w-full"
                  onClick={() => startSubscription(plan)}
                  disabled={loadingSecret}
                >
                  {loadingSecret && selectedPlan === plan ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    `Upgrade to ${info.name}`
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}