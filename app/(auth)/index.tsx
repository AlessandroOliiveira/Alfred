import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useUserStore } from '@/store/useUserStore';

export default function AuthIndex() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Check if user is logged in
    if (user) {
      router.replace('/(app)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [user]);

  return <LoadingSpinner message="Carregando..." />;
}
