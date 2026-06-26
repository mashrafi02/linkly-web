'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth, AUTH_CHANGE_EVENT } from '@/lib/auth';
import { User } from '@/types';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback(() => {
    const currentUser = auth.getUser();
    const token = auth.getToken();

    if (!currentUser || !token) {
      router.replace(redirectTo);
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router, redirectTo]);

  useEffect(() => {
    syncUser();

    // Re-sync when any tab/component updates auth
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
  }, [syncUser]);

  const logout = () => {
    auth.logout();
    router.replace('/login');
  };

  return { user, loading, logout };
}