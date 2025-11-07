import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { getNotificationService } from '@/services/notifications';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Request notification permissions on app start
    const setupNotifications = async () => {
      const notificationService = getNotificationService();
      await notificationService.requestPermissions();
    };
    setupNotifications();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
