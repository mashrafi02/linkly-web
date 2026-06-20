'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { User } from '@/types';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getUser();
    const token = auth.getToken();

    if (!currentUser || !token) {
      router.replace(redirectTo);
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router, redirectTo]);

  const logout = () => {
    auth.logout();
    router.replace('/login');
  };

  return { user, loading, logout };
}