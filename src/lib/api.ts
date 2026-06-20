import { HealthStatus } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || 'Something went wrong');
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  health: () => request<HealthStatus>('/health'),

  register: (email: string, password: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/auth/me'),

  getLinks: () => request('/links'),

  getLink: (id: string) => request(`/links/${id}`),

  createLink: (data: {
    originalUrl: string;
    customSlug?: string;
    title?: string;
    password?: string;
    expiresAt?: string;
    clickLimit?: number;
  }) =>
    request('/links', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLink: (id: string, data: Record<string, unknown>) =>
    request(`/links/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteLink: (id: string) =>
    request(`/links/${id}`, { method: 'DELETE' }),

  getQrCode: (id: string, format: 'png' | 'svg' = 'png', size = 300) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return fetch(
      `${API_URL}/links/${id}/qr?format=${format}&size=${size}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    );
  },

  getAnalytics: (linkId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const q = params.toString();
    return request(`/analytics/${linkId}${q ? `?${q}` : ''}`);
  },
};