import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import type { ExtendedSession } from '@/types/session';

interface UseAuthOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { requireAuth: reqAuth = true, requireAdmin: reqAdmin = false, redirectTo } = options;
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session && reqAuth) {
      router.push(redirectTo || '/');
      return;
    }

    if (session && reqAdmin) {
      const extendedSession = session as unknown as ExtendedSession;
      if (extendedSession.user.role !== 'ADMIN') {
        router.push(redirectTo || '/dashboard');
      }
    }
  }, [session, isPending, reqAuth, reqAdmin, redirectTo, router]);

  const extendedSession = session as unknown as ExtendedSession | undefined;
  const isAdmin = extendedSession?.user.role === 'ADMIN';

  return {
    session: extendedSession,
    isPending,
    isAdmin,
    user: extendedSession?.user,
  };
};
