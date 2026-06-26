export interface User {
  id: string;
  email: string;
  plan: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Link {
  id: string;
  userId: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  passwordHash: string | null;
  expiresAt: string | null;
  clickLimit: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface ClickBreakdown {
  label: string;
  clicks: number;
}

export interface TimeseriesPoint {
  date: string;
  clicks: number;
}

export interface LinkAnalytics {
  totalClicks: number;
  timeseries: TimeseriesPoint[];
  countries: ClickBreakdown[];
  devices: ClickBreakdown[];
  browsers: ClickBreakdown[];
  os: ClickBreakdown[];
  referrers: ClickBreakdown[];
}

export type HealthStatus = {
  status: 'healthy' | 'degraded';
  postgres: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
};

export interface BillingStatus {
  subscription: {
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string;
  } | null;
}
