'use client';

import { useState, FormEvent } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  clientSecret: string;
  plan: 'pro' | 'business';
  onSuccess: () => void;
  onCancel: () => void;
}

const elementStyle = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
      fontWeight: '400',
      color: '#1c1917',
      letterSpacing: '0.01em',
      '::placeholder': {
        color: '#a8a29e',
      },
    },
    invalid: {
      color: '#e24b4a',
    },
  },
};

export function PaymentForm({
  clientSecret,
  plan,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError('');
    setLoading(true);

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumber,
        },
      },
    );

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please try again.');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  const price = plan === 'pro' ? '$9' : '$29';

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Card number */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-stone-700">
            Card number
          </label>
          <div className="h-11 px-3.5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all duration-200 flex items-center">
            <CardNumberElement
              options={{
                ...elementStyle,
                showIcon: true,
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Expiry + CVC row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">
              Expiry date
            </label>
            <div className="h-11 px-3.5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all duration-200 flex items-center">
              <CardExpiryElement options={elementStyle} className="w-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">
              CVC
            </label>
            <div className="h-11 px-3.5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all duration-200 flex items-center">
              <CardCvcElement options={elementStyle} className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-stone-600">
            Linkly {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
          </span>
          <span className="text-sm font-semibold text-stone-900">
            {price}/mo
          </span>
        </div>
        <p className="text-xs text-stone-400">
          You can cancel anytime. Your card will be charged today.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="flex-1"
          disabled={loading || !stripe}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            <>
              Pay {price}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </Button>
      </div>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-4 mt-5 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secured by Stripe
        </span>
        <span className="w-px h-3 bg-stone-200" />
        <span>256-bit encryption</span>
        <span className="w-px h-3 bg-stone-200" />
        <span>Cancel anytime</span>
      </div>
    </form>
  );
}