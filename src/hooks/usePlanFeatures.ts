import { useAuth } from './useAuth';
import { useMemo } from 'react';

type QrFormat = 'png' | 'svg';

type PlanFeatures = {
  maxLinks: number;
  analyticsRetentionDays: number;
  qrFormats: readonly QrFormat[];
  passwordProtection: boolean;
  linkExpiry: boolean;
  clickLimits: boolean;
};

const PLAN_FEATURES: Record<'free' | 'pro' | 'business', PlanFeatures> = {
  free: {
    maxLinks: 20,
    analyticsRetentionDays: 7,
    qrFormats: ['png'],
    passwordProtection: false,
    linkExpiry: false,
    clickLimits: false,
  },
  pro: {
    maxLinks: Infinity,
    analyticsRetentionDays: Infinity,
    qrFormats: ['png', 'svg'],
    passwordProtection: true,
    linkExpiry: true,
    clickLimits: true,
  },
  business: {
    maxLinks: Infinity,
    analyticsRetentionDays: Infinity,
    qrFormats: ['png', 'svg'],
    passwordProtection: true,
    linkExpiry: true,
    clickLimits: true,
  },
};

export function usePlanFeatures() {
  const { user } = useAuth();

  const features = useMemo(() => {
    const plan = (user?.plan || 'free') as keyof typeof PLAN_FEATURES;
    return PLAN_FEATURES[plan] || PLAN_FEATURES.free;
  }, [user?.plan]);

  const isFree = user?.plan === 'free' || !user?.plan;

  return { features, isFree, plan: user?.plan || 'free' };
}