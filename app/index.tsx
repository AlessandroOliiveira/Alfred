import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';

export default function Index() {
  const user = useUserStore((state) => state.user);

  // Redirect based on auth state
  if (user) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
