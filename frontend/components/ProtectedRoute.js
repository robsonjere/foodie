import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
