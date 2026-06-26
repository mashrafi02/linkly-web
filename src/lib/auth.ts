import { AuthResponse, User } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
export const AUTH_CHANGE_EVENT = 'auth-change';

export const auth = {
  saveSession(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  },
};